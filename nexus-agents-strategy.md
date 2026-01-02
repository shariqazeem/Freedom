# Nexus Agents: First Product Strategy

> A productized service agency for Web3 Community Managers
> Target: $500/month active income

---

## 1. The Three Products (Ranked by Build Speed × Value)

### Product A: "WhaleWatch Bot" — Telegram/Discord

**Pain Point:** CMs get blindsided by large sells → panic in chat → hours of damage control

**What it does:**
- Monitors top 20 holders of a specific token
- Sends instant alerts: "🐋 Whale moved 500K $TOKEN to Raydium (potential sell)"
- Tracks wallet labels (team, VC, known traders)

**Why it sells:** CMs can get ahead of FUD before it starts. "I knew about the whale move 30 seconds before chat did."

**Pricing:** $150 setup + $30/mo per token tracked

---

### Product B: "HolderGate Bot" — Telegram

**Pain Point:** Anyone can join "holder-only" groups. Fake holders cause chaos.

**What it does:**
- User connects wallet via simple web page
- Bot verifies they hold X amount of token
- Auto-grants/revokes Telegram group access
- Daily re-verification sweep

**Why it sells:** Token-gated access is table stakes for serious projects. Most CMs duct-tape this manually.

**Pricing:** $200 setup + $25/mo

---

### Product C: "SentinelBot" — FUD/Raid Detection

**Pain Point:** Coordinated FUD attacks happen at 3 AM when CM is asleep

**What it does:**
- Monitors chat velocity + keyword spikes ("rug", "scam", "sell", "dead")
- Detects unusual new-account floods (raid pattern)
- Pings CM with alert + auto-mutes repeat offenders

**Why it sells:** Sleep. Community managers can finally sleep.

**Pricing:** $100 setup + $20/mo

---

## 2. The Tech Stack (Free/Cheap Tier)

| Layer | Tool | Why | Cost |
|-------|------|-----|------|
| **Hosting** | Railway.app | Always-on, easy deploy, $5 free credit | Free → $5/mo |
| **Database** | Supabase | Auth + Postgres + Realtime, generous free tier | Free |
| **Solana RPC** | Helius | Webhooks for whale tracking, 1M credits free | Free |
| **Base RPC** | Alchemy | Good free tier for EVM | Free |
| **Bot Framework** | grammY (TS) | Modern, clean DX for Telegram | Free |
| **Discord** | discord.js | Standard, well-documented | Free |
| **AI (optional)** | Claude API | Sentiment analysis for SentinelBot | ~$5/mo |
| **Wallet Connect** | Phantom adapter | For HolderGate verification | Free |

**Total monthly cost to run 5 clients:** ~$10-15

---

## 3. The "Vibe Coding" Workflow

### Phase 1: Scaffold with Cursor (30 min)

Open Cursor in your project folder and use this prompt:

```
Build a Telegram bot using grammY (TypeScript) with these requirements:

1. Bot listens for /start and /verify commands
2. Uses Helius API to fetch token holders for a Solana SPL token
3. Stores user wallet associations in Supabase
4. Sends formatted alerts to a configured channel when whale
   wallets (top 20 holders) make transfers > $5000

Structure:
- src/bot.ts (main bot logic)
- src/helius.ts (API wrapper)
- src/db.ts (Supabase client)
- src/types.ts (TypeScript interfaces)

Use environment variables for: BOT_TOKEN, HELIUS_API_KEY,
SUPABASE_URL, SUPABASE_KEY, ALERT_CHANNEL_ID

Include error handling and logging. No comments needed.
```

### Phase 2: Iterate with Claude (2-3 hours)

Use Claude for:
1. **Debugging Helius webhook setup** — paste error, get fix
2. **Supabase schema design** — "Design tables for tracking wallets + alerts"
3. **Message formatting** — "Make this alert message look professional for Telegram"
4. **Edge cases** — "What happens if wallet transfers to self?"

### Phase 3: Deploy on Railway (15 min)

```bash
# In terminal
railway login
railway init
railway up
```

Add env vars in Railway dashboard. Done.

### Phase 4: Client Onboarding Script

Create a simple `/setup` admin command:

```
/setup <token_address> <alert_channel_id>
```

Bot auto-fetches top 20 holders, starts monitoring. Client sees value in 60 seconds.

---

## 4. Revenue Path to $500/mo

| Clients | Product | Setup | Monthly | Total |
|---------|---------|-------|---------|-------|
| 3 | WhaleWatch | $450 | $90 | $540 first month |
| 2 | HolderGate | $400 | $50 | $450 first month |

### Weekly Execution Plan

- **Week 1:** Build WhaleWatch, deploy for 1 free beta client (get testimonial)
- **Week 2:** Post in 3 Solana Discord servers: "Free whale alerts for first 2 projects"
- **Week 3:** Convert beta users to paid, cold DM 10 meme coin projects on Twitter
- **Week 4:** First $500 invoice

---

## 5. Where to Find Clients

1. **Solana meme coin Discords** — Look for projects with 500-2000 holders (big enough to pay, small enough to need help)
2. **Twitter/X** — Search "community manager" + "solana" + "hiring"
3. **Superteam Pakistan** — Solana ecosystem, they know who's launching
4. **pump.fun graduated tokens** — Projects that just bonded have money and need infra

---

## 6. Full Cursor Prompt: WhaleWatch Bot

Use this in Cursor to scaffold the complete bot:

```
You are building a production-ready Telegram bot called "WhaleWatch" for tracking
large wallet movements on Solana. Use TypeScript with grammY framework.

## Project Structure

src/
├── index.ts          # Entry point, bot initialization
├── bot/
│   ├── commands.ts   # Command handlers (/start, /setup, /status)
│   └── alerts.ts     # Alert formatting and sending
├── services/
│   ├── helius.ts     # Helius API client + webhook handler
│   ├── supabase.ts   # Database operations
│   └── whale.ts      # Whale detection logic
├── types/
│   └── index.ts      # All TypeScript interfaces
└── utils/
    └── format.ts     # Number/address formatting helpers

## Requirements

1. **Commands:**
   - /start - Welcome message with bot info
   - /setup <token_address> - Admin only, configure token to track
   - /status - Show current tracking status
   - /whales - List top 10 holders with labels

2. **Helius Integration:**
   - Use enhanced transactions API for transfer detection
   - Set up webhook for real-time monitoring
   - Track transactions > configurable threshold (default $5000)

3. **Database Schema (Supabase):**
   - `projects` table: id, token_address, chat_id, threshold_usd, created_at
   - `wallets` table: id, project_id, address, label, is_whale, balance
   - `alerts` table: id, project_id, tx_signature, amount, direction, sent_at

4. **Alert Format:**
   🐋 WHALE ALERT

   Wallet: [label or short address]
   Action: [Bought/Sold/Transferred]
   Amount: [formatted amount] $TOKEN
   Value: ~$[usd value]

   [Link to Solscan]

5. **Environment Variables:**
   - BOT_TOKEN
   - HELIUS_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - ADMIN_USER_ID

Generate all files with full implementation. Use async/await, proper error handling,
and TypeScript strict mode. No comments in code.
```

---

## 7. Supabase Schema SQL

Run this in Supabase SQL editor:

```sql
-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  token_address text not null,
  token_symbol text,
  chat_id bigint not null,
  threshold_usd numeric default 5000,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Wallets table
create table wallets (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  address text not null,
  label text,
  is_whale boolean default false,
  balance numeric,
  last_updated timestamp with time zone default now()
);

-- Alerts table
create table alerts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  tx_signature text not null,
  wallet_address text not null,
  amount numeric not null,
  direction text not null,
  usd_value numeric,
  sent_at timestamp with time zone default now()
);

-- Indexes
create index idx_wallets_project on wallets(project_id);
create index idx_wallets_address on wallets(address);
create index idx_alerts_project on alerts(project_id);
```

---

## 8. Sample Outreach Message

Use this template for cold DMs:

```
Hey [name]!

I noticed [project] just graduated from pump.fun — congrats on the bond.

Quick question: are you tracking whale wallets yet? I built a bot that sends
instant Telegram alerts when your top 20 holders move tokens.

Helps you get ahead of FUD before it hits the chat.

Happy to set it up free for a week if you want to test it. Takes 5 min.

Let me know 🤝
```

---

## 9. Pricing Strategy

### Setup Fees (One-time)
- **Basic:** $100 — Single token, single channel
- **Pro:** $200 — Multi-token, custom labels, priority support
- **Custom:** $300+ — White-label, custom features

### Monthly Recurring
- $25-50/mo per project for hosting + maintenance
- Position as "insurance" — cheap vs. cost of one FUD incident

### Payment
- Use Stripe for fiat
- Accept USDC on Solana for crypto-native clients
- Request 100% upfront for setup, monthly in advance

---

## 10. Next Steps

1. [ ] Create Telegram bot via @BotFather
2. [ ] Set up Supabase project + run schema
3. [ ] Get Helius API key (free tier)
4. [ ] Scaffold bot with Cursor prompt above
5. [ ] Deploy to Railway
6. [ ] Find 1 beta client in Solana Discord
7. [ ] Iterate based on feedback
8. [ ] Launch paid offering

---

*Built with the Vibe Coding workflow: Claude + Cursor + Ship Fast*
