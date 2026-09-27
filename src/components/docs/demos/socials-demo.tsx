import Image from "next/image";
import { Socials, type SocialItem } from "@/components/ui/socials";

/* The eight marks from the Figma frame, in their designed order: three
   contact channels, the rule, then five places work lives. */
function mark(src: string, alt: string) {
  return <Image src={src} alt={alt} width={92} height={92} unoptimized />;
}

const CONTACT: SocialItem[] = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: mark("/socials/linkedin.png", "") },
  { label: "Telegram", href: "https://telegram.org", icon: mark("/socials/telegram.png", "") },
  { label: "Email", href: "mailto:hello@example.com", icon: mark("/socials/mail.png", "") },
];

const WORK: SocialItem[] = [
  { label: "DDB", href: "https://example.com/ddb", icon: mark("/socials/ddb.png", "") },
  { label: "Freelance", href: "https://example.com/freelance", icon: mark("/socials/freelance.png", "") },
  { label: "AI dev", href: "https://example.com/ai", icon: mark("/socials/ai-dev.png", "") },
  { label: "Fiverr", href: "https://fiverr.com", icon: mark("/socials/fiverr.png", "") },
  { label: "X", href: "https://x.com", icon: mark("/socials/x.png", "") },
];

export function SocialsDemo() {
  return <Socials groups={[CONTACT, WORK]} label="Find me on" />;
}

/* Glass only earns its keep over something worth refracting, so the demo
   gives it a surface to sit on rather than a flat panel. */
export function SocialsGlassDemo() {
  const withBadge = CONTACT.map((item) =>
    item.label === "Telegram" ? { ...item, badge: "2 unread" } : item,
  );

  return (
    <div className="relative isolate w-full overflow-hidden rounded-md">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_20%_0%,var(--color-shu-400)_0%,transparent_55%),radial-gradient(100%_100%_at_90%_100%,var(--color-sumi-400)_0%,transparent_60%)] opacity-70"
      />
      <div className="flex min-h-[220px] items-center px-4">
        <Socials variant="glass" groups={[withBadge, WORK]} label="Find me on" />
      </div>
    </div>
  );
}
