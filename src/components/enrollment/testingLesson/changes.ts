import { LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';

export interface PendingChanges {
    sections: Section[];
    lessons: {
        sectionId: string;
        lessonData: LessonBase;
    }[];
    deletedSections: string[];
    deletedLessons: {
        sectionId: string;
        lessonId: string;
    }[];
}
