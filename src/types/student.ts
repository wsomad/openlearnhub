import { Course } from './course';
import { User } from './user';

export interface Student extends Omit<User, 'role'> {
    student_type: StudentType;
    enrollment_date: Date;
    completed_courses: number;
    courses_enrolled: number;
    completion_status: boolean;
    enrolled_courses: Course[]; // Array of course_ids
}

// studentType: StudentType;
//     coursesEnrolled: number;
//     completed_courses: number;
//     completion_status: boolean;
//     enrollment_date: Date;
//     enrolled_courses: string[];

export type StudentType =
    | 'Secondary'
    | 'High School'
    | 'Undergraduate'
    | 'Postgraduate'
    | 'Doctorate'
    | 'Professional Certification';
