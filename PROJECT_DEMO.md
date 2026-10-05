# OrbitEdge — Product Demo Script
### *Hotel Competitive Intelligence Platform*

---

## The Problem We Are Solving

Hotel revenue managers in India today do this manually — opening 5 browser tabs, checking MakeMyTrip one by one, writing prices in Excel, and guessing what to charge tonight.

This is the reality for 90% of independent and mid-scale hotels. They have **no live visibility** into what their competitors are actually charging right now. They miss peak-demand windows, undercharge when they should push rates up, and have no data to back their pricing decisions.

**OrbitEdge fixes this.**

It is a fully automated competitive intelligence platform that scrapes real-time pricing, availability, and demand signals from MakeMyTrip — and transforms that raw data into actionable insights, all inside one premium dashboard.

---

## What Makes OrbitEdge Unique

- **100% automated** — scrapes competitor data on a schedule, no manual work
- **MakeMyTrip-native** — built specifically for the Indian hotel market
- **Live data, not samples** — every number you see is from the last tracking run
- **AI-powered advisor** — uses Gemini to analyse your market position and give human-readable recommendations
- **Scenario-aware** — tracks different booking configurations (family weekend, business 2-night, etc.) separately

---

# Page-by-Page Walkthrough

---

## 1. Overview Dashboard  —  /

> "This is your command centre. Everything important, at a glance."

### KPI Cards (Top Row)
- **Your Rate Tonight** — the latest scraped price for your own property. Updates every tracking run.
- **Market Average** — real-time average price across all tracked competitors right now.
- **Demand Score** — a 0–100 composite signal calculated from booking velocity, sell-out frequency, and availability tightening. Higher = more urgency to raise prices.
- **Active Competitors** — how many properties in your market are currently being tracked.

### Competitor Ranking Table
- Lists all tracked hotels sorted by current price (cheapest to most expensive).
- Shows each property's price, star rating, availability units, and how they sit vs the market average.
- Colour-coded: green = priced below market (opportunity), red = priced above (risk).
- Your own property is highlighted so you can instantly see where you rank.

> "Instead of opening 10 tabs, a revenue manager sees their entire competitive landscape in one scroll. They know within seconds whether to hold, cut, or raise rates."

---

## 2. Competitors Page  —  /competitors

> "Go deeper on every competitor — who they are, what they charge, and how they perform."

### Competitor Intelligence Table
- Full list of all tracked properties with: current price, rating, review count, availability, booking velocity score, and estimated revenue.
- **7-day change column** — shows whether a competitor's price has gone up or down over the past week.
- Filter bar at the top lets you search by property name instantly.
- Click any row to jump directly to that hotel's MakeMyTrip page.

> "You are not just seeing prices — you are seeing demand signals. A competitor with 2 units left and a high velocity score is about to sell out. That is your signal to push your own rate up right now."

---

## 3. Pricing Intelligence  —  /pricing

> "This is where raw competitor data becomes a pricing decision."

### KPI Cards
- **Your Current Rate** — what you are charging tonight.
- **Market Average** — what the competition is charging on average.
- **Positioning vs Market** — are you 12% above or 8% below? Shown as a live percentage.
- **Est. Revenue 7 Days** — your estimated gross booking value for the week based on demand signals.

### Market Rate Distribution Chart — the highlight
- A histogram showing how all competitor prices are clustered across price buckets (e.g. 2k–3k, 3k–4k...).
- Your bar is highlighted in blue with a "You" label above it.
- The market average bar is amber with an "Avg" label.
- Hover over any bar to see exactly how many hotels are in that price bracket.
- This instantly shows you whether you are priced in a crowded cluster or in a gap.

### Pricing Opportunities Panel
- AI-driven card that reads your live position and gives one of three recommendations:
  - Rate is uncompetitive — you are 20%+ above market, consider a flash sale.
  - Opportunity to push — you are underpriced, competitors are selling out, raise now.
  - Perfectly positioned — hold rates, monitor sell-outs.
- This changes automatically based on the latest data — no manual updating.

> "The distribution chart is something no spreadsheet can show you. You can see in 3 seconds whether the entire market has collapsed to 3k or whether there is headroom at 7k. That is a decision that used to take 45 minutes."

---

## 4. Availability Page  —  /availability

> "Track room scarcity — because sold-out competitors are your biggest opportunity signal."

### Market Availability Overview
- Shows the percentage of competitors currently showing available rooms vs sold out.
- Live numbers pulled from the latest scrape.

### Sold-Out Tracker
- A live list of which specific competitors are currently sold out.
- This is critical — a sold-out competitor at 4,000 means the market is willing to pay 4,000. You can safely charge the same or more.

### Availability Trend Chart
- Shows how many properties were available vs sold out over the past days.
- Lets you spot patterns — weekends consistently tighter? Use that to set pre-emptive weekend rate rules.

> "Availability scarcity is the single strongest signal to raise prices. OrbitEdge makes this visible automatically. No more 'I think the market is tight tonight' — you can see it."

---

## 5. Demand Intelligence  —  /demand

> "Understand market momentum, not just today's prices."

### Demand Score KPI
- The headline Demand Score (0–100) derived from multiple signals: booking velocity, sell-out frequency, weekend premium, and availability tightening.

### Booking Velocity Rankings
- A ranked table of all competitors sorted by their estimated daily booking rate.
- Shows who is filling up fastest — these are the properties setting the market tone.
- Demand bar visualization makes it easy to see at a glance who has the most momentum.

> "Price is a lagging indicator. Velocity is leading. If a competitor's booking velocity is spiking, their price will go up soon — or they will sell out. OrbitEdge shows you this before it happens."

---

## 6. Revenue Intelligence  —  /revenue

> "Estimate the size of the opportunity — and whether you are capturing your share."

### KPI Cards
- **Your Est. Revenue 7 Days** — your estimated gross booking value based on observed demand.
- **Market Total Revenue** — the combined estimated revenue of all tracked competitors.
- **Your Market Share** — what percentage of the total pie you are capturing.
- **Revenue Opportunity** — how much additional revenue is available if you optimise your rate.

Note: All revenue figures are clearly labelled as Estimated — based on observed prices, demand scores, and typical occupancy patterns.

### Competitor Revenue Estimates Table
- Lists all competitors ranked by their 7-day estimated gross booking value.
- Colour-coded demand bars show who is generating the most.

> "Most hoteliers only know their own revenue. OrbitEdge gives you a market-level view — you can see your fair share of demand and identify if a competitor is disproportionately capturing bookings you should be getting."

---

## 7. AI Advisor  —  /ai

> "Your personal revenue strategy analyst — available 24/7."

### How It Works
- Click "Get AI Insights" and OrbitEdge:
  1. Pulls live market data from your database (prices, demand, availability, sell-outs)
  2. Feeds it to Google Gemini with a structured hotel revenue management prompt
  3. Streams a detailed, context-aware analysis back to you in real time

### What It Tells You
- Current market positioning diagnosis
- Specific rate recommendations with reasoning
- Risk flags (e.g. "3 competitors will likely sell out by tonight")
- Opportunity windows based on demand patterns

> "This is not a chatbot giving generic advice. It is an AI that has read your actual competitor data for today and is giving you hotel-industry-specific guidance based on your real market position."

---

## 8. Alerts Page  —  /alerts

> "Never miss a market movement — get notified automatically."

### Live Alert Feed
- Every time the tracker detects a significant change — a competitor raises price by 15%, a hotel sells out, a new lowest price appears — it logs an alert.
- Alerts are displayed as individual cards in a scrollable feed.
- Unread alerts have a glowing blue dot indicator.
- Numbers, prices, and percentages are colour-coded: green for increases, red for decreases.
- Severity levels (High / Medium / Low) are colour-coded so critical events stand out.

> "You do not need to log in every hour to check what changed. OrbitEdge monitors for you and surfaces the moments that matter."

---

## 9. Booking Scenarios  —  /scenarios

> "Track prices across different booking configurations — not just one."

### What Are Scenarios?
- A scenario defines a specific booking context: e.g. "2 Adults, 1 Room, 2 Nights, Weekend."
- The tracker runs each scenario independently, so you can see how competitor prices vary for family bookings vs business bookings.

### Scenario Cards
- Each active scenario is displayed as a card showing guests, rooms, nights, and date type.
- You can create new scenarios, enable/disable them, and the tracker automatically picks them up on the next run.

> "Hotels charge differently for weekdays vs weekends, 1-night vs 3-night stays. OrbitEdge tracks all of them simultaneously — giving you a complete pricing matrix, not just one data point."

---

## 10. Tracking History  —  /tracking

> "Full audit trail of every data collection run."

### Tracking Run Table
- Shows every automated or manual scraping run: start time, completion time, status, total properties scraped, and success rate with a visual progress bar.

### Manual Tracking Trigger
- From the Overview page, a "Run Tracker Now" button lets you trigger an immediate data collection cycle.
- A live progress bar updates in real time as each property is scraped.

> "Full transparency into the data pipeline. You know exactly when the last data was collected, how many properties were successfully tracked, and whether any failed."

---

## Closing Summary

OrbitEdge transforms competitive intelligence from a manual, time-consuming guessing game into an automated, data-driven process that takes seconds.

| Without OrbitEdge                     | With OrbitEdge                                    |
|---------------------------------------|---------------------------------------------------|
| 45 mins manually checking 10 tabs     | Real-time dashboard, auto-refreshed               |
| Gut-feel pricing decisions            | Data-backed pricing with AI recommendations       |
| No visibility into competitor sell-outs | Live sold-out tracker + alerts                  |
| One booking type tracked              | Multiple scenarios tracked simultaneously         |
| No demand forecasting                 | Booking velocity + demand score signals           |
| Revenue decisions made in the dark    | Market share estimates + opportunity sizing       |

> OrbitEdge gives Indian hotel revenue managers their first true competitive intelligence system — purpose-built for MakeMyTrip, powered by real data, and accessible without any technical expertise.

---
*Demo recorded for OrbitEdge v1.0 — Built with Next.js, FastAPI, Supabase and Google Gemini*
