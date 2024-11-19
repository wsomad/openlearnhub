import React, { createContext, useContext, useEffect, useState } from 'react';

import { Course } from '../../../types/course';
import { Section } from '../../../types/section';

interface CourseContextType {
    courses: Course[];
    updateCourse: (courseId: string, updatedCourse: Course) => void;
    addCourse: (newCourse: Partial<Course>, instructorId: string) => string;
    findCourseById: (courseId: string) => Course | undefined;
    findCoursesByInstructor: (instructorId: string) => Course[];
    updateCourseSections: (courseId: string, sections: Section[]) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{children: React.ReactNode}> = ({
    children,
}) => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await fetch('/dummyData.json');
                const data = await response.json();
                setCourses(data.courses);
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        };
        loadCourses();
    }, []);

    const addCourse = (newCourse: Partial<Course>, instructorId: string) => {
        const courseId = `course-${Date.now()}`;
        const courseWithId: Course = {
            course_id: courseId,
            instructor_id: instructorId,
            course_title: newCourse.course_title || '',
            course_description: newCourse.course_description || '',
            course_enrollment_number: 0,
            course_number_of_section: 0,
            course_pricing: newCourse.course_pricing || 0,
            course_rating: 5,
            course_requirements: newCourse.course_requirements || [],
            course_type: newCourse.course_type || 'Online',
            course_created_at: new Date(),
            course_updated_at: new Date(),
            course_thumbnail_url: newCourse.course_thumbnail_url || '',
            enrolled_students: [],
            sections: [],
        };

        setCourses((prev) => [...prev, courseWithId]);
        return courseId;
    };

    const updateCourse = (courseId: string, updatedCourse: Course) => {
        setCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.course_id === courseId ? updatedCourse : course,
            ),
        );
    };

    const updateCourseSections = (courseId: string, sections: Section[]) => {
        setCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.course_id === courseId ? {...course, sections} : course,
            ),
        );
    };

    const findCourseById = (courseId: string) => {
        return courses.find((course) => course.course_id === courseId);
    };

    const findCoursesByInstructor = (instructorId: string) => {
        return courses.filter(
            (course) => course.instructor_id === instructorId,
        );
    };

    return (
        <CourseContext.Provider
            value={{
                courses,
                updateCourse,
                addCourse,
                findCourseById,
                findCoursesByInstructor,
                updateCourseSections,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
};

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourses must be used within CourseProvider');
    }
    return context;
};
