// Sponsio Docs content + navigation tree. Part I — The Belief Economy is live;
// Part II — The Sponsio Score is marked coming-soon until it's edited. Each page
// body is lightweight markdown (paragraphs, `- ` lists, `> ` quote, **bold**)
// rendered by docs/markdown.tsx.

export type DocPage = { slug: string; title: string; body: string };
export type DocSectionNav = {
  part: string;
  title: string;
  comingSoon?: boolean;
  pages: { slug: string; title: string }[];
};

const BELIEF_ECONOMY: DocPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    body: `Brazil and Japan play tonight.

Two Belief Coins exist: Brazil Wins and Japan Wins.

Thousands of people disagree about the outcome. Instead of arguing on social media, they express their conviction by trading.

As the match approaches, new information appears. Lineups are announced. Players get injured. Public opinion shifts. The markets move, and people keep buying and selling according to their conviction.

Eventually the match ends. Reality determines the outcome, and the marketplace records the result. Everyone who backed the winning belief automatically builds their weekly Sponsio Score.

Nobody stakes. Nobody locks assets. Nobody claims rewards. The marketplace simply continues.

Tomorrow another belief appears. Another market opens. Another opportunity begins.

This is Sponsio — a marketplace where beliefs become tradable.

Every Belief Coin represents one objectively verifiable future outcome. That outcome may resolve in five minutes or in five months; the protocol makes no distinction. Every Belief Coin follows the same lifecycle: launch, trade, resolution. The duration changes. The protocol does not.

The protocol itself stays neutral. It never predicts the future and never decides which beliefs are correct. It simply provides an open marketplace where anyone can create, discover and trade Belief Coins. Reality determines the outcome.

Every participant interacts with Sponsio the same way. They discover markets and trade the beliefs they agree with. Some also create new markets. Others invite new participants. Everything else happens automatically.

When beliefs become reality, the protocol converts successful participation into Sponsio Score. At the end of every week, protocol fees are distributed according to the weekly leaderboard. The competition resets, and a new week begins.

Sponsio runs on one simple cycle:

> Create beliefs. Trade beliefs. Reality resolves beliefs. Build your Sponsio Score. Earn weekly rewards. Repeat.

The chapters that follow explain how each part of that cycle works.`,
  },
  {
    slug: "why-belief-markets",
    title: "Why Belief Markets",
    body: `People form beliefs about the future every day — about sports, politics, technology, AI, crypto, business, entertainment. Some are popular, others controversial. Some become reality; most never do.

Until now, those beliefs have mostly existed as conversations. People debate them, post about them, vote in polls, listen to experts. Very few become open markets where anyone can express conviction.

Sponsio changes that.

A Belief Market lets you express conviction instead of just discussing it. Every Belief Coin represents one future outcome. If you believe it will happen, you trade it. If your conviction changes, you leave at any time. The protocol never tells you what to believe.

Unlike opinions, markets evolve continuously. New information changes conviction. Conviction changes trading. Trading changes prices. Reality eventually decides which belief was true.

Belief Markets differ from traditional prediction markets. A prediction market is usually built around a single question: one question, one market, one resolution, then on to the next. Sponsio instead treats every objectively verifiable outcome as another Belief Coin in the same marketplace. Some markets last minutes, others months — the protocol treats them identically.

They also differ from memecoins. A memecoin asks people to believe in the token itself. A Belief Coin asks people to believe in an event outside the protocol. The narrative already exists; the protocol simply gives it a market, with reality as the only source of truth.

Because every Belief Coin shares the same lifecycle, you only learn the marketplace once. A football match, an election, a title fight, a technology release, an AI benchmark — the experience is identical: discover, trade, wait for reality, move to the next opportunity.

The result is something larger than individual events: a continuously expanding marketplace where communities express conviction, creators introduce new ideas, and reality decides who was right.`,
  },
  {
    slug: "beliefs-and-belief-coins",
    title: "Beliefs & Belief Coins",
    body: `Everything in Sponsio begins with a Belief — an objectively verifiable future outcome. If reality can eventually confirm whether it happened, it can become a Belief.

Every Belief is represented by exactly one Belief Coin: a meme coin standing for that single Belief. Nothing more.

Examples:

- Brazil Wins Tonight
- Japan Wins Tonight
- Brazil Becomes World Champion
- Usyk Wins His Next Fight
- Ethereum ETF Approved
- GPT-6 Launches Before 2027

The protocol treats every Belief Coin identically. Only the underlying belief changes. There are no classes of Belief Coins. Some resolve in minutes, others stay active for months — the lifetime of a coin is simply the lifetime of its belief. When the belief resolves, the market reaches the end of its lifecycle.

Every Belief Coin follows the same three-stage lifecycle:

**Launch.** A creator introduces a new Belief, and the Belief Coin becomes available to the marketplace.

**Trade.** Participants buy and sell according to their conviction. Prices evolve as beliefs change.

**Resolution.** Reality determines the outcome. The market closes, and the protocol automatically updates the weekly competition.

Trading is fully permissionless. You may buy, sell, increase or reduce your position, or exit completely. The protocol never requires staking, locking, claiming, or registering. Trading is the only action you ever need to take.

Belief Coins are intentionally simple. Every market asks one question: do you believe this outcome will happen? If yes, you trade it. If no, you trade the opposite belief or ignore the market. The protocol handles the rest.

Every Belief Coin also creates two independent opportunities at once. The first is market performance — if the price moves your way, you can realize trading profits. The second is the weekly competition — if the belief you backed becomes reality, the protocol converts that into Sponsio Score. You never choose between them; every trade participates in both.

Belief Coins are the fundamental building block of Sponsio. Everything else — creation, discovery, trading, scoring, rewards — exists to support one idea: let anyone express conviction by trading beliefs before reality decides.`,
  },
  {
    slug: "creating-markets",
    title: "Creating Markets",
    body: `Every Belief Market begins with a creator. Without creators, there are no new beliefs to trade. The marketplace grows because participants keep introducing new ideas for others to discover.

Anyone can create a market. It requires no permission, no application, no community, no fundraising. A creator contributes one thing: a Belief that will eventually become verifiable. If reality can confirm whether it came true, it can become a Belief Coin.

Creators come from two sources — the Sponsio Agent and the community. Once a market launches, the protocol treats both identically. Participants decide which markets deserve attention.

**The Sponsio Agent** continuously launches markets around globally significant events, keeping the marketplace stocked with high-quality markets followed by millions. The Agent is not an administrator and does not control the marketplace — it is simply one creator inside the ecosystem. Unlike community creators, it never takes part in the weekly reward distribution. Its purpose is to grow the marketplace, not compete within it.

**Community creators** expand the marketplace beyond official markets. Some cover major global events, others niche communities — sports, crypto, politics, AI, technology. The protocol makes no distinction; every creator competes under the same rules.

Launching a market alone earns nothing. The protocol rewards contribution, not activity. Creators strengthen their weekly Sponsio Score only when their markets generate meaningful participation. Successful creators attract traders, traders generate activity, and active markets strengthen the ecosystem for everyone.

This makes the marketplace self-improving. Creators compete to find better ideas. Participants compete to find better beliefs. Markets compete for attention. Reality decides the outcome.

Without creators there are no Belief Coins. Without Belief Coins there is no marketplace. Without the marketplace there is no Sponsio.`,
  },
  {
    slug: "the-marketplace",
    title: "The Marketplace",
    body: `The marketplace is where Belief Coins are created, discovered and traded — the meeting point between creators introducing beliefs and participants expressing conviction. The protocol does not decide which markets succeed. The marketplace does.

Every new Belief Coin enters the same marketplace. There are no separate venues for official versus community markets, for sports versus politics, or for short-lived versus long-lived beliefs. Every coin competes for the same attention, and participants decide where capital flows.

Discovery happens naturally. Some markets attract immediate interest as globally significant events. Others grow through communities. Some stay niche; others become among the most actively traded on the platform. The protocol never promotes or suppresses an outcome — participation determines visibility.

Trading updates every market continuously. Participants buy the beliefs they agree with, sell those they no longer support, and add to positions as new information arrives. Every trade contributes to price discovery until reality resolves the outcome.

Each resolved market creates the next opportunity. A resolved belief doesn't end participation; it shifts attention to new markets. New creators launch new beliefs, reality keeps producing new events, and the marketplace keeps adapting.

The experience stays identical across every category — a football match, an election, a technology release, an AI benchmark: discover a belief, trade the coin, wait for reality, move to the next opportunity.

So the marketplace is not a collection of isolated markets. It is one continuously evolving marketplace where thousands of independent beliefs compete for attention at once. Every new coin expands it. Every participant helps decide which beliefs matter most. Every resolved event makes room for the next.`,
  },
  {
    slug: "why-sponsio-is-different",
    title: "Why Sponsio Is Different",
    body: `Sponsio combines ideas that already exist in crypto while offering a different experience. It is not a prediction market, a memecoin launchpad, or a betting app. It borrows useful properties from each while remaining its own thing.

**Versus prediction markets.** Traditional prediction markets are built around individual questions: create a market, trade, resolve, end, move to the next independent question. Sponsio instead turns every verifiable outcome into another Belief Coin in one shared marketplace. Participants aren't limited to one category — every new belief is just another opportunity to trade.

**Versus memecoin launchpads.** Launchpads let anyone create tokens and let the community decide which matter. Sponsio keeps that open philosophy, but every Belief Coin represents a verifiable outcome rather than an arbitrary token. Every market eventually reaches objective resolution, so reality becomes part of the marketplace itself.

**Versus betting.** A bet ends when the event ends. On Sponsio you trade freely before resolution, entering or exiting whenever you like while the market exists. At the same time, successful participation automatically feeds the weekly competition — trading and competition coexist without separate actions.

**The weekly competition.** Most marketplaces end once a trade completes. Sponsio adds a layer: every resolved market contributes to the weekly Sponsio Score. Participants compete all week simply by doing what they came to do — trading the beliefs they agree with. The competition isn't a separate product; it's a by-product of participation.

**Open creation.** Most prediction and betting platforms decide which markets exist. Sponsio lets the marketplace grow itself: the Sponsio Agent launches official markets while community creators add their own, so it evolves faster than any centrally managed platform.

**One marketplace.** Everything follows the same model. Every market begins with a Belief. Every Belief becomes a Belief Coin. Every coin enters the same marketplace. Reality resolves every belief. Successful participation feeds the weekly competition. Whatever the category, participants always experience the same protocol.

The principle underneath it all: if people disagree about the future, they should be able to build a market around that belief — and as long as reality can eventually settle it, the marketplace can keep discovering its value until that moment arrives.`,
  },
  {
    slug: "faq",
    title: "FAQ",
    body: `**What is a Belief?**

An objectively verifiable future outcome. If reality can eventually confirm whether it happened, it can become a Belief.

**What is a Belief Coin?**

A meme coin representing exactly one Belief.

**Who can create Belief Coins?**

Anyone. The marketplace is permissionless. Markets may be launched by the Sponsio Agent or by independent community creators.

**Who decides which markets matter?**

Nobody. Creators introduce markets; participants decide where attention and capital flow.

**Can a Belief Coin represent anything?**

Only objectively verifiable future outcomes. If reality can eventually confirm it true or false, it qualifies.

**How long does a Belief Coin exist?**

As long as its belief remains unresolved — minutes for some, months for others. The protocol treats them identically.

**Can I trade at any time?**

Yes, freely, while the market is active. The protocol never requires staking or lockups.

**Do I claim rewards manually?**

No. If your participation builds your weekly Sponsio Score, rewards are calculated and distributed automatically.

**Does every successful trade increase my Sponsio Score?**

Not necessarily. Your Sponsio Score grows when the belief you backed resolves successfully; the exact scoring rules are in Part II.

**Is Sponsio limited to sports?**

No. Sports are one category. Any objectively verifiable outcome qualifies.

**Who decides whether a belief became reality?**

Reality. Every market defines objective resolution criteria before trading begins, and the protocol records the outcome against them once the event concludes.

**Why does the competition reset weekly?**

So everyone starts equal. Nobody carries an advantage from previous weeks. Every Monday begins a new competition.`,
  },
];

const SPONSIO_SCORE: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    body: `The Sponsio Score is a weekly competition built directly into the marketplace. It is not a separate product or activity. Participants don't come to earn Score; they come to trade the beliefs they agree with. The protocol quietly turns that participation into a competition.

Participants never stake, lock, activate, claim, or calculate anything. They simply participate in Belief Markets — the protocol handles everything else.

Every resolved market contributes. If you backed a belief that became reality, the protocol converts that into Sponsio Score with no interaction on your part.

The Score rewards participation, not speculation alone. People contribute in different ways — discovering successful beliefs, creating successful markets, introducing valuable new participants. Each strengthens a different component of the same weekly Score. Everyone competes on one leaderboard and shares one Weekly Reward Pool.

The competition is intentionally temporary. Every Monday starts fresh; every Sunday ends. Nothing carries over, and no one keeps a permanent advantage.

So the experience stays simple: discover markets, trade the beliefs you agree with, create markets if you wish, invite others, watch your Score evolve automatically, receive your share of the pool, and begin again next week.

The Score answers one question: who contributed most successfully to the marketplace this week?`,
  },
  {
    slug: "belief-score",
    title: "Belief Score",
    body: `Belief Score is the foundation of the weekly competition. It measures successful participation in resolved markets during the current week. Each time a market resolves, the protocol automatically evaluates every eligible participant — no registration, no claims.

Every resolved market creates one scoring event with two possible outcomes.

If you backed a belief that did not become reality:

> Event Score = 0

If you backed a belief that became reality:

> Event Score = Holdings × Outcome Multiplier

Where:

- **Holdings** — the dollar value of your position in that Belief Coin at the protocol's snapshot for the market.
- **Outcome Multiplier** — derived from the implied probability of the successful belief immediately before the event begins. Less likely beliefs receive larger multipliers; more likely beliefs receive smaller ones. The exact calculation is determined by the protocol.

The snapshot is what keeps this fair. Trading stays open through the entire event — before it begins and while it unfolds — so participants keep buying and selling on every new development. Once the event reaches its definitive outcome — including extra time or penalties, a knockout, a called result — the protocol takes a single automatic snapshot at a random moment within the following hour. Because that moment is unpredictable, no one can time an entry or exit around it; you simply hold the belief you trust.

Every successful Event Score adds to your Belief Score:

> Belief Score = Σ Event Scores

Every resolved market contributes independently, with no limit to how many successful beliefs you can accumulate in a week.

The model is universal. The protocol applies it identically to every Belief Coin — a football match, a championship, a boxing fight, an election, a technology release, an AI benchmark. Only the belief changes.

Participants never optimize around formulas. They trade the beliefs they agree with; if those become reality, Belief Score rises automatically. The protocol handles the rest.`,
  },
  {
    slug: "weekly-competition",
    title: "The Weekly Competition",
    body: `Every Monday begins a new competition, and every participant starts with the same opportunity.

Throughout the week, participants build their Sponsio Score — most of all by backing beliefs that become reality, and some also strengthen it in two additional ways. The protocol recognizes three independent forms of contribution.

**Belief Score** measures successful participation in resolved markets. It is the largest component of the Sponsio Score — the heaviest weight. The other two add to it but count for less.

**Creator Score.** Creators strengthen their Sponsio Score when the markets they launch attract real trading. Launching alone isn't rewarded — the marketplace decides a creator's impact. Your Creator Score is the Belief Score generated by everyone trading in the markets you created, rewarding quality over quantity. In weight it sits between Belief and Referral.

**Referral Score.** Participants can introduce new users through the referral system. Only active referrals count — the protocol rewards meaningful participation, not simple registrations. Your Referral Score is the combined Belief Score generated by your active referrals during the week, capped to keep the competition balanced. It is the lightest of the three contributions.

At the end of the week, every participant has one Sponsio Score, combining the three by weight:

> Sponsio Score = α · Belief Score + β · Creator Score + γ · Referral Score

The weights are set by the protocol, with α greater than β greater than γ: Belief Score counts the most, Creator next, Referral least. Backing winning beliefs is the main path; creating and referring add to it.

Everyone competes with the same formula. There are no separate leaderboards for traders, creators, or referrers — all contributions strengthen the same competition.

The leaderboard updates continuously as markets resolve, so participants watch their position change as new beliefs become reality. It reflects current participation, not historical activity.`,
  },
  {
    slug: "weekly-rewards",
    title: "Weekly Rewards",
    body: `Every trade in the marketplace generates protocol fees. Throughout the week, all fees accumulate into one shared Weekly Reward Pool. There are no separate pools for different roles — one marketplace, one competition, one pool.

At the end of each week, the entire pool is distributed among eligible participants according to their Sponsio Score. Rewards are proportional. The protocol doesn't select winners; it simply distributes the pool by each participant's contribution.

> Reward = (Sponsio Score / Total Sponsio Score) × Weekly Reward Pool

This aligns everyone around the same objective. Traders raise Belief Score by backing beliefs that become reality. Creators strengthen their Score by building markets people trade. Referrers strengthen theirs by introducing active participants. Every role feeds the same competition.

Distribution is automatic. Participants never submit claims or request payouts. Once the week concludes, the protocol distributes the pool.

Then the next competition begins. The leaderboard, Belief Score, Creator Score, and Referral Score all reset, and a new Weekly Reward Pool starts accumulating. Existing markets stay live until they resolve, new ones keep launching, and everyone starts equal again.`,
  },
  {
    slug: "a-complete-example",
    title: "A Complete Example",
    body: `**Monday.** Brazil and Japan play tonight. Two official Belief Coins are live — Brazil Wins and Japan Wins — launched by the Sponsio Agent. Community creators add more around the match: Carol launches Decided on Penalties; others add Brazil Scores First and Over 3 Goals. Every market runs on the same protocol; participants just pick the beliefs they agree with.

**Trading runs the whole match.** Alice buys Brazil Wins. Bob buys Japan Wins. Carol launched her market but doesn't trade it herself. Dave joined through Alice's referral link and trades actively. Thousands of others trade alongside them. Every goal and card reprices the markets, and people keep buying and selling in-play, right to the final whistle. Nobody stakes or locks anything.

**Reality resolves it.** Level after ninety minutes, the match goes to extra time, then penalties — Japan win. Once the result is official, the protocol takes one random snapshot within the next hour and reads each participant's position in the winning belief.

- **Bob** held Japan Wins. His Event Score is the dollar value of his position × the pre-match Outcome Multiplier — Japan were underdogs, so the multiplier is large. It adds to his Belief Score.
- **Alice** held Brazil Wins. Her Event Score is zero.

Every market is scored the same way, automatically, with no claims.

**Across the same week.** The match did go to penalties, so Carol's market came true — the Belief Score traded inside it becomes her Creator Score. Dave, Alice's referral, traded actively, so the Belief Score he generated becomes Alice's Referral Score. So although Alice's own belief lost, the friends she brought still earn her a share — smaller than a trader's, but real.

**End of the week.** Each participant has one Sponsio Score, combining the three contributions by weight:

> Sponsio Score = α · Belief Score + β · Creator Score + γ · Referral Score

The week's protocol fees have collected into one Weekly Reward Pool, split proportionally:

> Reward = (Sponsio Score / Total Sponsio Score) × Weekly Reward Pool

**A new week begins.** Leaderboard, Belief, Creator and Referral progress all reset, and a new pool starts filling. Open markets stay live until they resolve, new ones keep launching, and everyone starts equal.`,
  },
];

export const DOCS_PAGES: DocPage[] = [...BELIEF_ECONOMY, ...SPONSIO_SCORE];

export const DOCS_SECTIONS: DocSectionNav[] = [
  {
    part: "Part I",
    title: "The Belief Economy",
    pages: BELIEF_ECONOMY.map((p) => ({ slug: p.slug, title: p.title })),
  },
  {
    part: "Part II",
    title: "The Sponsio Score",
    pages: SPONSIO_SCORE.map((p) => ({ slug: p.slug, title: p.title })),
  },
];

export const pageBySlug = (slug: string): DocPage | undefined =>
  DOCS_PAGES.find((p) => p.slug === slug);

/** The section a page belongs to (drives the eyebrow above each doc title). */
export const sectionOf = (slug: string): DocSectionNav | undefined =>
  DOCS_SECTIONS.find((s) => s.pages.some((p) => p.slug === slug));
