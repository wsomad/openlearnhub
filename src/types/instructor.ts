import { SpecializationArea, User } from './user';

export interface Instructor extends Omit<User, 'role'> {
    profileSummary: string;
    specializationArea: SpecializationArea[];
    years_of_experience: number;
    total_courses_created: number;
    created_courses: string[]; // Array of course_ids
    rating: 1 | 2 | 3 | 4 | 5;
    socialLinks: {
        github?: string;
        linkedin?: string;
    };
}
