CREATE OR REPLACE FUNCTION public.get_system_statistics(
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  date_filter text;
BEGIN
  -- Construir filtro de data
  IF start_date IS NOT NULL AND end_date IS NOT NULL THEN
    date_filter := ' AND created_at BETWEEN ' || quote_literal(start_date) || ' AND ' || quote_literal(end_date);
  ELSE
    date_filter := '';
  END IF;

  -- Estatísticas de usuários
  WITH user_stats AS (
    SELECT
      COUNT(*) as total_users,
      COUNT(*) FILTER (WHERE is_active = true) as active_users,
      COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_users_this_month,
      COALESCE(SUM(CASE
        WHEN plan = 'basico' THEN 49.90
        WHEN plan = 'profissional' THEN 129.90
        WHEN plan = 'premium' THEN 299.90
        ELSE 0
      END), 0) as total_revenue_estimate,
      jsonb_object_agg(
        plan,
        COUNT(*)
      ) as plan_distribution
    FROM profiles
    WHERE 1=1
    || date_filter
    GROUP BY 1
  )
  SELECT json_build_object(
    'total_users', total_users,
    'active_users', active_users,
    'inactive_users', inactive_users,
    'new_users_this_month', new_users_this_month,
    'total_revenue_estimate', total_revenue_estimate,
    'plan_distribution', plan_distribution
  ) INTO result
  FROM user_stats;

  RETURN result;
END;
$$; 