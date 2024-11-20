import { Quiz } from './quiz';

// Combined Lesson Type (Union)
export type LessonBase = DocumentLesson | VideoLesson | QuizLesson;

// Base Lesson Interface (shared fields)
export interface Lesson {
    lesson_id: string;
    section_id: string;
    lesson_title: string;
    lesson_order: number;
    lesson_type: 'document' | 'video' | 'quiz'; // Required for distinguishing
}

// Document Lesson
export interface DocumentLesson extends Lesson {
    lesson_type: 'document'; // Fixed to 'document'
    document_url: string; // URL or upload field
}

// Video Lesson
export interface VideoLesson extends Lesson {
    lesson_type: 'video'; // Fixed to 'video'
    video_url: string; // URL for the video
    video_duration: number; // Duration in seconds or minutes
}

// Quiz Lesson
export interface QuizLesson extends Lesson {
    lesson_type: 'quiz'; // Fixed to 'quiz'
    quiz: Quiz; // Reuse the Quiz interface
}
