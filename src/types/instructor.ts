import {User} from './user';

//extends Omit<User, 'role' | 'firstname' | 'lastname' | 'c'>

export interface Instructor {
    profile_summary?: string;
    specialization_area?: SpecializationArea[];
    years_of_experience?: number;
    total_courses_created?: number;
    created_courses?: string[];
    rating?: 1 | 2 | 3 | 4 | 5;
    social_links?: {
        github?: string;
        linkedin?: string;
    };
    hasRegister?: boolean,
}

export type SpecializationArea =
    | 'Web Development'
    | 'Machine Learning'
    | 'Mobile Development'
    | 'Cybersecurity'
