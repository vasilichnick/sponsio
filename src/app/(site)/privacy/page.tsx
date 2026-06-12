import type { Metadata } from "next";
import Link from "next/link";

// Linkify the one cross-reference in emerald, matching the /rewards accent.
function renderPara(text: string) {
  const phrase = "Terms";
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <Link
        href="/terms"
        className="text-emerald-300 underline-offset-2 hover:underline"
      >
        {phrase}
      </Link>
      {text.slice(i + phrase.length)}
    </>
  );
}

export const metadata: Metadata = {
  title: "Privacy Policy — Sponsio",
  description: "How Sponsio handles data: minimal collection, public blockchain data, no tracking.",
};

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "1. Who we are",
    p: [
      "Sponsio (sponsio.world) is an information website for the Sponsio team-coin market built around the 2026 World Cup. The site displays match schedules, coin information, and market data. It does not custody funds, hold private keys, or operate user accounts.",
    ],
  },
  {
    h: "2. What we collect",
    p: [
      "We do not require registration and do not collect names, email addresses, or personal profiles.",
      "Our hosting infrastructure records standard technical logs (IP address, browser type, requested pages, timestamps) for security and operations, as virtually all websites do.",
      "We do not use advertising trackers or sell any data.",
    ],
  },
  {
    h: "3. Blockchain data",
    p: [
      "Wallet addresses, coin balances, and transactions on the Base network are public, permanent, and outside our control. We read this public data to display market information and to compute reward distributions (including periodic snapshots of coin balances) as described in our Terms.",
      "Interacting with blockchain networks is inherently public: anyone, including us, can observe on-chain activity. Nothing we do can make on-chain data private, and nothing we do makes it more public than it already is.",
    ],
  },
  {
    h: "4. Third-party services",
    p: [
      "The site links to and relies on third-party services, including our hosting provider (Vercel), the coin launch platform (BasedBid), trading platforms and decentralized exchanges (GmGn, Uniswap), and block explorers (Basescan). Each operates under its own privacy policy; we encourage you to review them. We are not responsible for their practices.",
    ],
  },
  {
    h: "5. Cookies & analytics",
    p: [
      "We do not set marketing or cross-site tracking cookies. Our hosting platform may set strictly technical cookies required to serve the site. We currently run no third-party analytics; if that changes, this page will be updated first.",
    ],
  },
  {
    h: "6. How information is used",
    p: [
      "Operating and securing the website; understanding aggregate, anonymous usage; computing and publishing reward distributions from public blockchain data; complying with legal obligations.",
    ],
  },
  {
    h: "7. Sharing",
    p: [
      "We do not sell or rent any information. Technical data may be processed by our infrastructure providers solely to operate the site, or disclosed where the law requires it.",
    ],
  },
  {
    h: "8. Retention & security",
    p: [
      "Technical logs are retained only as long as operationally necessary. Public blockchain data is permanent by nature and is not stored by us beyond what is needed to compute and publish distributions.",
    ],
  },
  {
    h: "9. Eligibility",
    p: [
      "The site is not directed at persons under 18, and we do not knowingly collect information from them.",
    ],
  },
  {
    h: "10. Changes",
    p: [
      "We may update this policy as the product evolves. The current version is always at this address; material changes will be reflected by the effective date below.",
    ],
  },
  {
    h: "11. Contact",
    p: [
      "Questions about this policy can be raised through our official channels linked in the site footer.",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          Effective date: June 6, 2026
        </p>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-zinc-950/75 px-6 py-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md">
          {SECTIONS.map((s) => (
            <section key={s.h} className="border-b border-white/5 py-3 last:border-0">
              <h2 className="font-cond text-base font-semibold text-white uppercase">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {renderPara(para)}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
