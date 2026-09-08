-- UPDATE-Recht fuer case-documents auf Besitzer und Staff beschraenken
CREATE POLICY "case_documents_update_owner_or_staff"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'case-documents'
  AND (
    public.is_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id::text = (storage.foldername(name))[1]
        AND c.customer_id = auth.uid()
    )
  )
);

-- Audit-Log: nur noch Staff darf Eintraege schreiben
DROP POLICY IF EXISTS "audit_log_insert_own_actor" ON public.audit_log;

CREATE POLICY "audit_log_insert_staff"
ON public.audit_log
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_staff(auth.uid())
  AND actor_id = auth.uid()
);