import { NextResponse } from "next/server";

/** Farcaster Mini App manifest, served at /.well-known/farcaster.json
 *  (spec: miniapps.farcaster.xyz/docs/guides/publishing).
 *
 *  accountAssociation: JSON Farcaster Signature over
 *  { domain: "sponsio.world" } signed 2026-06-10 by the operator's account
 *  (fid 1060519, custody key in the header). Re-sign at
 *  farcaster.xyz/~/developers/mini-apps/manifest if ownership ever moves
 *  to a brand account, and paste the new triple here.
 *
 *  Domain note: this manifest is bound to the apex `sponsio.world`. `www.`
 *  is a different app to Farcaster — keep every URL on the apex. */

const DOMAIN = "https://sponsio.world";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    accountAssociation: {
      header:
        "eyJmaWQiOjEwNjA1MTksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyMTFFMTdGNDBFZkIyN0Y4MmNlNjMyN2NBMEI2NDVjMTdEODlhNEJCIn0",
      payload: "eyJkb21haW4iOiJzcG9uc2lvLndvcmxkIn0",
      signature:
        "KlKwuIu70FnL0JlH4yCqaECixASdpmLr3Pu4mTr5+1Z/Ff1wkPVoEo/c2cMBYD7HJbsjVX0fIDBUpVAesXCuABs=",
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
