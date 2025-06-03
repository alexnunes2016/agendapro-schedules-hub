#!/bin/bash

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "Error: SUPABASE_DB_URL environment variable is not set"
    exit 1
fi

# Apply migrations in order
echo "Applying migrations..."

# 1. Update database schema
echo "1. Updating database schema..."
psql "$SUPABASE_DB_URL" -f migrations/20240604000000_update_database_schema.sql

# 2. Update RLS policies
echo "2. Updating RLS policies..."
psql "$SUPABASE_DB_URL" -f migrations/20240604000001_update_rls_policies.sql

# 3. Update system statistics function
echo "3. Updating system statistics function..."
psql "$SUPABASE_DB_URL" -f migrations/20240604000002_update_system_statistics.sql

echo "Migrations completed successfully!" 