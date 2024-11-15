import {useState} from 'react';
import CourseContentView from './CourseContentView';
import {FaPlus} from 'react-icons/fa';
import AddSectionModal from './modal/AddSectionModal';
import ConfirmDeleteModal from './modal/ConfirmDeleteModal';

// Manages the course content and actions based on the user's type (student or instructor).
const CourseContentList = ({userType}) => {
    // State Management

    //Controls the visibility of the "Add Section" modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Holds the list of sections for the course, each with an id, title, and lessons. It’s an array of sections
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

    // Controls the visibility of the "Confirm Delete" modal.
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Stores the section that is selected for deletion.
    const [sectionToDelete, setSectionToDelete] = useState(null);

    // Modal Management Function

    // Opens the modal for adding a new section when the "New Section" button is clicked (only for instructors).
    const openAddContentModal = () => {
        setIsModalOpen(true);
    };

    // Closes the "Add Section" modal.
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Closes the confirmation modal for deletion.
    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    // Adds a new section to courseSections and then closes the modal.
    const handleAddSection = (newSection) => {
        const sectionWithId = {
            ...newSection,
            id: courseSections.length + 1,
            lessons: [],
        };
        setCourseSections([...courseSections, sectionWithId]);
        closeModal();
    };

    // Opens the confirmation modal and sets the section to be deleted.
    const handleDeleteSection = (sectionId) => {
        const section = courseSections.find(
            (section) => section.id === sectionId,
        );
        setIsConfirmModalOpen(true);
        setSectionToDelete(section);
    };

    // Deletes the section from courseSections and closes the confirmation modal.
    const confirmDeleteSection = () => {
        const filteredSections = courseSections.filter(
            (section) => section.id !== sectionToDelete.id,
        );
        setCourseSections(filteredSections);
        setIsConfirmModalOpen(false);
        setSectionToDelete(null);
    };

    // Section Management Function

    // Allows for editing a section's title within courseSections.
    const handleEditSectionTitle = (sectionId, newTitle) => {
        setCourseSections((prevSections) => {
            return prevSections.map((section) =>
                section.id === sectionId
                    ? {...section, title: newTitle}
                    : section,
            );
        });
    };

    // Adds a new lesson to a specific section.
    const handleAddLesson = (sectionId, newLesson) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          lessons: [...section.lessons, newLesson],
                      }
                    : section,
            ),
        );
    };

    // Edits a lesson in a specific section.
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

    // Deletes a lesson from a specific section.
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

    // JSX Layout
    return (
        <div
            className={`font-abhaya mt-24 ml-12 p-4 bg-white shadow-md overflow-y-auto ${
                userType === 'student'
                    ? 'w-[325px] h-[450px]'
                    : 'w-[1175px] h-[450px]'
            }`}
        >
            <div className='mb-2 ml-4 font-bold text-xl flex justify-between items-center'>
                <span>Course Content</span>
                {userType === 'instructor' && (
                    <button
                        className='bg-secondary text-white px-3 py-2 rounded-2xl flex items-center mr-4'
                        onClick={openAddContentModal}
                    >
                        <span className='text-lg mt-0.5'>New Section</span>{' '}
                        <FaPlus className='ml-2 h-4 w-4' />{' '}
                    </button>
                )}
            </div>
            <div className='-mx-4'>
                <hr className='border-t border-gray' />
            </div>

            {/* This child component is responsible for displaying the list of sections and interacting with them.
            It receives props such as courseSections, functions for adding/editing/deleting lessons/sections, and the user type. */}
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

            {/* A modal component for adding a new section. It gets triggered by clicking the
            "New Section" button, and it sends the new section data back to handleAddSection for adding. */}
            <AddSectionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleAddSection}
            />

            {/* A modal for confirming the deletion of a section. It shows the title of the section to be deleted and
            lets the user confirm or cancel the deletion. */}
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
                itemTitle={sectionToDelete ? sectionToDelete.title : ''}
            />
        </div>
    );
};

export default CourseContentList;
