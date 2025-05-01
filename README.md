
# 💸 SpendWise — Smart Expense Tracking with LLM + OCR + Supabase

SpendWise is a powerful, web-based expense tracking application built with **Next.js**, **Supabase**, and **Large Language Models (LLM) APIs**. It enables users to manage bills and expenses manually or automatically via receipt images and natural language input.

---

## ✨ Features

- ✅ **Manual Bill Entry**: Amount, category, currency, date, notes
- 🤗 **Multiple LLM Support**: Uses [Together AI](https://togeth.ai) to support various trending LLMs (e.g. GPT, Gemini, DeepSeek, Qwen)
- 🧠 **LLM-Powered Auto Categorization**: Suggests categories from description or history
- 🧾 **Receipt OCR Upload**: Extracts bill info from images (screenshots, paper receipts)
- 💬 **Natural Language Parsing**: Input like `gas 45.5`, `Starbucks 3.8` and GPT fills details
- 📊 **Statistics & Charts**: Visualize spending by category and time
- 🔐 **User Auth**: Secure email/password signup/login via Supabase Auth
- 🌎 **Multi-device**: Fully responsive, works on mobile/tablet/desktop

---

## 🛠 Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | Next.js (App Router), [Ant Design](https://ant.design), [Tailwind CSS](https://tailwindcss.com) |
| Backend       | Next.js API Routes (Edge/serverless) |
| Auth & DB     | Supabase (Postgres, Auth, Storage) |
| OCR           | Tesseract.js |
| LLM           | [Together AI](https://togeth.ai) or [OpenAI](https://openai.com) |
| Charts        | [Chart.js](https://www.chartjs.org) |
| Deployment    | [Vercel](https://vercel.com) for frontend, [Supabase](https://supabase.com) for backend |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-ledger.git
cd ai-ledger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_TOGETHER_API_KEY=your-together-api-key
```

> Supabase credentials found under Project → Settings → API

---

## 🔧 Database Schema

### `auth.users` (built-in)

- Managed by Supabase Auth (email/password)

### `profiles`

```sql
create table profiles (
  id uuid primary key references auth.users,
  display_name text,
  created_at timestamp default now()
);
```

### `bills`

```sql
create table bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  amount numeric not null,
  currency text not null,
  category text,
  description text,
  bill_date date,
  image_url text,
  created_at timestamp with time zone default now()
);
```

---

## 🧪 Scripts

### Dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 🖼️ Screenshots



---

## 🧠 How AI Is Used

- `gpt.ts` utility sends prompts to OpenAI for:
  - Bill category classification
  - Parsing natural language or OCR text into structured bill data

- Optional: users can enter their own GPT API key for privacy and control

---

## 🧳 Deployment

- 🔥 **Frontend + API**: [Vercel](https://vercel.com) (1-click from GitHub)
- ☁️ **Database/Auth**: [Supabase](https://supabase.com) (Postgres + Auth + File Upload)
- 💬 **LLM** : [Together AI](https://togeth.ai) or [OpenAI](https://openai.com) (API key required)
- 🤖 **OCR**:
  - Local: Tesseract.js (in-browser, no cost)
  - Cloud: Google Cloud Vision API

---

## 🙋‍♂️ Future Plans

- Recurring bills / reminders
- Export to CSV or email reports
- Budget goals
- Group/shared expenses (like Splitwise)
- Stripe for billing if SaaS

---
