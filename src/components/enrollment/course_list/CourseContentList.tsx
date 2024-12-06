import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { clearSingleSection } from '../../../store/slices/sectionSlice';
import { LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';
import AddSectionModal from '../../modal/AddSectionModal';
// import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import CourseContentView from './CourseContentView';

interface CourseContentListProps {
    course_id: string;
<<<<<<< HEAD
    sectionsOrder: Section[];
    setSectionsOrder: React.Dispatch<React.SetStateAction<Section[]>>;
    onLessonSelect?: (lesson: LessonBase) => void;
    onSaveOrder: () => void;
    selectedLessonId?: string;
=======
    sectionsOrder?: Section[];
    setSectionsOrder?: React.Dispatch<React.SetStateAction<Section[]>>;
    onSaveOrder?: () => void;
>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba
}

const CourseContentList: React.FC<CourseContentListProps> = ({
    course_id,
    sectionsOrder,
    setSectionsOrder,
    onLessonSelect,
    onSaveOrder,
    selectedLessonId,
}) => {
    const {selectedCourse} = useCourses();
    const {
        allSections,
        selectedSection,
        createSections,
        updateSection,
        deleteSection,
<<<<<<< HEAD
        fetchAllSections,
=======
        deleteSingleSection,
>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba
    } = useSections();
    const {createLessons, fetchAllLessons, updateLesson, deleteLesson} =
        useLessons();
    const {currentUser, userRole} = useUser();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);

    // Initialize local state management for section.
    const [sectionData, setSectionData] = useState<Section[]>([
        {
            section_id: '',
            course_id: '',
            lessons: [],
            section_order: 0,
            section_title: '',
        },
    ]);

    // Run this side effect to set local state management with existing `allSections`.
    useEffect(() => {
        if (allSections) {
            const sortedSections = [...allSections].sort(
                (a, b) => a.section_order - b.section_order,
            );
            setSectionData(sortedSections);
        }
    }, [allSections]);

    // Edit function based on role and uid.
    const canEditCourse = (): boolean => {
        if (!userRole || !currentUser?.uid) return false;
        return userRole === 'instructor';
    };

    // Open modal function for modal of content to add section and lesson.
    const openCreateSectionModal = (): void => {
        if (canEditCourse()) {
            setIsModalOpen(true);
        }
    };

    // Close modal function for modal of content.
    const closeSectionModal = (): void => setIsModalOpen(false);

    // Close confirmation function to close modal of content.
<<<<<<< HEAD
    // const closeConfirmModal = (): void => {
    //     setIsConfirmModalOpen(false);
    //     clearSingleSection();
    // };
=======
    const closeConfirmModal = (): void => {
        setIsConfirmModalOpen(false);
        deleteSingleSection()
    };
>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba

    // Handle add function to add section.
    const handleAddSection = async (
        newSection: Omit<Section, 'section_id' | 'lessons'>,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        try {
            const section: Section = {
                ...newSection,
                section_id: newSection.section_title || '',
                section_order: newSection.section_order,
                lessons: [],
            };

            // For new courses, we'll just update the local state
            if (!course_id) {
                setSectionsOrder((prev) =>
                    [...prev, section].sort(
                        (a, b) =>
                            (a.section_order || 0) - (b.section_order || 0),
                    ),
                );
            } else {
                // For existing courses, update Firebase
                await createSections(course_id, section);
                await fetchAllSections(course_id);
            }

            closeSectionModal();
            console.log('Section created successfully.');
        } catch (error) {
            console.error('Failed to create this section:', error);
        }
    };

    // Handle delete function to delete section.
    const handleDeleteSection = async (section_id: string) => {
        if (!course_id) return;

        try {
            await deleteSection(course_id, section_id);
        } catch (error) {
            console.error('Failed to delete section:', error);
        }
    };

    // Delete confirmation function to delete section.
    // const confirmDeleteSection = (section_id: string): void => {
    //     if (selectedSection && canEditCourse()) {
    //         if (!selectedCourse?.course_id || !selectedSection?.section_id) {
    //             return;
    //         }

    //         const checkSection = selectedSection?.section_id === section_id;

    //         if (checkSection) {
    //             setIsConfirmModalOpen(true);
    //             deleteSection(
    //                 selectedCourse.course_id,
    //                 selectedSection.section_id,
    //             );
    //         }

    //         closeConfirmModal();
    //     }
    // };

    // Handle edit function to edit section title.
    const handleEditSectionTitle = async (
        section_id: string,
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => {
        if (!course_id) return;

        try {
            await updateSection(course_id, section_id, {
                ...updatedSection,
                section_id: section_id,
            });
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    // Handle add function to add lesson.
    const handleAddLesson = async (
        section_id: string,
        lesson: LessonBase,
    ): Promise<void> => {
        if (!course_id) {
            console.error('Cannot add lesson: No course ID');
            return;
        }

        try {
            await createLessons(course_id, section_id, lesson);
            console.log('Lesson added successfully:', lesson);
        } catch (error) {
            console.error('Failed to add lesson:', error);
            throw error;
        }
    };

    //     lesson_id: string,
    //     updated_lesson: Partial<LessonBase>,
    // ): void => {
    //     if (!canEditCourse()) return;

    //     // setCourseSections((prevSections) =>
    //     //     prevSections.map((section) =>
    //     //         section.section_id === sectionId
    //     //             ? {
    //     //                   ...section,
    //     //                   lessons: section.lessons.map((lesson) =>
    //     //                       lesson.lesson_id === lessonId
    //     //                           ? {...lesson, ...updatedLesson}
    //     //                           : lesson,
    //     //                   ),
    //     //               }
    //     //             : section,
    //     //     ),
    //     // );
    // };
    const handleEditLesson = async (
        section_id: string,
        lesson: LessonBase,
    ): Promise<void> => {
        if (!course_id) return;

        try {
            await updateLesson(course_id, section_id, lesson);
        } catch (error) {
            console.error('Failed to edit lesson:', error);
            throw error;
        }
    };

    const handleDeleteLesson = async (
        section_id: string,
        lesson_id: string,
    ): Promise<void> => {
        if (!course_id) return;

        try {
            await deleteLesson(course_id, section_id, lesson_id);
        } catch (error) {
            console.error('Failed to delete lesson:', error);
            throw error;
        }
    };

    return (
        <div className='w-full bg-white shadow-sm rounded-lg'>
            <div className='p-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold'>Course Content</h2>
                    {canEditCourse() && (
                        <button
                            type='button'
                            className='bg-primary text-white px-4 py-2 flex items-center space-x-2 hover:bg-secondary-dark transition-colors'
                            onClick={openCreateSectionModal}
                        >
                            <FaPlus className='w-3 h-3' />
                            <span>New Section</span>
                        </button>
                    )}
                </div>
                <hr className='mt-6'></hr>
            </div>

            <div className='p-6'>
                <CourseContentView
                    course_id={course_id || ''}
                    canEdit={canEditCourse()}
                    sectionsOrder={sectionsOrder || []}
                    setSectionsOrder={setSectionsOrder || (() => {})}
                    onSaveOrder={onSaveOrder || (() => {})}
                    onDeleteSection={handleDeleteSection}
                    onEditSectionTitle={handleEditSectionTitle}
                    onAddLesson={handleAddLesson}
                    onEditLesson={handleEditLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onLessonSelect={onLessonSelect}
                />

                {isModalOpen && (
                    <AddSectionModal
                        isOpen={isModalOpen}
                        onClose={closeSectionModal}
                        onSubmit={handleAddSection}
                    />
                )}

                {/* {isConfirmModalOpen && selectedSection && (
                    <ConfirmDeleteModal
                        isOpen={isConfirmModalOpen}
                        onClose={closeConfirmModal}
                        onConfirm={confirmDeleteSection}
                        itemTitle={selectedSection.section_title || ''}
                        isSection={true}
                    />
                )} */}
            </div>
        </div>
    );
};

export default CourseContentList;
