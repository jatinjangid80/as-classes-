REVOKE SELECT, UPDATE, DELETE ON public.enquiries FROM anon, authenticated;
CREATE POLICY "Deny client reads on enquiries" ON public.enquiries AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny client updates on enquiries" ON public.enquiries AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny client deletes on enquiries" ON public.enquiries AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);