# Clinic MVP

Welcome to your Dyad-generated Clinic MVP application! This project is built with React, TypeScript, Tailwind CSS, and uses Supabase for its backend (Authentication, PostgreSQL database, and Edge Functions).

## Getting Started

### 1. Supabase Project Setup

1.  **Create a Supabase Project:** If you haven't already, create a new project on the [Supabase website](https://app.supabase.com/).
2.  **Get API Keys:**
    *   Go to "Project Settings" -> "API".
    *   Note down your `Project URL` and `anon public` key.
    *   Go to "Project Settings" -> "API Keys" and find your `service_role` key (also known as `SERVICE_KEY`). This key has elevated privileges and should only be used in secure environments like Edge Functions or server-side code.
3.  **Environment Variables:** Create a `.env.local` file in the root of your project (where `package.json` is) and add the following:

    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    RESEND_API_KEY="YOUR_RESEND_API_KEY" # Get this from Resend (resend.com)
    ```
    Replace the placeholder values with your actual Supabase and Resend keys.

### 2. Run Database Migrations

The project includes SQL migration files to set up your database schema, enums, indexes, and Row Level Security (RLS) policies.

1.  **Install Supabase CLI:** If you don't have it, install the Supabase CLI:
    ```bash
    npm install -g supabase
    ```
2.  **Link to your project:**
    ```bash
    supabase login
    supabase link --project-ref YOUR_SUPABASE_PROJECT_ID
    ```
    You can find your project ID in your Supabase project URL (e.g., `https://app.supabase.com/project/YOUR_SUPABASE_PROJECT_ID`).
3.  **Apply Migrations:**
    ```bash
    supabase db push
    ```
    This command will apply the `supabase/migrations/*.sql` files to your Supabase database.

### 3. Deploy Supabase Edge Function

The `send-reminders` Edge Function is responsible for sending automated appointment reminders.

1.  **Set Edge Function Environment Variables:**
    *   Go to your Supabase project dashboard -> "Edge Functions" -> "send-reminders" -> "Settings".
    *   Add the following environment variables:
        *   `SUPABASE_URL`: Your Supabase Project URL (same as `VITE_SUPABASE_URL`).
        *   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` key.
        *   `RESEND_API_KEY`: Your Resend API key (same as `RESEND_API_KEY`).
2.  **Deploy the Function:**
    ```bash
    supabase functions deploy send-reminders --no-verify-jwt
    ```
    The `--no-verify-jwt` flag is used because this function will be called by a database trigger or cron job, not directly by an authenticated user.
3.  **Set up Cron Job (Optional, but recommended for reminders):**
    Supabase currently doesn't have built-in cron for Edge Functions directly from the UI. You'll need to set up an external cron job (e.g., using GitHub Actions, Vercel Cron, or a simple serverless function) to invoke your Edge Function every 5 minutes.
    The URL for your Edge Function will be something like:
    `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/send-reminders`
    You'll need to send a `POST` request to this endpoint.

### 4. Running the Frontend Application

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    Your React app will now be running, typically at `http://localhost:5173`.

## Application Features

*   **Authentication:** Email/password login.
*   **Role-Based Access:** Admin and Practitioner roles with different navigation and data access.
*   **Patient Management:** (To be implemented in future steps)
*   **Appointment Scheduling:** (To be implemented in future steps)
*   **Automated Reminders:** (Backend logic and Edge Function are set up)
*   **Audit Log:** (Backend logic and helper function are set up)

## Next Steps

You now have the foundational backend and frontend in place. The next steps would involve building out the UI for patient management, appointment scheduling, and the audit log page, integrating them with the Supabase client and TanStack Query.