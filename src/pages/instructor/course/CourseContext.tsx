import React, { createContext, useContext, useEffect, useState } from 'react';

import { Course } from '../../../types/course';
import { Section } from '../../../types/section';

interface CourseContextType {
    courses: Course[];
    updateCourse: (courseId: string, updatedCourse: Course) => void;
    addCourse: (newCourse: Partial<Course>) => string;
    findCourseById: (courseId: string) => Course | undefined;
    updateCourseSections: (courseId: string, sections: Section[]) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{children: React.ReactNode}> = ({
    children,
}) => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const loadCourses = async () => {
            const response = await fetch('/dummyData.json');
            const data = await response.json();
            setCourses(data.courses);
        };
        loadCourses();
    }, []);

    const addCourse = (newCourse: Partial<Course>) => {
        const courseId = `course-${Date.now()}`;
        const courseWithId: Course = {
            course_id: courseId,
            instructor_id: 'u3',
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
            course_instructor: 'Test Instructor',
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
                course.course_id === courseId
                    ? {...course, sections: sections}
                    : course,
            ),
        );
    };

    const findCourseById = (courseId: string) => {
        return courses.find((course) => course.course_id === courseId);
    };

    return (
        <CourseContext.Provider
            value={{
                courses,
                updateCourse,
                addCourse,
                findCourseById,
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
