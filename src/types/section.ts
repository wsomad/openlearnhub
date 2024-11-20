import { LessonBase } from './lesson';

export interface Section {
    section_id: string;
    section_title: string;
    section_order: number;
    course_id: string;
    lessons: LessonBase[];
}
