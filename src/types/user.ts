export interface User {
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: 'student' | 'instructor';
    created_at: Date;
    updated_at: Date;
}
