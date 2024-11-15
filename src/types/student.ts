import {User} from './user';

export interface Student extends User {
    enrollment_date: Date;
    completed_course: number;
    completion_status: boolean;
}
