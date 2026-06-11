REVOKE INSERT ON public.enquiries FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;
DROP POLICY IF EXISTS "anon can insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow anonymous enquiry submissions" ON public.enquiries;
DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;