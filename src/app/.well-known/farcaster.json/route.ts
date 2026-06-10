import { NextResponse } from "next/server";

/** Farcaster Mini App manifest, served at /.well-known/farcaster.json
 *  (spec: miniapps.farcaster.xyz/docs/guides/publishing).
 *
 *  accountAssociation is intentionally EMPTY: it's a JSON Farcaster
 *  Signature over { domain: "sponsio.world" } from the project's Farcaster
 *  custody address, which only the operator can produce. Generate it at
 *  farcaster.xyz/~/developers/mini-apps/manifest (or sign with the custody
 *  wallet), then paste header/payload/signature below. Until then the app
 *  previews and runs but can't be verified/published to app stores.
 *
 *  Domain note: this manifest is bound to the apex `sponsio.world`. `www.`
 *  is a different app to Farcaster — keep every URL on the apex. */

const DOMAIN = "https://sponsio.world";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    miniapp: {
      version: "1",
      name: "Sponsio",
      iconUrl: `${DOMAIN}/icon-1024.png`,
      homeUrl: `${DOMAIN}/mini`,
      imageUrl: `${DOMAIN}/embed-image.jpg`,
      buttonTitle: "⚽ Trade belief",
      splashImageUrl: `${DOMAIN}/splash-200.png`,
      splashBackgroundColor: "#050505",
      subtitle: "Trade what you believe in",
      description:
        "48 World Cup 2026 coins on Base. Every coin is one belief: this team becomes champion. Fees fill one pool — the champion's believers split it.",
      primaryCategory: "finance",
      tags: ["worldcup", "base", "belief", "memecoin", "football"],
      tagline: "Belief, as an asset class",
      heroImageUrl: `${DOMAIN}/embed-image.jpg`,
      ogTitle: "Sponsio — Trade belief",
      ogDescription:
        "Every coin is one belief: this team becomes champion. Fees fill one pool — believers split it.",
      ogImageUrl: `${DOMAIN}/embed-image.jpg`,
      requiredChains: ["eip155:8453"],
    },
  });
}
