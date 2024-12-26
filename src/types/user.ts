import { Timestamp } from 'firebase/firestore';

import UserProfile from '../assets/images/userProfile.png';
import { Instructor } from './instructor';
import { Student } from './student';

export type UserRole = 'student' | 'instructor';

export interface User {
    uid: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date | Timestamp;
    updated_at: Date | Timestamp;
    profile_image: string | typeof UserProfile;
    student?: Student;
    instructor?: Instructor;
}
