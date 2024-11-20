import {Instructor} from './instructor';
import {Student} from './student';

export type UserRole = 'student' | 'instructor';

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
    profile_image?: string;
    student: Student;
    instructor?: Instructor;
}
