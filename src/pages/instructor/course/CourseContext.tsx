import React, { createContext, useContext, useEffect, useState } from 'react';

import { Course } from '../../../types/course';
import { Section } from '../../../types/section';
import { User } from '../../../types/user';

interface CourseContextType {
    courses: Course[];
    users: User[];
    instructorCourses: Course[];
    setInstructorCourses: React.Dispatch<React.SetStateAction<Course[]>>;
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
    const [users, setUsers] = useState<User[]>([]);
    const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/dummyData.json');
                const data = await response.json();
                setCourses(data.courses);
                setUsers(data.users);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

    const addCourse = (
        newCourse: Partial<Course>,
        instructorId: string,
    ): string => {
        console.log('Instructor ID passed for adding course:', instructorId);

        const newCourseId = (
            Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 5 + 1)) + 5
        ).toString();
        console.log('New course ID created:', newCourseId);
        const fullCourse: Course = {
            ...newCourse,
            course_id: newCourseId,
            uid: instructorId,
        } as Course;

        // Log the details of the course being added.
        console.log('Adding course:', fullCourse);

        // Update the overall courses state
        setCourses((prevCourses) => [...prevCourses, fullCourse]);

        // Update the instructor's courses state
        setInstructorCourses((prevInstructorCourses) => [
            ...prevInstructorCourses,
            fullCourse,
        ]);

        return newCourseId;
    };

    const updateCourse = (courseId: string, updatedCourse: Course) => {
        setCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.course_id === courseId ? updatedCourse : course,
            ),
        );
        setInstructorCourses((prevInstructorCourses) =>
            prevInstructorCourses.map((course) =>
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

    const findCoursesByInstructor = (instructorUid: string) => {
        return courses.filter((course) => course.uid === instructorUid);
    };

    return (
        <CourseContext.Provider
            value={{
                courses,
                users,
                instructorCourses,
                setInstructorCourses,
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
