# 💼 FinTrack – AI-Powered Finance Management Platform

I designed and developed **FinTrack**, an **AI-powered finance management platform** that helps users track and manage their income and expenses across multiple accounts with an intuitive web interface.

<p align="center">
  <img src="public/fintrack_screenshot.png" alt="FinTrack Dashboard Preview" width="100%" />
</p>

---

## 🚀 Features

- 💡 **AI-based Receipt Scanning**  
  Automatically extracts transaction details from uploaded receipts using OCR (Optical Character Recognition).

- 🧠 **Smart Transaction Categorization**  
  Categorizes transactions using rule-based logic and NLP (Natural Language Processing).

- 🔁 **Recurring Transaction Setup**  
  Schedule and manage regular payments like subscriptions, salaries, or bills.

- 📧 **Automated Email Alerts**  
  Notifies users about upcoming bills, low balances, and irregular financial activity.

- 📊 **Visual Budgeting Insights**  
  Offers clean summaries and visual analytics like pie-chart, Bar-graph to help improve financial planning.

- 🔒 **Multi-Account Support**  
  Manage personal, current, or saving effortlessly.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS  
- **Backend:** Prisma, Supabase (PostgreSQL)  
- **Authentication:** Clerk  
- **AI Services:** OCR & NLP APIs for receipt processing and smart categorization  

---

## 🧠 About this project

This project reflects my interest in building intelligent, user-focused applications that solve real-world problems through automation and design FinTrack combines powerful AI integrations with modern full-stack technologies to deliver a seamless personal finance experience.

## 📬 Contact

Feel free to connect with me on LinkedIn or explore my other projects!


## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FinTrack.git
cd fintrack
```

2. Install dependencies:
```bash
npm install

3. Set up environment variables:

Edit the `.env` file with your API keys and configuration:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here

CLERK_SECRET_KEY=your_key_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up

<!-- Connect to Supabase via connection pooling with Supavisor. -->
DATABASE_URL=your_url_here

<!-- Direct connection to the database. Used for migrations. -->
DIRECT_URL=your_url_here

ARCJET_KEY=your_key_here

### Running the Application
Start the dev server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`