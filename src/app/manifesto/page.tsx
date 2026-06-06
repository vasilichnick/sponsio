import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifesto — Sponsio",
  description:
    "The first market built for belief. Prediction markets measure outcomes; Sponsio measures belief.",
};

type Block =
  | { t: "p"; text: string }
  | { t: "lead"; text: string }
  | { t: "pull"; text: string }
  | { t: "versus"; pairs: string[] };

const CONTENT: Block[] = [
  { t: "lead", text: "The world already has markets for outcomes." },
  {
    t: "p",
    text: "Every prediction market, sportsbook, and forecasting platform is built around the same idea: create a market around an event, let people speculate on the result, settle the winners and losers, then move on to the next event.",
  },
  {
    t: "p",
    text: "The market exists only because uncertainty exists. Once certainty arrives, the market dies.",
  },
  { t: "p", text: "We think something far more important has been missing." },
  {
    t: "lead",
    text: "People do not organize themselves around outcomes. People organize themselves around beliefs.",
  },
  {
    t: "p",
    text: "Long before a World Cup final is played, millions of people already believe in Argentina. Millions believe in Brazil. Millions believe in France. Those beliefs shape conversations, communities, identities, and behavior long before any result becomes known.",
  },
  {
    t: "p",
    text: "Yet there has never been a financial system designed around belief itself. That is what Sponsio is building.",
  },
  {
    t: "pull",
    text: "Sponsio does not create temporary prediction contracts. Sponsio creates permanent belief assets.",
  },
  {
    t: "p",
    text: "When you buy Argentina on Sponsio, you are not buying a betting ticket. You are not buying a prediction contract that expires after a match. You are buying exposure to a collective belief shared by millions of people around the world.",
  },
  {
    t: "p",
    text: "The World Cup is simply the first place where this idea becomes obvious. Football is already one of the largest belief systems on Earth. Entire nations rally around teams. Communities form around shared conviction. Capital, attention, and emotion naturally flow toward the narratives people believe in most.",
  },
  {
    t: "p",
    text: "We are not creating those narratives. They already exist. We are simply creating a market that allows them to be expressed, traded, and measured.",
  },
  {
    t: "p",
    text: "As belief shifts, markets move. As teams perform, conviction changes. As conviction changes, capital reallocates. The market continuously discovers which narratives people believe in most.",
  },
  { t: "pull", text: "For the first time, belief becomes visible through price." },
  {
    t: "p",
    text: "Most people will first discover Sponsio through football. That is intentional. Football gives us something few other domains can offer: billions of people who already care. The narratives are established. The tribes already exist. The conviction is already there.",
  },
  {
    t: "p",
    text: "But football is not the destination. It is simply the easiest place to prove the idea. Because once you understand what is really happening, you realize Sponsio has very little to do with sport.",
  },
  { t: "lead", text: "What we are building is infrastructure for belief." },
  {
    t: "p",
    text: "The same mechanism that allows someone to buy Argentina during the World Cup can allow someone to buy a country, a brand, an AI agent, a technology, a movement, a creator, a crypto ecosystem, or any other narrative that attracts conviction.",
  },
  { t: "p", text: "Everywhere you look, people are already choosing sides." },
  {
    t: "versus",
    pairs: [
      "OpenAI or Anthropic",
      "Base or Solana",
      "Tesla or BYD",
      "Nike or Adidas",
      "Bitcoin or Ethereum",
    ],
  },
  {
    t: "p",
    text: "Some narratives attract believers. Others lose them. Some communities grow. Others fade away. Today those forces exist everywhere, yet there is no native market for them.",
  },
  {
    t: "p",
    text: "There are markets for stocks. There are markets for commodities. There are markets for currencies. There are markets for events.",
  },
  { t: "pull", text: "There are no markets for belief itself. We think that changes." },
  {
    t: "p",
    text: "The most valuable asset in the twenty-first century is no longer information. Information is abundant. Attention became scarce. Now conviction is becoming scarce.",
  },
  {
    t: "p",
    text: "The ability to identify, measure, and participate in collective belief may become one of the largest markets ever created.",
  },
  {
    t: "p",
    text: "Our belief is simple. The next generation of markets will not be built around events. They will be built around conviction. Not around what happened — around what people believe will matter.",
  },
  { t: "pull", text: "Prediction markets measure outcomes. Sponsio measures belief." },
  {
    t: "p",
    text: "And belief is one of the most powerful forces in the world. That is why Sponsio begins with football. Not because we are building a football product — because football allows us to demonstrate something much larger.",
  },
  {
    t: "p",
    text: "A future where beliefs become assets. Where narratives become markets. Where conviction becomes visible. Where the most powerful force in human coordination finally becomes tradable.",
  },
  {
    t: "lead",
    text: "This is not another prediction market. This is not another sportsbook. This is not another fan token. This is not another memecoin.",
  },
  { t: "pull", text: "This is the first market built for belief. This is Sponsio." },
];

export default function Manifesto() {
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-3xl font-normal uppercase tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] md:text-4xl [-webkit-text-stroke:0.35px_rgba(0,0,0,0.85)]">
          Manifesto
        </h1>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <div className="mx-auto max-w-2xl rounded-xl bg-white/85 px-6 py-6 text-zinc-900 shadow-lg shadow-black/25 ring-1 ring-black/5 backdrop-blur-md md:px-8">
          {CONTENT.map((b, i) => {
            if (b.t === "lead")
              return (
                <p key={i} className="mt-5 text-lg font-semibold leading-snug first:mt-0 md:text-xl">
                  {b.text}
                </p>
              );
            if (b.t === "pull")
              return (
                <p
                  key={i}
                  className="font-cond mt-6 border-y border-zinc-200 py-4 text-center text-xl font-semibold uppercase leading-snug tracking-tight md:text-2xl"
                >
                  {b.text}
                </p>
              );
            if (b.t === "versus")
              return (
                <div key={i} className="font-cond mt-4 space-y-1 text-center text-base font-semibold uppercase text-zinc-700">
                  {b.pairs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              );
            return (
              <p key={i} className="mt-3 text-[15px] leading-relaxed text-zinc-600">
                {b.text}
              </p>
            );
          })}
        </div>
      </main>
    </>
  );
}
