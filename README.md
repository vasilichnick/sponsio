# Sponsio

World Cup 2026 team-token market — every team is a token, the market prices
belief. Built with Next.js (App Router) + Tailwind 4, deployed on Vercel.

- **Prod:** https://sponsio-five.vercel.app (target domain: sponsio.world)
- **Pages:** `/` schedule · `/leaderboard` · `/manifesto` · `/privacy` · `/terms`
- **Data:** `src/data/fixtures.json` (72 official group matches, UTC kickoffs),
  `src/data/tokens.json` (48 teams; zero-address = trading inactive, real
  addresses activate per team as BasedBid launches happen)

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # static build
```

Deploys via `vercel deploy --prod` (GitHub auto-deploy not wired).
