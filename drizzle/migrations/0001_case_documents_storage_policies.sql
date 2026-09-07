-- Zugriff auf Dokumente: Pfad ist <case_id>/<dateiname>
create policy "case docs select"
on storage.objects for select to authenticated
using (
  bucket_id = 'case-documents' and (
    public.is_staff(auth.uid())
    or exists (
      select 1 from public.cases c
      where c.customer_id = auth.uid()
        and c.id::text = (storage.foldername(name))[1]
    )
  )
);

create policy "case docs insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'case-documents' and (
    public.is_staff(auth.uid())
    or exists (
      select 1 from public.cases c
      where c.customer_id = auth.uid()
        and c.id::text = (storage.foldername(name))[1]
    )
  )
);

create policy "case docs delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'case-documents' and (
    public.is_staff(auth.uid())
    or exists (
      select 1 from public.cases c
      where c.customer_id = auth.uid()
        and c.id::text = (storage.foldername(name))[1]
    )
  )
);
