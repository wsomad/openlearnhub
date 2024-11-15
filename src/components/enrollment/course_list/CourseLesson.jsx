import {useState} from 'react';
import {FaAngleDown, FaAngleRight, FaEdit} from 'react-icons/fa';
import {MdDeleteOutline, MdEditNote} from 'react-icons/md';
import {FaPlus} from 'react-icons/fa6';
import ModalComponent from '../../modal/ModalComponent';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import EditSectionModal from '../../modal/EditSectionModal';

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

    // Remove the local lessons state and use section.lessons directly

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
            const lessonIndex = section.lessons.findIndex(
                (lesson) => lesson.title === selectedLesson.title,
            );
            if (lessonIndex > -1) {
                updateLesson(section.id, {
                    oldTitle: selectedLesson.title,
                    newData,
                });
            }
        } else if (modalType === 'add') {
            addLesson(section.id, newData);
        }
        closeModal();
    };

    const openDeleteModal = (lessonTitle) => {
        setLessonToDelete(lessonTitle);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setLessonToDelete(null);
    };

    const handleDelete = () => {
        if (lessonToDelete !== null) {
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

    return (
        <div className='mb-1'>
            <div
                onClick={(e) => userType === 'student' && toggleSection(e)}
                className='cursor-pointer py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-start justify-between'
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
                            {section.lessons.length} lessons |{' '}
                            {section.lessons.reduce(
                                (acc, lesson) => acc + lesson.duration,
                                0,
                            )}{' '}
                            mins
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
                            <MdEditNote />
                        </button>
                        <button
                            onClick={() => onDeleteSection(section.id)}
                            className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center'
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

            {isOpen && (
                <div className='mt-2 space-y-2'>
                    {section.lessons.map((lesson, lessonIndex) => (
                        <div
                            key={lessonIndex}
                            className='cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 rounded-md'
                        >
                            <div className='relative flex items-start'>
                                <div className='border-secondary text-secondary absolute text-2xl w-10 h-10 rounded-full border-4 bg-white flex items-center justify-center mr-4 ml-8 mt-1'>
                                    {lessonIndex + 1}
                                </div>
                                <div className='flex flex-col text-md pl-16 ml-8'>
                                    <span className='font-bold'>
                                        {lesson.title}
                                    </span>
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
                                            onClick={() =>
                                                openDeleteModal(lesson.title)
                                            }
                                            className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-delete-dark transition-all duration-300'
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
                    itemTitle={lessonToDelete}
                    isSection={false}
                />
            )}

            {isEditTitleModalOpen && (
                <EditSectionModal
                    isOpen={isEditTitleModalOpen}
                    onClose={closeEditTitleModal}
                    initialTitle={section.title}
                    onSubmit={handleEditSectionTitle}
                />
            )}
        </div>
    );
};

export default CourseLesson;
