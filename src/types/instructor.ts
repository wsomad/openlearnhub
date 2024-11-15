import {User} from './user';

export interface Instructor extends User {
    social_account_link: [];
    specializaiton_Area: [];
    summary: string;
    total_course_created: number;
    years_of_experience: number;
    rating: 1 | 2 | 3 | 4 | 5;
}
