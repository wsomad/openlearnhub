import {Question} from './Question';

export interface Quiz {
    quiz_id: string;
    quiz_title: string;
    quiz_number_of_questions: number;
    questions: Question[];
}
