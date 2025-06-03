# Database Migration Instructions

## Overview
This directory contains the database schema, Row Level Security (RLS) policies, and system functions for the AgendaPro Schedules Hub application.

## Migration Files
- `combined_migrations.sql`: Contains all database changes including:
  - Table creation and relationships
  - Row Level Security policies
  - Helper functions and triggers
  - System statistics function

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended)
1. Log in to your Supabase project dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy the contents of `combined_migrations.sql`
5. Paste into the SQL Editor
6. Click "Run" to execute the migrations

### Option 2: Using psql (Alternative)
If you have direct database access:

```bash
psql "postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f combined_migrations.sql
```

## Verification
After applying migrations, verify:
1. All tables are created in the public schema
2. RLS is enabled on all tables
3. Policies are correctly applied
4. Helper functions are available
5. System statistics function is accessible to authenticated users

## Troubleshooting
If you encounter any issues:
1. Check the Supabase logs for detailed error messages
2. Ensure you have the necessary permissions
3. Verify the database connection is stable
4. Make sure there are no conflicting table names or policies

For additional support, please contact the development team. 