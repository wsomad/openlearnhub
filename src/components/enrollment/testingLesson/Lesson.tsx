import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';
import AddSectionModal from '../../modal/AddSectionModal';
import DeleteModal from './DeleteModal';
import LessonModal from './LessonModal';

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
                const sectionLessons = await fetchLessonsForSection(
                    section.section_id,
                    selectedCourse.course_id,
                );
                setLessons(sectionLessons);
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

    // Handles section deletion with event prevention
    // const confirmSectionDeletion = async (e?: React.MouseEvent) => {
    //     if (e) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //     }

    //     onDeleteSection(section.section_id);
    //     setIsDeleteSectionModalOpen(false);
    // };
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

    // Modifying the lesson's data in LessonModal 'edit' mode.
    const handleUpdateSection = (
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => {
        if (isDraft) {
            // For draft mode, pass the existing section ID
            onEditSectionTitle(section.section_id, {
                ...updatedSection,
                course_id: section.course_id, // Maintain course_id if it exists
            });
        } else {
            onEditSectionTitle(section.section_id, updatedSection);
        }
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
        try {
            const newLesson = {
                ...lesson,
                lesson_id: isDraft ? `draft-${Date.now()}` : lesson.lesson_id,
                section_id: section_id,
            };
            await onAddLesson(section_id, newLesson);
            setLessons((prev) => [...prev, newLesson]);
            setIsAddLessonOpen(false); // Close modal after successful add
        } catch (error) {
            console.error('Failed to add lesson:', error);
        }
    };

    const handleEditLesson = async (section_id: string, lesson: LessonBase) => {
        try {
            // Maintain the original lesson ID when editing
            const updatedLesson = {
                ...lesson,
                lesson_id: selectedLesson?.lesson_id || '', // Keep original ID
                section_id: section_id,
            };
            await onEditLesson(section_id, updatedLesson);
            setLessons((prev) =>
                prev.map((l) =>
                    l.lesson_id === selectedLesson?.lesson_id
                        ? updatedLesson
                        : l,
                ),
            );
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

            // Update local state immediately
            setLessons((prev) => prev.filter((l) => l.lesson_id !== lesson_id));
            setIsDeleteModalOpen(false);
            setLessonToDelete(null);

            // If in draft mode, ensure the UI updates even if Firebase operation isn't performed
            if (isDraft) {
                const updatedLessons = lessons.filter(
                    (l) => l.lesson_id !== lesson_id,
                );
                setLessons(updatedLessons);
            }
        } catch (error) {
            console.error('Failed to delete lesson:', error);
        }
    };

    return (
        <div className='mb-6 ml-4'>
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
                            <h3 className='text-lg font-semibold'>
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
                        lessons.map((lesson, idx) => (
                            <div
                                key={lesson.lesson_id}
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
                        ))
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
                <AddSectionModal
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
