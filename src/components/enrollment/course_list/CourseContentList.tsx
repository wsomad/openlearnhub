import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useCourses } from '../../../pages/instructor/course/CourseContext';
import { Course } from '../../../types/course';
import {
	DocumentLesson,
	LessonBase,
	QuizLesson,
	VideoLesson,
} from '../../../types/lesson';
import { Section } from '../../../types/section';
import { User } from '../../../types/user';
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
    const {findCourseById, updateCourseSections} = useCourses();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [courseSections, setCourseSections] = useState<Section[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);
    const [sectionToDelete, setSectionToDelete] = useState<Section | null>(
        null,
    );
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const course = findCourseById(courseId);

                if (!course) {
                    setError('Course not found');
                    setIsLoading(false);
                    return;
                }

                // Get user data from dummyData.json
                const response = await fetch('/dummyData.json');
                const data = await response.json();
                const userProfile = data.users.find(
                    (u: User) => u.uid === userId,
                );

                if (!userProfile) {
                    setError('User not found');
                    setIsLoading(false);
                    return;
                }

                setCourseData(course);
                setCourseSections(course.sections || []);
                setUserProfile(userProfile);
                setIsLoading(false);
            } catch (error) {
                console.error('Error details:', error);
                setError('Failed to load course data');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [courseId, userId, findCourseById]);

    const canEditCourse = (): boolean => {
        if (!courseData || !userProfile) return false;
        return userType === 'instructor' && courseData.uid === userProfile.uid;
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
        newSection: Omit<Section, 'section_id' | 'lessons'>,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        const sectionWithId: Section = {
            section_id: `s${courseSections.length + 1}`,
            ...newSection,
            course_id: courseId,
            section_order: courseSections.length + 1,
            lessons: [],
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
        newLesson: Omit<
            DocumentLesson | VideoLesson | QuizLesson,
            'lesson_id' | 'section_id' | 'lesson_order'
        >,
    ): void => {
        if (!canEditCourse()) return;

        setCourseSections((prevSections: Section[]) => {
            return prevSections.map((section) => {
                if (section.section_id === sectionId) {
                    let lessonWithIds: LessonBase;

                    switch (newLesson.lesson_type) {
                        case 'document':
                            lessonWithIds = {
                                ...newLesson,
                                lesson_id: `l${section.lessons.length + 1}`,
                                section_id: sectionId,
                                lesson_order: section.lessons.length + 1,
                                lesson_type: 'document',
                                document_url: (newLesson as DocumentLesson)
                                    .document_url,
                            } as DocumentLesson;
                            break;
                        case 'video':
                            lessonWithIds = {
                                ...newLesson,
                                lesson_id: `l${section.lessons.length + 1}`,
                                section_id: sectionId,
                                lesson_order: section.lessons.length + 1,
                                lesson_type: 'video',
                                video_url: (newLesson as VideoLesson).video_url,
                                video_duration: (newLesson as VideoLesson)
                                    .video_duration,
                            } as VideoLesson;
                            break;
                        case 'quiz':
                            lessonWithIds = {
                                ...newLesson,
                                lesson_id: `l${section.lessons.length + 1}`,
                                section_id: sectionId,
                                lesson_order: section.lessons.length + 1,
                                lesson_type: 'quiz',
                                quiz: (newLesson as QuizLesson).quiz,
                            } as QuizLesson;
                            break;
                        default:
                            throw new Error('Invalid lesson type');
                    }

                    return {
                        ...section,
                        lessons: [...section.lessons, lessonWithIds],
                    };
                }
                return section;
            });
        });
    };

    const handleEditLesson = (
        sectionId: string,
        lessonId: string,
        updatedLesson: Partial<DocumentLesson | VideoLesson | QuizLesson>,
    ): void => {
        if (!canEditCourse()) return;

        setCourseSections((prevSections: Section[]) => {
            return prevSections.map((section) => {
                if (section.section_id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map((lesson) => {
                            if (lesson.lesson_id === lessonId) {
                                if (
                                    updatedLesson.lesson_type &&
                                    updatedLesson.lesson_type !==
                                        lesson.lesson_type
                                ) {
                                    // Handle type change
                                    switch (updatedLesson.lesson_type) {
                                        case 'document':
                                            return {
                                                ...lesson,
                                                ...updatedLesson,
                                                lesson_type: 'document',
                                                document_url:
                                                    (
                                                        updatedLesson as Partial<DocumentLesson>
                                                    ).document_url || '',
                                            } as DocumentLesson;
                                        case 'video':
                                            return {
                                                ...lesson,
                                                ...updatedLesson,
                                                lesson_type: 'video',
                                                video_url:
                                                    (
                                                        updatedLesson as Partial<VideoLesson>
                                                    ).video_url || '',
                                                video_duration:
                                                    (
                                                        updatedLesson as Partial<VideoLesson>
                                                    ).video_duration || 0,
                                            } as VideoLesson;
                                        case 'quiz':
                                            return {
                                                ...lesson,
                                                ...updatedLesson,
                                                lesson_type: 'quiz',
                                                quiz: (
                                                    updatedLesson as Partial<QuizLesson>
                                                ).quiz || {
                                                    quiz_id: '',
                                                    quiz_title: '',
                                                    quiz_number_of_questions: 0,
                                                    questions: [],
                                                },
                                            } as QuizLesson;
                                        default:
                                            return lesson;
                                    }
                                } else {
                                    // Same type, just update fields
                                    return {
                                        ...lesson,
                                        ...updatedLesson,
                                    } as LessonBase;
                                }
                            }
                            return lesson;
                        }),
                    };
                }
                return section;
            });
        });
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

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-[400px]'>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-[400px] text-red-500'>
                Error: {error}
            </div>
        );
    }

    if (!courseData || !userProfile) {
        return (
            <div className='flex justify-center items-center min-h-[400px]'>
                No course data available
            </div>
        );
    }

    return (
        <div className='w-full bg-white shadow-sm rounded-lg'>
            <div className='p-6 border-b'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold'>Course Content</h2>
                    {canEditCourse() && (
                        <button
                            className='bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-secondary-dark transition-colors'
                            onClick={openAddContentModal}
                        >
                            <span>New Section</span>
                            <FaPlus className='w-4 h-4' />
                        </button>
                    )}
                </div>
            </div>

            <div className='p-6'>
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
        </div>
    );
};

export default CourseContentList;
