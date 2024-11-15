import {useState} from 'react';
import {FaAngleDown, FaAngleRight, FaEdit} from 'react-icons/fa';
import {MdDeleteOutline, MdEditNote} from 'react-icons/md';
import {FaPlus} from 'react-icons/fa6';
import ModalComponent from './modal/ModalComponent';
import ConfirmDeleteModal from './modal/ConfirmDeleteModal';
import EditSectionModal from './modal/EditSectionModal';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const CourseLesson = ({
    section,
    index,
    lessonCount,
    totalDuration,
    userType,
    updateLesson,
    addLesson,
    deleteLesson,
    onDeleteSection,
    onEditSectionTitle,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [modalType, setModalType] = useState('add');
    const [lessonToDelete, setLessonToDelete] = useState(null);
    const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
    const [lessons, setLessons] = useState(section.lessons);

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 5}}),
    );

    const toggleSection = (e, isEditButton = false) => {
        if (userType === 'instructor' && !isEditButton) {
            return;
        }
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const openModal = (lesson) => {
        setSelectedLesson(lesson);
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setSelectedLesson(null);
        setModalType('add');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLesson(null);
    };

    const handleModalSubmit = (newData) => {
        if (modalType === 'edit' && selectedLesson !== null) {
            const lessonIndex = lessons.findIndex(
                (lesson) => lesson.title === selectedLesson.title,
            );
            if (lessonIndex > -1) {
                const updatedLessons = [...lessons];
                updatedLessons[lessonIndex] = newData;
                setLessons(updatedLessons);
                updateLesson(section.id, lessonIndex, newData);
            }
        } else if (modalType === 'add') {
            const updatedLessons = [...lessons, newData];
            setLessons(updatedLessons);
            addLesson(section.id, newData);
        }
        closeModal();
    };

    const openDeleteModal = (lessonIndex) => {
        setLessonToDelete(lessonIndex);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setLessonToDelete(null);
    };

    const handleDelete = () => {
        if (lessonToDelete !== null) {
            const updatedLessons = lessons.filter(
                (_, index) => index !== lessonToDelete,
            );
            setLessons(updatedLessons);
            deleteLesson(section.id, lessonToDelete);
        }
        closeDeleteModal();
    };

    const openEditTitleModal = () => {
        setIsEditTitleModalOpen(true);
    };

    const closeEditTitleModal = () => {
        setIsEditTitleModalOpen(false);
    };

    const handleEditSectionTitle = (newTitle) => {
        onEditSectionTitle(section.id, newTitle);
        closeEditTitleModal();
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;

        // Ensure both active and over are valid
        if (active.id !== over.id && over) {
            // Find the indices of the active and over lessons
            const oldIndex = lessons.findIndex(
                (lesson) => lesson.title === active.id,
            );
            const newIndex = lessons.findIndex(
                (lesson) => lesson.title === over.id,
            );

            // Log the current order and the changed indices
            console.log('Before reorder:');
            console.log(lessons);
            console.log(
                'Dragged lesson (active):',
                active.id,
                'Index:',
                oldIndex,
            );
            console.log('Target lesson (over):', over.id, 'Index:', newIndex);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Reorder the lessons array by moving the active lesson to the new position
                const updatedLessons = arrayMove(lessons, oldIndex, newIndex);

                // Log the updated lessons
                console.log('After reorder:');
                console.log(updatedLessons);

                // Update the state with the new order
                setLessons(updatedLessons);
            }
        }
    };

    const SortableLesson = ({lesson, index}) => {
        const {attributes, listeners, setNodeRef, transform, transition} =
            useSortable({
                id: lesson.title,
            });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className='cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 rounded-md'
            >
                <div className='relative flex items-start'>
                    <div className='border-secondary text-secondary absolute text-2xl w-10 h-10 rounded-full border-4 bg-white flex items-center justify-center mr-4 ml-8 mt-1'>
                        {index + 1}
                    </div>
                    <div className='flex flex-col text-md pl-16 ml-8'>
                        <span className='font-bold'>{lesson.title}</span>
                        <span className='text-gray-500'>
                            {lesson.duration} mins
                        </span>
                    </div>
                    {userType === 'instructor' && (
                        <div className='ml-auto flex space-x-2 mr-2.5 mt-3'>
                            <button
                                onClick={() => openModal(lesson)}
                                className='bg-edit text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-edit-dark transition-all duration-300'
                            >
                                <FaEdit className='text-sm' />
                            </button>
                            <button
                                onClick={() => openDeleteModal(index)}
                                className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-delete-dark transition-all duration-300'
                            >
                                <MdDeleteOutline className='text-lg' />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className='mb-1'>
            <div
                onClick={(e) => userType === 'student' && toggleSection(e)}
                className={`cursor-pointer py-2 px-3 rounded-md flex items-start justify-between ${
                    isOpen ? 'bg-primary text-white' : 'bg-white'
                } hover:bg-gray-200`}
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
                        <span className='font-bold'>{section.title}</span>
                        <span className='text-gray-500'>
                            {lessonCount} lessons | {totalDuration} mins
                        </span>
                    </div>
                </div>

                {userType === 'instructor' && (
                    <div className='ml-auto flex space-x-2 mr-2.5 mt-2'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openAddModal();
                            }}
                            className='bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center'
                        >
                            <FaPlus />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditTitleModal();
                            }}
                            className='bg-edit text-white w-8 h-8 rounded-full flex items-center justify-center'
                        >
                            <MdEditNote className='ml-0.5' />
                        </button>
                        <button
                            onClick={() => onDeleteSection(section.id)}
                            className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center mr-4'
                            title='Delete Section'
                        >
                            <MdDeleteOutline />
                        </button>
                        <button
                            onClick={(e) => toggleSection(e, true)}
                            className='text-gray flex items-center justify-center'
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

            <div
                id={`section-${section.id}`}
                className={`space-y-2 overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={lessons.map((lesson) => lesson.title)}
                        strategy={verticalListSortingStrategy}
                    >
                        {lessons.map((lesson, lessonIndex) => (
                            <SortableLesson
                                key={lesson.title}
                                lesson={lesson}
                                index={lessonIndex}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {isModalOpen && (
                <ModalComponent
                    modalType={modalType}
                    lessonData={selectedLesson}
                    onClose={closeModal}
                    onSubmit={handleModalSubmit}
                />
            )}

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemTitle={lessonToDelete}
                isSection={false}
            />

            {isEditTitleModalOpen && (
                <EditSectionModal
                    section={section}
                    onClose={closeEditTitleModal}
                    onSubmit={handleEditSectionTitle}
                />
            )}
        </div>
    );
};

export default CourseLesson;
