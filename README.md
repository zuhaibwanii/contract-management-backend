# Contract Management Backend

This is the backend for the Contract Management application, built using Node.js and Express.js.

## Prerequisites

Make sure you have Node.js version **>=18.18.0** installed before proceeding.

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/zuhaibwanii/contract-management-backend.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd contract-management-backend
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```

## Setting Up Supabase Table

Before running the backend, you need to create a `contracts` table in Supabase. Run the following SQL query in the Supabase SQL editor:

```sql
CREATE TABLE IF NOT EXISTS contracts (
  contract_id INT8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content JSONB,
  client_name TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
CLIENT_URL=http://localhost:5173
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

These variables ensure that the backend correctly connects to Supabase and communicates with the frontend.

## Local Development Guide

- Ensure your `.env` file is set up with the correct values.
- Start the backend using `npm run dev`, which will run the server in development mode.
- Make sure your Supabase database is properly configured before testing API calls.

For any issues, check that your Supabase credentials are correct and that the frontend (`CLIENT_URL`) is properly configured.

Happy coding! 🚀

