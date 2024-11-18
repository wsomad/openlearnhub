export type UserRole = 'student' | 'both';
export type StudentType =
    | 'Secondary'
    | 'High School'
    | 'Undergraduate'
    | 'Postgraduate'
    | 'Doctorate'
    | 'Professional Certification';

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
}
