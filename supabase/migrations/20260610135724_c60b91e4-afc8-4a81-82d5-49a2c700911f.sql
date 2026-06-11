
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;

-- Tighten enquiries: still public, but require non-empty values
DROP POLICY "Anyone can submit enquiry" ON public.enquiries;
CREATE POLICY "Public can submit enquiry"
ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 100
  AND length(trim(email)) BETWEEN 3 AND 255
  AND email LIKE '%@%'
  AND length(trim(message)) BETWEEN 1 AND 2000
);

-- Seed courses
INSERT INTO public.courses (title, subject, description, level, duration, price, features) VALUES
('Mathematics Mastery', 'Mathematics', 'Build rock-solid foundations in algebra, geometry, calculus and problem solving.', 'Class 9-12', '6 months', 4999, ARRAY['Live classes','Weekly tests','Doubt clearing','PDF notes']),
('Physics Powerhouse', 'Physics', 'Conceptual physics with real-world experiments and JEE/NEET-style problem sets.', 'Class 11-12', '8 months', 6499, ARRAY['Lab demos','Mock tests','Recorded lectures','One-on-one mentor']),
('Chemistry Champion', 'Chemistry', 'Master organic, inorganic and physical chemistry the smart way.', 'Class 11-12', '8 months', 5999, ARRAY['Reaction maps','Practice sheets','Live doubt classes']),
('Biology Brilliance', 'Biology', 'NEET-focused biology with diagrams, mnemonics and chapter-wise tests.', 'Class 11-12', '8 months', 5999, ARRAY['NCERT deep-dive','Weekly quizzes','Mock NEET']),
('Coding for Kids', 'Computer Science', 'Fun introduction to coding through games, animations and small projects.', 'Class 5-8', '3 months', 2999, ARRAY['Scratch & Python','Project portfolio','Live mentors']),
('English Fluency', 'English', 'Speaking, writing and grammar — built for confidence in school and beyond.', 'Class 6-10', '4 months', 3499, ARRAY['Speaking practice','Essay reviews','Vocabulary drills']);
