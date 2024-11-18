import {Section} from './section';

export interface Course {
    course_id: string;
    instructor_id: string; // References user_id of instructor
    course_title: string;
    course_description: string;
    course_enrollment_number: number;
    course_number_of_section: number;
    course_pricing: number;
    course_rating: 1 | 2 | 3 | 4 | 5;
    course_requirements: string[];
    course_type: string;
    course_created_at: Date;
    course_updated_at: Date;
    course_instructor: string;
    course_thumbnail_url: string;
    enrolled_students: string[]; // Array of user_ids
    sections: Section[];
}
