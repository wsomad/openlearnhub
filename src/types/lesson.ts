export interface Lesson {
    lesson_id: string;
    lesson_title: string;
    lesson_content: string;
    lesson_duration: number;
    section_id: string;
    lesson_videoUrl?: string;
    lesson_documentUrl?: string;
    quiz_id?: string;
}
