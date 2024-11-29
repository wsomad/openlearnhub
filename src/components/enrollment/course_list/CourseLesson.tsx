import {useState} from 'react';
import {FaAngleDown, FaAngleRight} from 'react-icons/fa';
import {FaPlus} from 'react-icons/fa6';
import {MdDeleteOutline, MdEditNote} from 'react-icons/md';

import {
    DocumentLesson,
    LessonBase,
    QuizLesson,
    VideoLesson,
} from '../../../types/lesson';
import {Section} from '../../../types/section';
import {
    BaseLessonHandlers,
    BaseSectionHandlers,
    EditableProps,
} from '../../../types/Shared';
import {useCourses} from '../../../hooks/useCourses';
import {useSections} from '../../../hooks/useSections';
import {useLessons} from '../../../hooks/useLessons';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import EditSectionModal from '../../modal/EditSectionModal';
import ModalComponent from '../../modal/ModalComponent';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableLesson from './SortableLesson';
import {useUser} from '../../../hooks/useUser';

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
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
    const [isEditTitleModalOpen, setIsEditTitleModalOpen] =
        useState<boolean>(false);
    const {selectedCourse} = useCourses();
    const {selectedSection} = useSections();
    const {selectedLesson, createLessons} = useLessons();
    const {userRole} = useUser();

    //const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    // const currentState = useSelector((state) => state);
    // console.log('Current State from Selector:', currentState);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            onEditLesson(section.section_id, active.id as string, {
                lesson_order:
                    section?.lessons?.findIndex(
                        (lesson) => lesson.lesson_id === over.id,
                    ) + 1,
            });
        }
    };

    const toggleSection = (
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        isEditButton: boolean = false,
    ): void => {
        if (!isEditButton && userRole === 'instructor' && !canEdit) return;
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const openModal = (lesson: LessonBase): void => {
        if (!canEdit) return;
        createLessons(
            selectedCourse?.course_id || null,
            selectedSection?.section_id || null,
            lesson || null,
        );
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openAddModal = (e: React.MouseEvent): void => {
        if (!canEdit) return;
        e.stopPropagation();
        e.preventDefault();
        createLessons(null, null, null);
        setModalType('add');
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        createLessons(null, null, null);
    };

    interface NewDocumentLesson extends Omit<DocumentLesson, 'lesson_id'> {}
    interface NewVideoLesson extends Omit<VideoLesson, 'lesson_id'> {}
    interface NewQuizLesson extends Omit<QuizLesson, 'lesson_id'> {}

    const handleModalSubmit = (
        lessonData: Partial<DocumentLesson | VideoLesson | QuizLesson>,
    ): void => {
        if (!canEdit) return;
        if (modalType === 'edit' && selectedLesson) {
            onEditLesson(
                section.section_id,
                selectedLesson.lesson_id,
                lessonData,
            );
        } else if (modalType === 'add' && lessonData.lesson_type) {
            const baseLesson = {
                lesson_title: lessonData.lesson_title || '',
                section_id: section.section_id,
                lesson_order: section.lessons.length + 1,
            };

            let newLesson: NewDocumentLesson | NewVideoLesson | NewQuizLesson;

            if (lessonData.lesson_type === 'document') {
                newLesson = {
                    ...baseLesson,
                    lesson_type: 'document',
                    document_url: (lessonData as DocumentLesson).document_url,
                };
            } else if (lessonData.lesson_type === 'video') {
                newLesson = {
                    ...baseLesson,
                    lesson_type: 'video',
                    video_url: (lessonData as VideoLesson).video_url,
                    video_duration: (lessonData as VideoLesson).video_duration,
                };
            } else if (lessonData.lesson_type === 'quiz') {
                newLesson = {
                    ...baseLesson,
                    lesson_type: 'quiz',
                    quiz: (lessonData as QuizLesson).quiz,
                };
            } else {
                throw new Error('Invalid lesson type');
            }
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
                onClick={(e) => userRole === 'student' && toggleSection(e)}
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
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={section.lessons.map(
                                (lesson) => lesson.lesson_id,
                            )}
                            strategy={verticalListSortingStrategy}
                        >
                            {section.lessons.map((lesson, lessonIndex) => (
                                <SortableLesson
                                    key={lesson.lesson_id}
                                    lesson={lesson}
                                    lessonIndex={lessonIndex}
                                    canEdit={canEdit}
                                    onOpenModal={openModal}
                                    onDeleteModal={openDeleteModal}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
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
