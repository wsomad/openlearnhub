import { Instructor } from './Instructor';
import { Student } from './Student';

export type UserRole = 'student' | 'instructor';

export type SpecializationArea =
    | 'Web Development'
    | 'Data Science'
    | 'Machine Learning'
    | 'Mobile Development'
    | 'Cloud Computing'
    | 'DevOps'
    | 'Cybersecurity'
    | 'UI/UX Design'
    | 'Business Analytics'
    | 'Digital Marketing';

export interface User {
    uid: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
    profileImage?: string;
    student: Student[];
    instructor: Instructor[];
}
