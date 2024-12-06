import { Course } from './course';
import { User } from './user';

//extends Omit<User, 'role'>

export interface Student {
    student_type?: StudentType;
    enrollment_date?: Date; //after signing up
    completed_courses?: number;
    courses_enrolled?: number;
    completion_status?: boolean;
    enrolled_courses?: string[];
    // enrolled_courses: Course[]; // Array of course_ids
}

export type StudentType =
    | 'Secondary'
    | 'High School'
    | 'Undergraduate'
    | 'Postgraduate'
    | 'Doctorate'
    | 'Professional Certification';
