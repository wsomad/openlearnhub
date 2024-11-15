import {useState} from 'react';
import CourseContentView from './CourseContentView';
import {FaPlus} from 'react-icons/fa';
import AddSectionModal from '../../modal/AddSectionModal';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';

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

    const openAddContentModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
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
        const section = courseSections.find(
            (section) => section.id === sectionId,
        );
        setIsConfirmModalOpen(true);
        setSectionToDelete(section);
    };

    const confirmDeleteSection = () => {
        const filteredSections = courseSections.filter(
            (section) => section.id !== sectionToDelete.id,
        );
        setCourseSections(filteredSections);
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    const handleEditSectionTitle = (sectionId, newTitle) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {...section, title: newTitle}
                    : section,
            ),
        );
    };

    const handleAddLesson = (sectionId, newLesson) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {...section, lessons: [...section.lessons, newLesson]}
                    : section,
            ),
        );
    };

    const handleEditLesson = (sectionId, lessonIndex, updatedLesson) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          lessons: section.lessons.map((lesson, index) =>
                              index === lessonIndex ? updatedLesson : lesson,
                          ),
                      }
                    : section,
            ),
        );
    };

    const handleDeleteLesson = (sectionId, lessonIndex) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          lessons: section.lessons.filter(
                              (_, index) => index !== lessonIndex,
                          ),
                      }
                    : section,
            ),
        );
    };

    return (
        <div
            className={`font-abhaya p-4 bg-white border border-gray overflow-y-auto ${
                userType === 'student'
                    ? 'w-[500px] max-h-[600px]'
                    : 'w-[1175px] h-[450px]'
            }`}
        >
            <div className='mb-2 font-bold text-xl flex justify-between items-center'>
                <span>Course Content</span>
                {userType === 'instructor' && (
                    <button
                        className='bg-secondary text-white px-3 py-2 rounded-2xl flex items-center mr-4'
                        onClick={openAddContentModal}
                    >
                        <span className='text-lg mt-0.5'>New Section</span>
                        <FaPlus className='ml-2 h-4 w-4' />
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
                onDeleteSection={handleDeleteSection}
                onEditSectionTitle={handleEditSectionTitle}
                onAddLesson={handleAddLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
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
                lessonTitle={sectionToDelete ? sectionToDelete.title : ''}
                isSection={true}
                itemTitle={sectionToDelete ? sectionToDelete.title : ''}
            />
        </div>
    );
};

export default CourseContentList;
