CREATE UNIQUE INDEX IF NOT EXISTS appointments_unique_active_slot
  ON public.appointments (scheduled_at)
  WHERE status <> 'cancelled'::appointment_status;

CREATE OR REPLACE FUNCTION public.booked_slots(_from timestamptz, _to timestamptz)
RETURNS TABLE (scheduled_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.scheduled_at
  FROM public.appointments a
  WHERE a.status <> 'cancelled'::appointment_status
    AND a.scheduled_at >= _from
    AND a.scheduled_at < _to
$$;

REVOKE ALL ON FUNCTION public.booked_slots(timestamptz, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.booked_slots(timestamptz, timestamptz) FROM anon;
GRANT EXECUTE ON FUNCTION public.booked_slots(timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.booked_slots(timestamptz, timestamptz) TO service_role;