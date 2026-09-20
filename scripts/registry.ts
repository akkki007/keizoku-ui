import fs from 'node:fs';
import path from 'node:path';
import { isBuiltin } from 'node:module';
import ts from 'typescript';

/** Where installed components fetch their demo assets from. Override in CI
 *  (or locally against `next dev`) with REGISTRY_ORIGIN. */
export const REGISTRY_ORIGIN = process.env.REGISTRY_ORIGIN ?? 'https://keizoku.akkki.tech';
export const REGISTRY_NAME = 'keizoku-ui';
export const COMPONENT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type FileType = 'registry:ui' | 'registry:block' | 'registry:hook' | 'registry:lib' | 'registry:file';
type ItemType = FileType | 'registry:theme';
export interface RegistryFile { path: string; target: string; type: FileType; content: string }
export interface RegistryItem {
    $schema: string;
    name: string;
    type: ItemType;
    dependencies: string[];
    files: RegistryFile[];
    cssVars?: { theme?: Record<string, string>; light?: Record<string, string>; dark?: Record<string, string> };
    css?: Record<string, unknown>;
    docs?: string;
    meta?: { remoteAssets?: string[] };
}
export interface Registry { $schema: string; name: string; homepage: string; items: RegistryItem[] }

/**
 * The only CSS a Keizoku component needs that a shadcn project does not
 * already have. Four durations and two curves — no colour, no radius, no
 * opinion about the host project's palette. The CLI merges this into the
 * consumer's stylesheet on install, which is why there is no "paste the
 * tokens first" step.
 *
 * Components reference these as arbitrary values (`duration-[var(--k-dur-2)]`)
 * rather than through a Tailwind theme key, so a plain `:root` rule is enough
 * and nothing depends on the consumer's `@theme` block.
 *
 * 0.01ms rather than 0 under reduced motion, so `transitionend` still fires
 * and anything awaiting it does not hang.
 */
export const MOTION_CSS = {
    ':root': {
        '--k-dur-1': '120ms',
        '--k-dur-2': '200ms',
        '--k-dur-3': '320ms',
        '--k-dur-draw': '640ms',
        '--k-ease-travel': 'cubic-bezier(0.65, 0, 0.35, 1)',
        '--k-ease-draw': 'linear',
    },
    '@media (prefers-reduced-motion: reduce)': {
        ':root': {
            '--k-dur-1': '0.01ms',
            '--k-dur-2': '0.01ms',
            '--k-dur-3': '0.01ms',
            '--k-dur-draw': '0.01ms',
        },
    },
} as const;

const slash = (value: string) => value.split(path.sep).join('/');

/**
 * Source-relative paths (from `src/`) that must never be packaged. These are
 * site chrome, not library surface: an installer pulling one would get the
 * docs site's own layout rather than a component. If a ui/ or block/ entry
 * imports one, the build fails loudly rather than shipping it.
 */
export const REGISTRY_EXCLUDE = new Set([
    'app/globals.css',
    'components/site/theme-provider.tsx',
]);

export function isWithin(directory: string, filename: string): boolean {
    const relative = path.relative(directory, filename);
    return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function walk(directory: string): string[] {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const filename = path.join(directory, entry.name);
        if (entry.isSymbolicLink()) throw new Error(`Registry sources cannot be symlinks: ${filename}`);
        return entry.isDirectory() ? walk(filename) : [filename];
    }).sort();
}

function resolveSource(sourceRoot: string, importer: string, specifier: string): string {
    const base = specifier.startsWith('@/')
        ? path.resolve(sourceRoot, specifier.slice(2))
        : path.resolve(path.dirname(importer), specifier);
    const candidates = [
        base,
        ...['.ts', '.tsx', '.js', '.jsx', '.json', '.css'].map(extension => base + extension),
        ...['.ts', '.tsx', '.js', '.jsx'].map(extension => path.join(base, `index${extension}`)),
    ];
    const filename = candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!filename || !isWithin(sourceRoot, fs.realpathSync(filename))) {
        throw new Error(`Cannot package local import ${specifier} in ${importer}`);
    }
    if (!/\.(?:tsx?|jsx?|css|json|svg)$/.test(filename)) {
        throw new Error(`Unsupported imported asset ${filename}; use a public asset URL`);
    }
    return filename;
}

/** Decide where a packaged file lands in the consumer's project. */
function describeFile(sourceRoot: string, filename: string): Omit<RegistryFile, 'content'> {
    const relative = slash(path.relative(sourceRoot, filename));
    const groups: [string, string, FileType][] = [
        ['components/ui/', '@ui/', 'registry:ui'],
        ['components/block/', '@components/block/', 'registry:block'],
        ['components/', '@components/', 'registry:block'],
        ['hooks/', '@hooks/', 'registry:hook'],
        ['lib/', '@lib/', 'registry:lib'],
    ];
    const group = groups.find(([prefix]) => relative.startsWith(prefix));
    if (!group) throw new Error(`Registry import needs an explicit installation target: ${relative}`);
    return {
        path: relative,
        target: group[1] + relative.slice(group[0].length),
        type: /\.(?:css|svg|json)$/.test(filename) ? 'registry:file' : group[2],
    };
}

/** Build in memory first: a broken import must not leave half-written manifests on disk. */
export function buildRegistry(projectRoot: string, origin = REGISTRY_ORIGIN): Registry {
    const sourceRoot = path.resolve(projectRoot, 'src');
    const publicRoot = path.resolve(projectRoot, 'public');
    const entrypoints = ['ui', 'block']
        .flatMap(folder => walk(path.join(sourceRoot, 'components', folder)))
        .filter(filename => /\.[jt]sx$/.test(filename));
    const names = new Set<string>();

    const items: RegistryItem[] = entrypoints.map((entrypoint): RegistryItem => {
        const name = path.basename(entrypoint, path.extname(entrypoint));
        if (!COMPONENT_NAME.test(name) || ['index', 'registry'].includes(name) || names.has(name)) {
            throw new Error(`Invalid or duplicate registry name: ${name}`);
        }
        names.add(name);

        const files = new Map<string, RegistryFile>();
        const dependencies = new Set<string>();
        const remoteAssets = new Set<string>();

        /** Rewrite `/public` references so an installed component still resolves
         *  its demo media. SVGs are small enough to travel with the payload. */
        const assetUrl = (url: string): string => {
            if (!url.startsWith('/') || url.startsWith('//')) return url;
            const asset = path.resolve(publicRoot, '.' + url.split(/[?#]/)[0]);
            if (!isWithin(publicRoot, asset) || !fs.existsSync(asset) || !fs.statSync(asset).isFile()) return url;
            if (!isWithin(publicRoot, fs.realpathSync(asset))) throw new Error(`Public asset escapes registry root: ${url}`);
            if (path.extname(asset) === '.svg') {
                const target = 'public/' + slash(path.relative(publicRoot, asset));
                files.set(asset, { path: target, target, type: 'registry:file', content: fs.readFileSync(asset, 'utf8') });
                return url;
            }
            // Registry payloads are text-only; binary media stays on the public host.
            const remote = new URL(url, origin).href;
            remoteAssets.add(remote);
            return remote;
        };

        const visit = (filename: string) => {
            if (files.has(filename)) return;
            const relativePath = slash(path.relative(sourceRoot, filename));
            if (REGISTRY_EXCLUDE.has(relativePath)) {
                throw new Error(
                    `Registry component imports site chrome that cannot be installed: "${relativePath}".\n` +
                    `Components under ui/ and block/ must stand alone in a consumer project.`
                );
            }

            let content = fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n');
            const file = { ...describeFile(sourceRoot, filename), content };
            files.set(filename, file); // Mark before following imports, so cycles terminate.

            const imports = new Set<string>();
            if (filename.endsWith('.css')) {
                for (const match of content.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/g)) imports.add(match[1]);
                for (const match of content.matchAll(/url\(\s*["']?(\.[^)"']+)/g)) imports.add(match[1].trim());
                content = content.replace(/url\(\s*(["']?)(\/[^)"']+)\1\s*\)/g,
                    (_, quote: string, url: string) => `url(${quote}${assetUrl(url)}${quote})`);
            } else if (/\.[jt]sx?$/.test(filename)) {
                const ast = ts.createSourceFile(filename, content, ts.ScriptTarget.Latest, true);
                const edits: { start: number; end: number; value: string }[] = [];
                const inspect = (node: ts.Node) => {
                    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                        imports.add(node.moduleSpecifier.text);
                    }
                    if (ts.isCallExpression(node) && node.arguments.length && ts.isStringLiteralLike(node.arguments[0])) {
                        const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
                        const isRequire = ts.isIdentifier(node.expression) && node.expression.text === 'require';
                        if (isDynamicImport || isRequire) imports.add(node.arguments[0].text);
                    }
                    if (ts.isStringLiteralLike(node)) {
                        const rewritten = assetUrl(node.text);
                        if (rewritten !== node.text) edits.push({ start: node.getStart(ast) + 1, end: node.getEnd() - 1, value: rewritten });
                    }
                    ts.forEachChild(node, inspect);
                };
                inspect(ast);
                for (const edit of edits.sort((a, b) => b.start - a.start)) {
                    content = content.slice(0, edit.start) + edit.value + content.slice(edit.end);
                }
            }
            file.content = content;

            for (const specifier of imports) {
                if (specifier.startsWith('@/') || specifier.startsWith('.')) {
                    visit(resolveSource(sourceRoot, filename, specifier));
                } else if (!isBuiltin(specifier) && !/^(?:https?:|data:)/.test(specifier)) {
                    const packageName = specifier.startsWith('@')
                        ? specifier.split('/').slice(0, 2).join('/')
                        : specifier.split('/')[0];
                    // The consumer already has these; shadcn init guarantees them.
                    if (!['react', 'react-dom', 'next'].includes(packageName)) dependencies.add(packageName);
                }
            }
        };

        visit(entrypoint);

        const notes: string[] = [];
        if (remoteAssets.size) notes.push('Demo media loads from keizoku.akkki.tech by default. Swap these URLs for your own assets before shipping.');
        notes.push('This component reads your project\'s own shadcn tokens — background, foreground, border, muted — so it arrives already themed. For the warm-paper Keizoku palette instead, add the theme: npx shadcn@latest add "' + origin + '/r/theme.json"');

        return {
            $schema: 'https://ui.shadcn.com/schema/registry-item.json',
            name,
            type: describeFile(sourceRoot, entrypoint).type,
            dependencies: [...dependencies].sort(),
            files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)),
            css: { ...MOTION_CSS },
            docs: notes.join('\n\n'),
            ...(remoteAssets.size ? { meta: { remoteAssets: [...remoteAssets].sort() } } : {}),
        };
    }).sort((a, b) => a.name.localeCompare(b.name));

    items.push(buildThemeItem(projectRoot, origin));
    items.sort((a, b) => a.name.localeCompare(b.name));

    return { $schema: 'https://ui.shadcn.com/schema/registry.json', name: REGISTRY_NAME, homepage: origin, items };
}


/* ── The optional theme ───────────────────────────────────────────────────
 * Components speak shadcn's vocabulary, so they inherit whatever palette the
 * host project already has. This item is the other half of that bargain: one
 * command that replaces those values with Keizoku's, for anyone who wants the
 * warm-paper look rather than just the layout.
 *
 * Its values are read out of the real stylesheet rather than transcribed, so
 * the theme a consumer installs and the theme this site runs on cannot drift.
 */

/** Pull the `--name: value` declarations out of one CSS block. */
function readBlock(css: string, selector: string, occurrence = 1): Record<string, string> {
    let index = -1;
    for (let found = 0; found < occurrence; found++) {
        index = css.indexOf(selector + ' {', index + 1);
        if (index === -1) throw new Error(`Token stylesheet has no "${selector}" block #${occurrence}`);
    }
    let depth = 0;
    let end = css.indexOf('{', index);
    const start = end + 1;
    for (; end < css.length; end++) {
        if (css[end] === '{') depth++;
        else if (css[end] === '}' && --depth === 0) break;
    }
    const body = css.slice(start, end);
    const declarations: Record<string, string> = {};
    for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
        declarations[match[1]] = match[2].replace(/\s+/g, ' ').trim();
    }
    return declarations;
}

const pick = (source: Record<string, string>, keep: (name: string) => boolean) =>
    Object.fromEntries(Object.entries(source).filter(([name]) => keep(name)));

/** Site-only values, and values that belong to the components rather than the
 *  palette. Fonts are excluded on purpose: they would point a consumer at a
 *  `--font-geist` variable no one in their project defines. */
const isPaletteVar = (name: string) =>
    !name.startsWith('--k-') &&
    !name.startsWith('--hero-') &&
    !name.startsWith('--font-') &&
    !name.startsWith('--ease-') &&
    name !== '--grain-opacity';

export function buildThemeItem(projectRoot: string, origin = REGISTRY_ORIGIN): RegistryItem {
    const css = fs.readFileSync(path.resolve(projectRoot, 'src/styles/keizoku.css'), 'utf8');
    const primitives = pick(readBlock(css, ':root', 1), isPaletteVar);
    const light = pick(readBlock(css, ':root', 2), isPaletteVar);
    const dark = pick(readBlock(css, '.dark', 1), isPaletteVar);
    const mapped = readBlock(css, '@theme inline', 1);

    // A silent partial theme is worse than a failed build.
    for (const [label, block] of [['light', light], ['dark', dark]] as const) {
        for (const required of ['--background', '--foreground', '--border', '--radius']) {
            if (required === '--radius' && label === 'dark') continue;
            if (!(required in block)) throw new Error(`Theme item is missing ${required} in the ${label} block`);
        }
    }
    const ramp = Object.keys(primitives).filter(name => name.startsWith('--sumi-'));
    if (ramp.length < 12) throw new Error(`Theme item found only ${ramp.length} sumi steps; the ramp shape changed`);

    // Only the names a shadcn project does not already map for itself.
    const theme = pick(mapped, name =>
        name.startsWith('--color-sumi-') || name.startsWith('--color-shu-') ||
        name === '--color-meta' || name.startsWith('--color-brand') ||
        name === '--ease-travel' || name === '--ease-draw');

    return {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        name: 'theme',
        type: 'registry:theme',
        dependencies: [],
        files: [],
        cssVars: { theme, light: { ...primitives, ...light }, dark },
        css: { ...MOTION_CSS },
        docs: [
            'Keizoku\'s palette is now in your stylesheet: a warm neutral ramp (sumi) and one vermilion accent (shu), in both themes.',
            'Fonts are not included — they would point at variables your project does not define. Keizoku pairs Geist with Geist Mono for every label, count and status; see ' + origin + '/docs/theming.',
        ].join('\n\n'),
    };
}

export function writeRegistry(projectRoot: string, registry: Registry): void {
    const names = registry.items.map(item => item.name);
    if (new Set(names).size !== names.length || names.some(name => !COMPONENT_NAME.test(name) || ['index', 'registry'].includes(name))) {
        throw new Error('Invalid or duplicate registry output names');
    }
    const directory = path.resolve(projectRoot, 'public', 'r');
    fs.mkdirSync(directory, { recursive: true });
    if (!isWithin(fs.realpathSync(projectRoot), fs.realpathSync(directory))) throw new Error('Registry output escapes project root');

    const expected = new Set(['index.json', 'registry.json', ...registry.items.map(item => `${item.name}.json`)]);
    for (const name of expected) {
        const filename = path.join(directory, name);
        const existing = fs.lstatSync(filename, { throwIfNoEntry: false });
        if (existing && (!existing.isFile() || existing.isSymbolicLink())) {
            throw new Error(`Registry output must be a regular file: ${filename}`);
        }
    }
    for (const item of registry.items) {
        fs.writeFileSync(path.join(directory, `${item.name}.json`), JSON.stringify(item, null, 2) + '\n');
    }
    for (const name of ['index.json', 'registry.json']) {
        fs.writeFileSync(path.join(directory, name), JSON.stringify(registry, null, 2) + '\n');
    }
    // Drop manifests for components that no longer exist.
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.json') && !expected.has(entry.name)) {
            fs.unlinkSync(path.join(directory, entry.name));
        }
    }
}
