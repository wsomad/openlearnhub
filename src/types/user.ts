import {Instructor} from './instructor';
import {Student} from './student';
import UserProfile from '../assets/images/userProfile.png';

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
    profile_image: string | typeof UserProfile;
    student?: Student;
    instructor?: Instructor;
}
