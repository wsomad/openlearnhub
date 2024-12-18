export interface Instructor {
    profile_summary?: string;
    specialization_area?: SpecializationArea[];
    years_of_experience?: number;
    total_courses_created?: number;
    created_courses?: string[];
    ratings?: {
        [studentId: string]: number; // Maps student IDs to their ratings (1-5)
    };
    averageRating?: number;
    social_links?: {
        github?: string;
        linkedin?: string;
    };
    hasRegister?: boolean;
}

export type SpecializationArea =
    | 'Web Development'
    | 'Machine Learning'
    | 'Mobile Development'
    | 'Cybersecurity';
