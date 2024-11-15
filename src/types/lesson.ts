export interface Lesson {
    lesson_id: string;
    lesson_title: string;
    lesson_content: string; // The main content of the lesson, can be text or description
    lesson_duration: number; // Duration of the lesson in minutes
    section_id: string; // Course ID to link the lesson to a course
    lesson_videoUrl?: string; // Optional if there's a video
    lesson_documentUrl?: string; // Optional if there's a document
    quiz_id?: string; // Optional if there's a quiz, references a Quiz
}
