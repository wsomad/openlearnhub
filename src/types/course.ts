export interface Course {
    course_id: string;
    course_description: string;
    course_enrollment_number: number;
    course_number_of_section: number;
    course_pricing: number;
    course_rating: 1 | 2 | 3 | 4 | 5;
    course_requirements: [];
    course_type: string;
    course_created_at: Date;
    course_updated_at: Date;
    course_title: string;
    course_thumbnail_url: string;
}
