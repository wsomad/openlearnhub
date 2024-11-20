import {Course} from './course';
import {User} from './user';

export interface Instructor extends Omit<User, 'role'> {
    profile_summary: string;
    specialization_area: SpecializationArea[];
    years_of_experience: number;
    total_courses_created: number;
    created_courses: string[]; // Array of course_ids
    // total_courses_created: Course;
    // created_courses: Course[]; // Array of course_ids
    rating: 1 | 2 | 3 | 4 | 5;
    social_links: {
        github?: string;
        linkedin?: string;
    };
}

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
