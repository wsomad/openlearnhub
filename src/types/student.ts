import { Course } from './course';
import { User } from './user';

export interface Student {
    student_type?: StudentType;
    completed_courses?: number;
    enrolled_courses?: string[];
}

export type StudentType =
    | 'Secondary'
    | 'High School'
    | 'Undergraduate'
    | 'Postgraduate'
    | 'Doctorate'
    | 'Professional Certification';
