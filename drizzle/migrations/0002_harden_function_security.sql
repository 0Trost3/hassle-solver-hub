-- search_path fuer verbleibende Funktionen fest setzen
ALTER FUNCTION public.add_business_days(timestamptz, integer) SET search_path = public;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

-- Trigger-Funktionen: werden nur ueber Trigger ausgefuehrt, EXECUTE nicht noetig
REVOKE EXECUTE ON FUNCTION public.set_ticket_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;

-- add_business_days wird nicht per RPC genutzt
REVOKE EXECUTE ON FUNCTION public.add_business_days(timestamptz, integer) FROM anon, authenticated, public;

-- Rollen-Hilfsfunktionen: RLS-Policies gelten nur fuer angemeldete Nutzer,
-- daher EXECUTE fuer anonyme Aufrufer entziehen (authenticated bleibt noetig)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;