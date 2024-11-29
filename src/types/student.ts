import { Course } from './course';
import { User } from './user';

export interface Student extends Omit<User, 'role'> {
    student_type: StudentType;
    enrollment_date: Date; //after signing up
    completed_courses: number;
    courses_enrolled: number;
    completion_status: boolean;
    enrolled_courses: string[];
    // enrolled_courses: Course[]; // Array of course_ids
}

export type StudentType =
    | 'Secondary'
    | 'High School'
    | 'Undergraduate'
    | 'Postgraduate'
    | 'Doctorate'
    | 'Professional Certification';
