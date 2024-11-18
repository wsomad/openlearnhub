import { SpecializationArea, StudentType, UserRole } from './User';

export interface UserProfile {
    uid: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
    profileImage?: string;
    created_at: Date;
    updated_at: Date;
    studentProfile: StudentProfile;
    instructorProfile?: InstructorProfile;
}

export interface StudentProfile {
    studentType: StudentType;
    coursesEnrolled: number;
    completed_courses: number;
    completion_status: boolean;
    enrollment_date: Date;
    enrolled_courses: string[]; // Array of course_ids
}

export interface InstructorProfile {
    profileSummary: string;
    specializationArea: SpecializationArea[];
    yearsOfExperience: number;
    coursesCreated: number;
    rating: 1 | 2 | 3 | 4 | 5;
    created_courses: string[]; // Array of course_ids
    socialLinks: {
        github?: string;
        linkedin?: string;
    };
}
