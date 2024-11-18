import { StudentType, User } from './User';

export interface Student extends Omit<User, 'role'> {
    studentType: StudentType;
    enrollment_date: Date;
    completed_courses: number;
    coursesEnrolled: number;
    completion_status: boolean;
    enrolled_courses: string[]; // Array of course_ids
}
