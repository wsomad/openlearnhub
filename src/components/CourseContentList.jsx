import {useState} from 'react';
import CourseContentView from './CourseContentView';
import {FaPlus} from 'react-icons/fa';
import AddSectionModal from './AddSectionModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const CourseContentList = ({userType}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseSections, setCourseSections] = useState([
        {
            id: 1,
            title: 'Introduction to Programming',
            lessons: [
                {title: 'Welcome Message', duration: 2},
                {title: 'What is Programming?', duration: 3},
                {title: 'Setting Up Your Environment', duration: 5},
            ],
        },
        {
            id: 2,
            title: 'Web Development Basics',
            lessons: [
                {title: 'HTML Fundamentals', duration: 4},
                {title: 'CSS Styling', duration: 6},
                {title: 'Responsive Design', duration: 5},
            ],
        },
        {
            id: 3,
            title: 'Data Structures',
            lessons: [
                {title: 'Arrays and Lists', duration: 4},
                {title: 'Stacks and Queues', duration: 5},
                {title: 'Linked Lists', duration: 6},
            ],
        },
        {
            id: 4,
            title: 'Algorithms',
            lessons: [
                {title: 'Sorting Algorithms', duration: 5},
                {title: 'Searching Algorithms', duration: 6},
                {title: 'Graph Algorithms', duration: 4},
            ],
        },
        {
            id: 5,
            title: 'Databases and SQL',
            lessons: [
                {title: 'Database Design', duration: 4},
                {title: 'SQL Queries', duration: 5},
                {title: 'Normalization', duration: 6},
            ],
        },
    ]);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    const openAddContentModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddSection = (newSection) => {
        const sectionWithId = {
            ...newSection,
            id: courseSections.length + 1,
            lessons: [],
        };
        setCourseSections([...courseSections, sectionWithId]);
        closeModal();
    };

    const handleDeleteSection = (sectionId) => {
        setIsConfirmModalOpen(true);
        setSectionToDelete(sectionId);
    };

    const confirmDeleteSection = () => {
        const filteredSections = courseSections.filter(
            (section) => section.id !== sectionToDelete,
        );
        setCourseSections(filteredSections);
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    return (
        <div className='font-abhaya mt-24 ml-12 w-[1160px] h-[850px] overflow-y-auto shadow-md p-4 bg-white'>
            <div className='mb-2 ml-4 font-bold text-xl flex justify-between items-center'>
                <span>Course Content</span>
                {userType === 'instructor' && (
                    <button
                        className='bg-secondary text-white px-3 py-2 rounded-md flex items-center mr-6'
                        onClick={openAddContentModal}
                    >
                        <FaPlus />
                    </button>
                )}
            </div>
            <div className='-mx-4'>
                <hr className='border-t border-gray' />
            </div>
            <CourseContentView
                userType={userType}
                courseSections={courseSections}
                setCourseSections={setCourseSections}
                onDeleteSection={handleDeleteSection} // Pass delete function to child component
            />

            <AddSectionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleAddSection}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmDeleteSection}
                lessonTitle={
                    sectionToDelete
                        ? courseSections.find(
                              (section) => section.id === sectionToDelete,
                          )?.title
                        : ''
                }
                isSection={true}
            />
        </div>
    );
};

export default CourseContentList;
