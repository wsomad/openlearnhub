import {Lesson} from './lesson';
import {Quiz} from './quiz';

export interface Section {
    section_id: string;
    section_title: string;
    section_order: number;
    course_id: string;
    lessons: Lesson[];
    quizzes?: Quiz[];
}
