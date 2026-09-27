import { buildRegistry, writeRegistry } from './registry';

try {
    const registry = buildRegistry(process.cwd());
    writeRegistry(process.cwd(), registry);
    console.log(`Generated ${registry.items.length} registry items and the catalog.`);
} catch (error) {
    console.error('Registry generation failed:', error);
    process.exitCode = 1;
}
