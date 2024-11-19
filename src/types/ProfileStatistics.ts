import { SpecializationArea } from './instructor';
import { StudentType } from './student';

export interface ProfileStatistics {
    student_types: StudentType[];
    specialization_areas: SpecializationArea[];
}
