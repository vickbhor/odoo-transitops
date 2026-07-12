# TransitOps

A comprehensive fleet operations platform built to optimize vehicle management, maintenance, and logistics.

## Features (Fleet & Operations Track)

* Vehicle Registry: Manage fleet details with real-time status tracking (Available, On Trip, In Shop, Retired).
* Maintenance Module: Automated workflows that flip vehicle status to 'In Shop' during active maintenance and restore them to 'Available' upon closure.
* Smart Trip Dispatch: Form validation ensures cargo weight doesn't exceed vehicle capacity. Selects only 'Available' drivers and vehicles.
* Fuel & Expense Tracking: Log fuel consumption and toll/expense records per vehicle.
* Analytics & Reports Dashboard: Auto-computes Fleet Utilization (%), Fuel Efficiency (km/L), total Operational Costs, and overall Vehicle ROI with a 1-click CSV export.

## Tech Stack

* Frontend: Next.js (App Router), React, Tailwind CSS
* Backend & Database: Supabase (PostgreSQL, Authentication)
* Deployment: Vercel

## Local Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd transitops
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser.