export interface CourseEnrollment {
    user_id: string;
    course_id: string;
    enrollment_date: Date;
    completion_status: boolean;
    last_accessed?: Date;
    progress: number; // Percentage of course completed
    completed_lessons: string[]; // Array of completed lesson_ids
    quiz_scores: {
        quiz_id: string;
        score: number;
        completed_at: Date;
    }[];
}
