import { SpecializationArea, StudentType } from './User';

export interface ProfileStatistics {
    student_types: StudentType[];
    specialization_areas: SpecializationArea[];
}
