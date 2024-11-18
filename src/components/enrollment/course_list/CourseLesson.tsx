import { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { MdDeleteOutline, MdEditNote } from 'react-icons/md';

import { Lesson } from '../../../types/Lesson';
import { Section } from '../../../types/section';
import {
	BaseLessonHandlers,
	BaseSectionHandlers,
	EditableProps,
} from '../../../types/Shared';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import EditSectionModal from '../../modal/EditSectionModal';
import ModalComponent from '../../modal/ModalComponent';

interface CourseLessonProps
    extends EditableProps,
        BaseLessonHandlers,
        BaseSectionHandlers {
    section: Section;
    index: number;
    lessonCount: number;
    totalDuration: number;
}

const CourseLesson: React.FC<CourseLessonProps> = ({
    section,
    index,
    lessonCount,
    totalDuration,
    userType,
    canEdit,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
    const [isEditTitleModalOpen, setIsEditTitleModalOpen] =
        useState<boolean>(false);

    const toggleSection = (
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        isEditButton: boolean = false,
    ): void => {
        if (!isEditButton && userType === 'instructor' && !canEdit) return;

        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const openModal = (lesson: Lesson): void => {
        if (!canEdit) return;
        setSelectedLesson(lesson);
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openAddModal = (e: React.MouseEvent): void => {
        if (!canEdit) return;
        e.stopPropagation();
        setSelectedLesson(null);
        setModalType('add');
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        setSelectedLesson(null);
    };

    const handleModalSubmit = (lessonData: Partial<Lesson>): void => {
        if (!canEdit) return;

        if (modalType === 'edit' && selectedLesson) {
            onEditLesson(
                section.section_id,
                selectedLesson.lesson_id,
                lessonData,
            );
        } else if (modalType === 'add') {
            const newLesson: Omit<Lesson, 'lesson_id'> = {
                lesson_title: lessonData.lesson_title || '',
                lesson_content: lessonData.lesson_content || '',
                lesson_duration: lessonData.lesson_duration || 0,
                section_id: section.section_id,
                lesson_videoUrl: lessonData.lesson_videoUrl,
                lesson_documentUrl: lessonData.lesson_documentUrl,
            };
            onAddLesson(section.section_id, newLesson);
        }
        closeModal();
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
                onClick={(e) => userType === 'student' && toggleSection(e)}
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

                {canEdit && userType === 'instructor' && (
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
                            onClick={(e) => toggleSection(e, true)}
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

                {userType === 'student' && (
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
                    {section.lessons.map((lesson, lessonIndex) => (
                        <div
                            key={lesson.lesson_id}
                            className='cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 rounded-md'
                        >
                            <div className='relative flex items-start'>
                                <div className='border-secondary text-secondary absolute text-2xl w-10 h-10 rounded-full border-4 bg-white flex items-center justify-center mr-4 ml-8 mt-1'>
                                    {lessonIndex + 1}
                                </div>
                                <div className='flex flex-col text-md pl-16 ml-8'>
                                    <span className='font-bold'>
                                        {lesson.lesson_title}
                                    </span>
                                    <span className='text-gray-500'>
                                        {lesson.lesson_duration} mins
                                    </span>
                                </div>
                                {canEdit && userType === 'instructor' && (
                                    <div className='ml-auto flex space-x-2 mr-2.5 mt-3'>
                                        <button
                                            onClick={() => openModal(lesson)}
                                            className='bg-edit text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-edit-dark transition-all duration-300'
                                            aria-label={`Edit lesson: ${lesson.lesson_title}`}
                                        >
                                            <MdEditNote className='text-lg' />
                                        </button>
                                        <button
                                            onClick={(e) =>
                                                openDeleteModal(
                                                    lesson.lesson_id,
                                                    e,
                                                )
                                            }
                                            className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-delete-dark transition-all duration-300'
                                            aria-label={`Delete lesson: ${lesson.lesson_title}`}
                                        >
                                            <MdDeleteOutline className='text-lg' />
                                        </button>
                                    </div>
                                )}
                            </div>
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
