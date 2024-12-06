import { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { MdDeleteOutline, MdEditNote } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useUser } from '../../../hooks/useUser';
import { clearSingleLesson } from '../../../store/slices/lessonSlice';
import {
	DocumentLesson,
	LessonBase,
	QuizLesson,
	VideoLesson,
} from '../../../types/lesson';
import { Section } from '../../../types/section';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditSectionModal from './EditSectionModal';
import ModalComponent from './ModalComponent';

interface CourseLessonProps {
    section: Section;
    index: number;
    lessonCount: number;
    totalDuration: number;
    canEdit: boolean;
    onDeleteSection: (sectionId: string) => void;
    onEditSectionTitle: (sectionId: string, newTitle: string) => void;
    onAddLesson: (sectionId: string, lesson: LessonBase) => Promise<void>;
    onEditLesson: (
        sectionId: string,
        lessonId: string,
        updatedLesson: Partial<LessonBase>,
    ) => void;
    onDeleteLesson: (sectionId: string, lessonId: string) => void;
}

const CourseLesson: React.FC<CourseLessonProps> = ({
    section,
    index,
    lessonCount,
    totalDuration,
    canEdit,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
    const [isEditTitleModalOpen, setIsEditTitleModalOpen] =
        useState<boolean>(false);
    const {userRole} = useUser();
    const {selectedCourse} = useCourses();
    const {selectedLesson, createLessons} = useLessons();

    // Ensure section.lessons is initialized as an array
    const lessons = section.lessons || [];

    const toggleSection = (e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        if (userRole === 'instructor' && !canEdit) return;
        setIsOpen(!isOpen);
    };

    const openModal = (lesson: LessonBase): void => {
        if (!canEdit) return;
        setModalType('edit');
        setIsModalOpen(true);
        if (selectedCourse?.course_id) {
            createLessons(selectedCourse.course_id, section.section_id, lesson);
        }
    };

    const openAddModal = (e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        if (!canEdit) return;

        setModalType('add');
        setIsModalOpen(true);
        dispatch(clearSingleLesson());
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        dispatch(clearSingleLesson());
    };

    const handleModalSubmit = async (
        lessonData: Partial<DocumentLesson | VideoLesson | QuizLesson>,
    ): Promise<void> => {
        if (!canEdit || !selectedCourse?.course_id) {
            console.error('Cannot add lesson: No course ID or edit permission');
            return;
        }

        try {
            const newLesson = createLessonFromData(
                lessonData,
                section.section_id,
            );
            await onAddLesson(section.section_id, newLesson);
            console.log('Lesson added successfully');
            setIsOpen(true); // Open the section to show the new lesson
            closeModal();
        } catch (error) {
            console.error('Error adding lesson:', error);
            // Handle the error, e.g., show an error message in the UI
            throw error;
        }
    };

    const createLessonFromData = (
        lessonData: Partial<DocumentLesson | VideoLesson | QuizLesson>,
        sectionId: string,
    ): LessonBase => {
        // Create the base lesson object with required fields
        return {
            lesson_id: lessonData.lesson_title || '',
            lesson_title: lessonData.lesson_title || '',
            section_id: sectionId,
            lesson_order: (section.lessons?.length || 0) + 1,
            lesson_type: lessonData.lesson_type,
            ...(lessonData.lesson_type === 'video' && {
                video_url: (lessonData as VideoLesson).video_url,
                video_duration: (lessonData as VideoLesson).video_duration,
            }),
            ...(lessonData.lesson_type === 'document' && {
                document_url: (lessonData as DocumentLesson).document_url,
            }),
            ...(lessonData.lesson_type === 'quiz' && {
                quiz: (lessonData as QuizLesson).quiz,
            }),
        } as LessonBase;
    };

    const openDeleteModal = (lessonId: string, e: React.MouseEvent): void => {
        if (!canEdit) return;
        e.stopPropagation();
        setLessonToDelete(lessonId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = (): void => {
        setIsDeleteModalOpen(false);
        setLessonToDelete(null);
    };

    const handleDelete = (): void => {
        if (!canEdit || !lessonToDelete) return;
        onDeleteLesson(section.section_id, lessonToDelete);
        closeDeleteModal();
    };

    const openEditTitleModal = (e: React.MouseEvent): void => {
        if (!canEdit) return;
        e.stopPropagation();
        setIsEditTitleModalOpen(true);
    };

    const closeEditTitleModal = (): void => {
        setIsEditTitleModalOpen(false);
    };

    const handleEditSectionTitle = (newTitle: string): void => {
        if (!canEdit) return;
        onEditSectionTitle(section.section_id, newTitle);
        closeEditTitleModal();
    };

    const handleDeleteSection = (e: React.MouseEvent): void => {
        if (!canEdit) return;
        e.stopPropagation();
        onDeleteSection(section.section_id);
    };

    return (
        <div className='mb-1'>
            <div
                onClick={toggleSection}
                className='cursor-pointer py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-start justify-between'
                role='button'
                aria-expanded={isOpen}
            >
                <div className='relative flex items-start'>
                    <div
                        className={`absolute text-2xl w-10 h-10 rounded-full border-4 ${
                            isOpen
                                ? 'bg-secondary border-secondary text-white'
                                : 'border-secondary text-secondary'
                        } flex items-center justify-center mr-4 mt-1`}
                    >
                        {index}
                    </div>
                    <div className='flex flex-col text-md pl-16 mr-2'>
                        <span className='font-bold'>
                            {section.section_title}
                        </span>
                        <span className='text-gray-500'>
                            {lessonCount} lessons | {totalDuration} mins
                        </span>
                    </div>
                </div>

                {canEdit && userRole === 'instructor' && (
                    <div className='ml-auto flex space-x-2 mr-2.5 mt-2'>
                        <button
                            onClick={openAddModal}
                            className='bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center'
                            aria-label='Add new lesson'
                        >
                            <FaPlus />
                        </button>
                        <button
                            onClick={openEditTitleModal}
                            className='bg-edit text-white w-8 h-8 rounded-full flex items-center justify-center'
                            aria-label='Edit section title'
                        >
                            <MdEditNote />
                        </button>
                        <button
                            onClick={handleDeleteSection}
                            className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center'
                            title='Delete Section'
                            aria-label='Delete section'
                        >
                            <MdDeleteOutline />
                        </button>
                        <button
                            onClick={(e) => toggleSection(e)}
                            className='text-gray flex items-center justify-center'
                            aria-label={
                                isOpen ? 'Collapse section' : 'Expand section'
                            }
                        >
                            {isOpen ? (
                                <FaAngleDown className='text-xl' />
                            ) : (
                                <FaAngleRight className='text-xl' />
                            )}
                        </button>
                    </div>
                )}

                {userRole === 'student' && (
                    <div className='ml-auto mt-2'>
                        {isOpen ? (
                            <FaAngleDown className='text-xl text-gray' />
                        ) : (
                            <FaAngleRight className='text-xl text-gray' />
                        )}
                    </div>
                )}
            </div>

            {isOpen && (
                <div
                    className='mt-2 space-y-2'
                    role='region'
                    aria-label='Lesson list'
                >
                    {lessons.map((lesson, lessonIndex) => (
                        <div
                            key={lesson.lesson_id}
                            className='p-3 bg-white rounded-md shadow-md flex items-start justify-between'
                        >
                            <div>
                                <h3 className='font-bold'>
                                    {lesson.lesson_title}
                                </h3>
                                <p className='text-gray-500'>
                                    {lesson.lesson_type}
                                </p>
                            </div>
                            {canEdit && (
                                <div className='flex space-x-2'>
                                    <button
                                        onClick={() => openModal(lesson)}
                                        className='text-blue-600'
                                        aria-label='Edit lesson'
                                    >
                                        <MdEditNote />
                                    </button>
                                    <button
                                        onClick={(e) =>
                                            openDeleteModal(lesson.lesson_id, e)
                                        }
                                        className='text-red-600'
                                        aria-label='Delete lesson'
                                    >
                                        <MdDeleteOutline />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {isModalOpen && (
                <ModalComponent
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleModalSubmit}
                    initialData={selectedLesson}
                />
            )}

            {isDeleteModalOpen && (
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    itemTitle={
                        lessonToDelete
                            ? section.lessons.find(
                                  (l) => l.lesson_id === lessonToDelete,
                              )?.lesson_title || ''
                            : ''
                    }
                    isSection={false}
                />
            )}

            {isEditTitleModalOpen && (
                <EditSectionModal
                    isOpen={isEditTitleModalOpen}
                    onClose={closeEditTitleModal}
                    initialTitle={section.section_title}
                    onSubmit={handleEditSectionTitle}
                />
            )}
        </div>
    );
};

export default CourseLesson;
