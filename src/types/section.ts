import {Lesson} from './lesson';
import {Quiz} from './quiz';

export interface Section {
    section_id: string;
    section_title: string;
    section_order: number; // Unique number for ordering (e.g., 1, 2, 3)
    course_id: string;
    lessons: Lesson[]; // One or more lessons
    quizzes?: Quiz[]; // Optional quizzes per section
}
