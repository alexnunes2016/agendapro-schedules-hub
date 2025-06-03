-- Função compatível para chamadas com ordem invertida dos parâmetros
CREATE OR REPLACE FUNCTION public.get_system_statistics(
  end_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN public.get_system_statistics(start_date, end_date);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_system_statistics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated; 