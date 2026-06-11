-- Migration to add academic selection columns to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_exams TEXT[] DEFAULT '{}';
