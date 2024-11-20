import { SpecializationArea } from './instructor';
import { Section } from './section';

export interface Course {
    course_id: string;
    uid: string;
    course_title: string;
    course_description: string;
    course_enrollment_number: number;
    course_number_of_section: number;
    course_pricing: number;
    course_rating: 1 | 2 | 3 | 4 | 5;
    course_requirements: string[];
    course_type: SpecializationArea;
    course_created_at: Date;
    course_updated_at: Date;
    course_thumbnail_url: string;
    enrolled_students: string[];
    sections: Section[];
}
