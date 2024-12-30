import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';
import DeleteModal from '../../modal/DeleteModal';
import LessonModal from '../../modal/LessonModal';
import SectionModal from '../../modal/SectionModal';

interface LessonProps {
    section: Section;
    isDraft?: boolean;
    index: number;
    canEdit: boolean;
    onLessonSelect?: (lesson: LessonBase) => void;
    onEditSectionTitle: (
        section_id: string,
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => void;
    onDeleteSection: (section_id: string) => void;
    onAddLesson: (section_id: string, lesson: LessonBase) => Promise<void>;
    onEditLesson: (section_id: string, lesson: LessonBase) => Promise<void>;
    onDeleteLesson: (section_id: string, lesson_id: string) => Promise<void>;
}

const Lesson: React.FC<LessonProps> = ({
    section,
    isDraft,
    index,
    canEdit,
    onLessonSelect,
    onEditSectionTitle,
    onDeleteSection,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const {selectedCourse} = useCourses();
    const {userRole} = useUser();
    const isInstructor = userRole === 'instructor';
    const canEditContent = canEdit && isInstructor;
    const {
        fetchAllLessons,
        selectedLesson,
        fetchLessonsForSection,
        setSelectedLesson,
        clearSelectedLesson,
    } = useLessons();
    const {deleteSection, setSelectedSection, deleteSelectedSection} =
        useSections();

    // State for managing UI elements visibility and modal states
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
    const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState<LessonBase | null>(
        null,
    );

    const [lessons, setLessons] = useState<LessonBase[]>([]);
    useEffect(() => {
        const loadLessons = async () => {
            if (section.section_id && selectedCourse?.course_id) {
                try {
                    const sectionLessons = await fetchLessonsForSection(
                        section.section_id,
                        selectedCourse.course_id,
                    );
                    // Ensure we initialize with an empty array if no lessons
                    setLessons(sectionLessons || []);
                } catch (error) {
                    console.error('Error loading lessons:', error);
                    setLessons([]); // Initialize with empty array on error
                }
            } else {
                setLessons([]); // Initialize with empty array if no section/course
            }
        };
        loadLessons();
    }, [section.section_id, selectedCourse?.course_id]);

    // Update selected section when expanded state changes
    useEffect(() => {
        if (isExpanded && section.section_id) {
            setSelectedSection(section);
        }
    }, [isExpanded, section.section_id]);

    // Toggles section expansion and sets the selected section
    const toggleSectionVisibility = () => {
        setIsExpanded(!isExpanded);
        setSelectedSection(section);
    };

    const confirmSectionDeletion = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            await onDeleteSection(section.section_id);

            // Add local state update
            if (isDraft) {
                setIsExpanded(false);
                deleteSelectedSection();
            }

            setIsDeleteSectionModalOpen(false);
        } catch (error) {
            console.error('Failed to delete section:', error);
        }
    };

    // Opens add lesson modal with event prevention
    const openAddLessonModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAddLessonOpen(true);
    };

    // Cleanup and refresh data after closing lesson modal
    const closeAddLessonModal = async () => {
        setIsAddLessonOpen(false);
        deleteSelectedSection();
        clearSelectedLesson();
        // await fetchSectionLessonsData();
    };

    // Opens lesson edit modal and sets the selected lesson
    const openEditLessonModal = (lesson: LessonBase) => {
        // When opening edit modal for a draft lesson, maintain the draft ID
        const lessonToEdit = isDraft
            ? {
                  ...lesson,
                  lesson_id: lesson.lesson_id, // Keep the existing draft ID
              }
            : lesson;

        setSelectedLesson(lessonToEdit);
        setIsAddLessonOpen(true);
    };

    const handleUpdateSection = (
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => {
        const sectionUpdate = {
            ...updatedSection,
            section_id: section.section_id,
            course_id: selectedCourse?.course_id || section.course_id,
            section_order: section.section_order,
        };

        console.log('Updating section with:', sectionUpdate);
        onEditSectionTitle(section.section_id, sectionUpdate);
        setIsEditSectionOpen(false);
    };

    // Opening the DeleteModal for deleting a lesson.
    const openDeleteLessonModal = (lesson: LessonBase, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLessonToDelete(lesson);
        setIsDeleteModalOpen(true);
    };

    const handleAddLesson = async (section_id: string, lesson: LessonBase) => {
        let newLesson: LessonBase;
        try {
            const uniqueId = `temp-${section_id}-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`;

            // Initialize lessons array if undefined
            const currentLessons = lessons || [];

            // Get the next order number
            const nextOrder =
                Math.max(0, ...currentLessons.map((l) => l.lesson_order || 0)) +
                1;

            newLesson = {
                ...lesson,
                lesson_id: lesson.lesson_id || uniqueId,
                section_id: section_id,
                lesson_order: nextOrder,
            };

            // Update local state
            setLessons((prev) => [...(prev || []), newLesson]);

            // Propagate to parent
            await onAddLesson(section_id, newLesson);
            setIsAddLessonOpen(false);
        } catch (error) {
            console.error('Failed to add lesson:', error);
            // Rollback on error
            setLessons((prev) =>
                prev.filter((l) => l.lesson_id !== newLesson.lesson_id),
            );
        }
    };

    const handleEditLesson = async (section_id: string, lesson: LessonBase) => {
        try {
            const updatedLesson = {
                ...lesson,
                lesson_id: selectedLesson?.lesson_id || lesson.lesson_id,
                section_id: section_id,
            };

            setLessons((prev) => {
                const updated = prev.map((l) =>
                    l.lesson_id === updatedLesson.lesson_id ? updatedLesson : l,
                );
                // Ensure proper ordering is maintained
                return updated
                    .sort((a, b) => a.lesson_order - b.lesson_order)
                    .map((lesson, idx) => ({
                        ...lesson,
                        lesson_order: idx + 1,
                    }));
            });

            await onEditLesson(section_id, updatedLesson);
            setIsAddLessonOpen(false);
        } catch (error) {
            console.error('Failed to edit lesson:', error);
        }
    };

    const handleDeleteLesson = async (
        section_id: string,
        lesson_id: string,
    ) => {
        try {
            await onDeleteLesson(section_id, lesson_id);

            setLessons((prev) => {
                // Remove the deleted lesson and reorder remaining ones
                const remaining = prev.filter((l) => l.lesson_id !== lesson_id);
                return remaining.map((lesson, idx) => ({
                    ...lesson,
                    lesson_order: idx + 1,
                }));
            });

            setIsDeleteModalOpen(false);
            setLessonToDelete(null);
        } catch (error) {
            console.error('Failed to delete lesson:', error);
        }
    };

    return (
        <div
            className='mb-6 ml-4'
            data-testid={`section-${section.section_id}`}
        >
            <div className='bg-gray-100 p-4 shadow-sm'>
                <div className='flex justify-between items-center'>
                    <div
                        onClick={toggleSectionVisibility}
                        className='cursor-pointer flex-1 flex items-center gap-3'
                    >
                        <div className='flex items-center justify-center w-7 h-7 text-gray-600 hover:text-gray-800'>
                            {isExpanded ? (
                                <ChevronDown className='w-5 h-5' />
                            ) : (
                                <ChevronRight className='w-5 h-5' />
                            )}
                        </div>
                        <div>
                            <h3
                                className='text-lg font-semibold'
                                data-testid={`section-title-${section.section_id}`}
                            >
                                {index}. {section.section_title}
                            </h3>
                            <p className='text-sm text-gray-600'>
                                {lessons.length} lessons
                            </p>
                        </div>
                    </div>
                    {canEditContent && (
                        <div className='flex gap-2'>
                            <button
                                type='button'
                                onClick={() => setIsEditSectionOpen(true)}
                                className='bg-gray text-white p-2 rounded-md hover:bg-gray-600 transition-colors'
                            >
                                <Pencil className='w-5 h-5' />
                            </button>
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDeleteSectionModalOpen(true);
                                }}
                                className='bg-delete text-white p-2 rounded-md hover:bg-red-500 transition-colors'
                            >
                                <Trash2 className='w-5 h-5' />
                            </button>
                            <button
                                type='button'
                                onClick={openAddLessonModal}
                                className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
                                data-testid='add-lesson-button'
                                aria-label='Add Lesson'
                            >
                                <FaPlus className='w-3 h-3' />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className='bg-gray-50 shadow-sm'>
                    {lessons.length > 0 ? (
                        lessons.map((lesson, idx) => {
                            // Generate a consistent and unique key for each lesson
                            const lessonKey = lesson.lesson_id
                                ? lesson.lesson_id
                                : `temp-${section.section_id}-${idx}-${lesson.lesson_title}`;

                            return (
                                <div
                                    key={lessonKey}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canEdit) {
                                            onLessonSelect?.(lesson);
                                        }
                                    }}
                                    className={`p-4 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center transition-colors ${
                                        !canEdit ? 'cursor-pointer' : ''
                                    }`}
                                >
                                    <div className='flex-1 ml-10'>
                                        <p className='font-medium'>
                                            {idx + 1}. {lesson.lesson_title}
                                        </p>
                                        <p className='text-sm text-gray-600 capitalize'>
                                            {lesson.lesson_type}
                                        </p>
                                    </div>
                                    {canEdit && (
                                        <div
                                            className='flex gap-2'
                                            onClick={(e) => e.stopPropagation()} // Prevent lesson selection when clicking buttons
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditLessonModal(lesson);
                                                }}
                                                className='p-2 text-gray-600 hover:text-primary rounded-lg transition-colors'
                                                title='Edit lesson'
                                            >
                                                <Pencil className='w-5 h-5' />
                                            </button>
                                            <button
                                                type='button'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteLessonModal(
                                                        lesson,
                                                        e,
                                                    );
                                                }}
                                                className='p-2 text-gray-600 hover:text-red-500 rounded-lg transition-colors'
                                                title='Delete lesson'
                                            >
                                                <Trash2 className='w-5 h-5' />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className='p-4 text-center text-gray-500'>
                            No lessons available in this section
                        </div>
                    )}
                </div>
            )}

            {isAddLessonOpen && (
                <LessonModal
                    sectionId={section.section_id}
                    isDraft={isDraft}
                    onClose={closeAddLessonModal}
                    lessonToEdit={selectedLesson ?? undefined}
                    onSubmit={async (lessonData) => {
                        try {
                            if (selectedLesson) {
                                await handleEditLesson(
                                    section.section_id,
                                    lessonData,
                                );
                            } else {
                                await handleAddLesson(
                                    section.section_id,
                                    lessonData,
                                );
                            }
                            closeAddLessonModal();
                        } catch (error) {
                            console.error('Error with lesson:', error);
                        }
                    }}
                />
            )}

            {(isDeleteModalOpen || isDeleteSectionModalOpen) && (
                <DeleteModal
                    isOpen={isDeleteModalOpen || isDeleteSectionModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setIsDeleteSectionModalOpen(false);
                        setLessonToDelete(null); // Reset state for lessons
                    }}
                    onConfirm={
                        lessonToDelete
                            ? (e?: React.MouseEvent) =>
                                  handleDeleteLesson(
                                      section.section_id,
                                      lessonToDelete.lesson_id,
                                  )
                            : confirmSectionDeletion
                    }
                    itemTitle={
                        lessonToDelete
                            ? lessonToDelete.lesson_title
                            : section.section_title
                    }
                    itemType={lessonToDelete ? 'lesson' : 'section'}
                />
            )}

            {isEditSectionOpen && (
                <SectionModal
                    isOpen={isEditSectionOpen}
                    onClose={() => setIsEditSectionOpen(false)}
                    onSubmit={handleUpdateSection}
                    sectionToEdit={section}
                />
            )}
        </div>
    );
};

export default Lesson;
