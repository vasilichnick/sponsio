# Sponsio — open items

Logged 2026-06-10 (eve of first launch: MEX & RSA kick off 2026-06-11 19:00 UTC).
Done means shipped to prod or explicitly dropped. Mechanism items need operator
sign-off before any build.

## Gating tests (block other items)

- [ ] **Uniswap routing test** — swap the mainnet canary coin through the exact
      `app.uniswap.org/swap?chain=base&outputCurrency=…` link the site uses.
      If hooked v4 pools don't route there, Trade buttons need a per-coin
      trade URL (based.bid token page) in `tokens.json`.
- [ ] **DexScreener indexing test** — confirm it indexes the canary's hooked
      v4 pool. Gates the whole wave-2 metrics layer (else: Uniswap subgraph /
      on-chain reads).

## Launch ops (BasedBid / openbid — before each kickoff wave)

- [ ] Ops wallet + treasury wallet; fund ops with ETH on Base.
- [ ] `BASEDBID_API_KEY` (bb_live) from partner; create **Sponsio** board
      ($50, privacy: Private).
- [ ] 48 team logo images (1:1) for coin metadata.
- [ ] Sandbox (`isSandboxMode: true`) end-to-end rehearsal, then one mainnet
      canary coin → run both gating tests above.
- [ ] Final fee decision (proposed: Uniswap v4, feeTier 3%; Fee Builder:
      ~2% → treasury custom wallet, 1% → liquidity; reward/dividends OMITTED;
      MEV protection off; buyLimits 600s / 1%).
- [ ] Confirm with BasedBid: flash starting-mcap ceiling (docs say $690–$10k,
      SDK schema allows 10M — which is real?).
- [ ] Launcher automation: config generator (48 JSONs from fixtures.json),
      kickoff-timed cron, CA capture → tokens.json → commit/deploy → X post.
      Manual fallback: based.bid/launch-flash UI.
- [ ] Weekly `evm:claim-fees` sweep ritual; publish treasury address on site.
- [ ] X announcements: POST 1 timing; POST 2 reveal (fixed draft exists) —
      confirm co-branding timing with based.bid.

## Site — wave 2 (needs data layer; build at/after launch)

- [ ] `/api/markets` route: server-cached (30–60s) DexScreener + Basescan
      fetch for all 48 coins; never per-row client calls.
- [ ] Board columns: **Believers** (holder count — vocab: never "holders"),
      **Price + 24h momentum**, **Belief Share** (coin mcap ÷ sum of all 48 —
      share-of-belief framing, NEVER odds/probability), **Pool contribution**
      (treasury inflow per coin); volume/liquidity/sparkline in expandable
      rows. Table re-weights post-launch: Launch column demotes.
- [ ] Live Reward Pool counter on home + /rewards once fees accrue
      ("$X and growing").
- [ ] tokens.json ops flow live: addresses drop in per kickoff (site flips
      automatically; ticker/badges/stat strip already react).
- [ ] Believers ≠ pool-splitters nuance: live holder count is a belief
      signal; pool share is match-day-snapshot math — keep /rewards the only
      place that explains pool share.

## Site — general

- [ ] Security headers in `next.config.ts` (CSP, frame-ancestors,
      X-Content-Type-Options, Referrer-Policy) — only real gap from the
      2026-06-10 audit (no secrets, links guarded, no XSS sinks, fonts
      self-hosted, no runtime third-party calls).
- [ ] Dependency CVE audit needs tooling: bun has no scanner configured and
      npm audit needs a package-lock (`npm i --package-lock-only` or
      configure `[install.security] scanner` in bunfig.toml).
- [ ] Top Scorer market: player coins, list UI, launch — **blocked on
      mechanism decision** (settlement + own pool vs shared pool) →
      /rewards implications. Teaser tab is live meanwhile.
- [ ] Email / notify capture (needs backend; X follow link stands in).
- [ ] Localization (es/pt/fr/ar) — v2.
- [ ] Terms: counsel pass — "Team Coins" defined term vs belief ontology;
      claim deadline + abandonment clauses; excluded-jurisdictions list.
- [ ] OG share card: optional refresh to carry "every coin is one belief"
      line (current card = hero anthem, still on-brand).
- [ ] Manifesto: optionally add the championship-belief instance as the v1
      anchor (deliberately left broad for now).

## Mechanism decisions (operator-only, from spec — still open)

- [ ] Top Scorer settlement + pool structure.
- [ ] Randomness beacon for snapshots (publish before launch).
- [ ] Excluded-address list; pool denomination + conversion policy.
- [ ] Claim deadline / abandonment clauses (→ Terms).
