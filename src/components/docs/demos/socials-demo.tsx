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
  return (
    <div className="w-full">
      <Socials groups={[CONTACT, WORK]} label="Find me on" />
    </div>
  );
}
