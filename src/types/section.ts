import { Lesson } from './Lesson';
import { Quiz } from './Quiz';

export interface Section {
    section_id: string;
    section_title: string;
    section_order: number;
    course_id: string;
    lessons: Lesson[];
    quizzes?: Quiz[];
}
