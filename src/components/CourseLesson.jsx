import {useState} from 'react';
import {FaAngleDown, FaAngleRight, FaEdit} from 'react-icons/fa';
import {MdDeleteOutline, MdEditNote} from 'react-icons/md';
import {FaPlus} from 'react-icons/fa6';
import ModalComponent from './ModalComponent';

const CourseLesson = ({
    section,
    index,
    lessonCount,
    totalDuration,
    userType,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [selectedLesson, setSelectedLesson] = useState(null); // Track selected lesson for editing
    const [modalType, setModalType] = useState('add'); // Default is 'add' for adding lessons

    // Toggle section visibility, but only if it's the edit button for instructors
    const toggleSection = (e, isEditButton = false) => {
        if (userType === 'instructor' && !isEditButton) {
            return; // Prevent toggling for instructors if the edit button isn't clicked
        }
        e.stopPropagation(); // Prevent click event from propagating
        setIsOpen(!isOpen); // Toggle the section open/close state
    };

    // Open modal for editing
    const openModal = (lesson) => {
        setSelectedLesson(lesson);
        setModalType('edit'); // Set modal type to 'edit' when editing
        setIsModalOpen(true); // Open the modal
    };

    // Open modal for adding a new lesson
    const openAddModal = () => {
        setSelectedLesson(null); // Reset selected lesson for adding
        setModalType('add'); // Set modal type to 'add' for adding a new lesson
        setIsModalOpen(true); // Open the modal
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedLesson(null); // Clear selected lesson
    };

    return (
        <div className='mb-1'>
            {/* Section Header */}
            <div
                onClick={(e) => userType === 'student' && toggleSection(e)} // Only toggle for students when header is clicked
                className='cursor-pointer py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-start justify-between'
                aria-expanded={isOpen}
                aria-controls={`section-${section.id}`}
            >
                <div className='relative flex items-start'>
                    <div
                        className={`absolute text-2xl w-10 h-10 rounded-full border-4 ${
                            isOpen
                                ? 'bg-secondary border-secondary text-white'
                                : 'bg-white border-secondary text-secondary'
                        } flex items-center justify-center mr-4 mt-1 transition-colors duration-200 ease-in-out`}
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

                {/* Instructor buttons */}
                {userType === 'instructor' ? (
                    <div className='ml-auto flex space-x-2 mr-4 mt-1'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openAddModal(); // Open the modal for adding a lesson
                            }}
                            className='bg-secondary text-white px-3 py-1 rounded-md w-10 h-10'
                        >
                            <FaPlus />
                        </button>
                        <button
                            onClick={(e) => toggleSection(e, true)} // Only toggle for the edit button
                            className='bg-edit text-white px-3 py-1 rounded-md'
                        >
                            <MdEditNote />
                        </button>
                    </div>
                ) : (
                    <span>
                        {isOpen ? (
                            <FaAngleDown className='text-slate-500 text-xl mt-4' />
                        ) : (
                            <FaAngleRight className='text-slate-500 text-xl mt-4 mr-0.5' />
                        )}
                    </span>
                )}
            </div>

            {/* Section Lessons (when open) */}
            <div
                id={`section-${section.id}`}
                className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
            >
                {section.lessons.map((lesson, lessonIndex) => (
                    <div
                        key={lessonIndex}
                        className='cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 rounded-md'
                    >
                        <div className='relative flex items-start'>
                            <div className='absolute text-2xl w-10 h-10 rounded-full border-4 bg-white border-secondary text-secondary flex items-center justify-center mr-4 ml-8 mt-1'>
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
                                <div className='ml-auto flex space-x-2 mr-5 mt-1'>
                                    <button
                                        onClick={() => openModal(lesson)} // Open modal for editing
                                        className='bg-edit text-white px-3 py-1 rounded-md w-10 h-10'
                                    >
                                        <FaEdit />
                                    </button>
                                    <button className='bg-delete text-white px-3 py-1 rounded-md'>
                                        <MdDeleteOutline />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Component */}
            {isModalOpen && (
                <ModalComponent
                    modalType={modalType} // Pass the modal type (add or edit)
                    lessonData={selectedLesson} // Pass the selected lesson to the modal for editing
                    closeModal={closeModal} // Close function for the modal
                />
            )}
        </div>
    );
};

export default CourseLesson;
