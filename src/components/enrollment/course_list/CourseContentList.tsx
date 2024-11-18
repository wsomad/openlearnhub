import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { Course } from '../../../types/Course';
import { Lesson } from '../../../types/Lesson';
import { UserProfile } from '../../../types/Profile';
import { Section } from '../../../types/Section';
import AddSectionModal from '../../modal/AddSectionModal';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import CourseContentView from './CourseContentView';

interface CourseContentListProps {
    userType: 'student' | 'instructor';
    courseId: string;
    userId: string;
}

const CourseContentList: React.FC<CourseContentListProps> = ({
    userType,
    courseId,
    userId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [courseSections, setCourseSections] = useState<Section[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);
    const [sectionToDelete, setSectionToDelete] = useState<Section | null>(
        null,
    );
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/dummyData.json');
                const data = await response.json();

                const course = data.courses.find(
                    (c: Course) => c.course_id === courseId,
                );
                if (!course) throw new Error('Course not found');

                const profile = data.users.find(
                    (u: UserProfile) => u.uid === userId,
                );
                if (!profile) throw new Error('User not found');

                setCourseData(course);
                setCourseSections(course.sections);
                setUserProfile(profile);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load course data',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [courseId, userId]);

    const canEditCourse = (): boolean => {
        if (!courseData || !userProfile) return false;
        console.log('User Type:', userType);
        console.log('Instructor ID:', courseData.instructor_id);
        console.log('User Profile ID:', userProfile.uid);

        return (
            userType === 'instructor' &&
            courseData.instructor_id === userProfile.uid
        );
    };

    const openAddContentModal = (): void => {
        if (canEditCourse()) {
            setIsModalOpen(true);
        }
    };

    const closeModal = (): void => setIsModalOpen(false);
    const closeConfirmModal = (): void => {
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    const handleAddSection = async (
        newSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        const sectionWithId: Section = {
            section_id: `s${courseSections.length + 1}`,
            ...newSection,
            course_id: courseId,
            section_order: courseSections.length + 1,
            lessons: [],
            quizzes: [],
        };

        setCourseSections([...courseSections, sectionWithId]);
        closeModal();
    };

    const handleDeleteSection = (sectionId: string): void => {
        if (!canEditCourse()) return;

        const section = courseSections.find(
            (section) => section.section_id === sectionId,
        );
        if (section) {
            setIsConfirmModalOpen(true);
            setSectionToDelete(section);
        }
    };

    const confirmDeleteSection = (): void => {
        if (sectionToDelete && canEditCourse()) {
            const filteredSections = courseSections.filter(
                (section) => section.section_id !== sectionToDelete.section_id,
            );
            setCourseSections(filteredSections);
            closeConfirmModal();
        }
    };

    const handleEditSectionTitle = (
        sectionId: string,
        newTitle: string,
    ): void => {
        if (!canEditCourse()) return;

        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.section_id === sectionId
                    ? {...section, section_title: newTitle}
                    : section,
            ),
        );
    };

    const handleAddLesson = (
        sectionId: string,
        newLesson: Omit<Lesson, 'lesson_id'>,
    ): void => {
        if (!canEditCourse()) return;

        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.section_id === sectionId
                    ? {
                          ...section,
                          lessons: [
                              ...section.lessons,
                              {
                                  ...newLesson,
                                  lesson_id: `l${section.lessons.length + 1}`,
                                  section_id: sectionId,
                              },
                          ],
                      }
                    : section,
            ),
        );
    };

    const handleEditLesson = (
        sectionId: string,
        lessonId: string,
        updatedLesson: Partial<Lesson>,
    ): void => {
        if (!canEditCourse()) return;

        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.section_id === sectionId
                    ? {
                          ...section,
                          lessons: section.lessons.map((lesson) =>
                              lesson.lesson_id === lessonId
                                  ? {...lesson, ...updatedLesson}
                                  : lesson,
                          ),
                      }
                    : section,
            ),
        );
    };

    const handleDeleteLesson = (sectionId: string, lessonId: string): void => {
        if (!canEditCourse()) return;

        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.section_id === sectionId
                    ? {
                          ...section,
                          lessons: section.lessons.filter(
                              (lesson) => lesson.lesson_id !== lessonId,
                          ),
                      }
                    : section,
            ),
        );
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!courseData || !userProfile) return <div>No course data available</div>;

    return (
        <div
            className={`font-abhaya p-4 bg-white border border-gray overflow-y-auto ${
                userType === 'student'
                    ? 'w-[500px] max-h-[600px]'
                    : 'w-[1175px] h-[450px]'
            }`}
        >
            <div className='mb-2 font-bold text-xl flex justify-between items-center'>
                <span>Course Content</span>
                {canEditCourse() && (
                    <button
                        className='bg-secondary text-white px-3 py-2 rounded-2xl flex items-center mr-4'
                        onClick={openAddContentModal}
                    >
                        <span className='text-lg mt-0.5'>New Section</span>
                        <FaPlus className='ml-2 h-4 w-4' />
                    </button>
                )}
            </div>
            <div className='-mx-4'>
                <hr className='border-t border-gray' />
            </div>

            <CourseContentView
                userType={userType}
                courseSections={courseSections}
                setCourseSections={setCourseSections}
                onDeleteSection={handleDeleteSection}
                onEditSectionTitle={handleEditSectionTitle}
                canEdit={canEditCourse()}
                onAddLesson={handleAddLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
            />

            {isModalOpen && (
                <AddSectionModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleAddSection}
                />
            )}

            {isConfirmModalOpen && sectionToDelete && (
                <ConfirmDeleteModal
                    isOpen={isConfirmModalOpen}
                    onClose={closeConfirmModal}
                    onConfirm={confirmDeleteSection}
                    itemTitle={sectionToDelete.section_title}
                    isSection={true}
                />
            )}
        </div>
    );
};

export default CourseContentList;
