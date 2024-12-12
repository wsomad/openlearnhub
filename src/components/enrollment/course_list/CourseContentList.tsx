import {useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';

import {useCourses} from '../../../hooks/useCourses';
import {useLessons} from '../../../hooks/useLessons';
import {useSections} from '../../../hooks/useSections';
import {useUser} from '../../../hooks/useUser';
import {LessonBase} from '../../../types/lesson';
import {Section} from '../../../types/section';
import AddSectionModal from '../../modal/SectionModal';
import CourseContentView from './CourseContentView';

interface CourseContentListProps {
    course_id?: string;
    isDraft?: boolean;
    sectionsOrder: Section[];
    setSectionsOrder: React.Dispatch<React.SetStateAction<Section[]>>;
    onLessonSelect?: (lesson: LessonBase) => void;
    onSaveOrder: () => void;
    selectedLessonId?: string;
    onSectionChange: (section: Section) => void;
    onSectionDelete: (sectionId: string) => void;
    onLessonChange: (sectionId: string, lesson: LessonBase) => void;
    onLessonDelete: (sectionId: string, lessonId: string) => void;
}

const CourseContentList: React.FC<CourseContentListProps> = ({
    course_id,
    isDraft,
    sectionsOrder,
    setSectionsOrder,
    onLessonSelect,
    onSaveOrder,
    selectedLessonId,
    onSectionChange,
    onSectionDelete,
    onLessonChange,
    onLessonDelete,
}) => {
    const {selectedCourse} = useCourses();
    const {
        allSections,
        createSections,
        updateSection,
        deleteSection,
        fetchAllSections,
        deleteSelectedSection,
    } = useSections();
    const {createLessons, fetchAllLessons, updateLesson, deleteLesson} =
        useLessons();
    const {currentUser, userRole} = useUser();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);

    // Initialize local state management for section.
    const [sectionData, setSectionData] = useState<Section[]>([
        {
            section_id: '',
            course_id: '',
            lessons: [],
            section_order: 0,
            section_title: '',
        },
    ]);

    // Run this side effect to set local state management with existing `allSections`.
    useEffect(() => {
        if (allSections) {
            const sortedSections = [...allSections].sort(
                (a, b) => a.section_order - b.section_order,
            );
            setSectionData(sortedSections);
        }
    }, [allSections]);

    // Edit function based on role and uid.
    const canEditCourse = (): boolean => {
        if (!userRole || !currentUser?.uid) return false;
        return userRole === 'instructor';
    };

    // Open modal function for modal of content to add section and lesson.
    const openCreateSectionModal = (): void => {
        if (canEditCourse()) {
            setIsModalOpen(true);
        }
    };

    // Close modal function for modal of content.
    const closeSectionModal = (): void => setIsModalOpen(false);

    // Handle delete function to delete section.

    const [tempIdCounter, setTempIdCounter] = useState(0);
    const handleAddSection = async (
        newSection: Omit<Section, 'section_id' | 'lessons'>,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        setTempIdCounter((prev) => prev + 1);

        const nextOrder = sectionsOrder.length + 1;

        const section: Section = {
            ...newSection,
            section_id: `temp-${Date.now()}-${tempIdCounter}`,
            section_order: nextOrder,
            lessons: [],
        };

        // Update local sectionsOrder immediately
        setSectionsOrder((prev) => [...prev, section]);

        onSectionChange(section);
        closeSectionModal();
    };

    const handleDeleteSection = async (section_id: string) => {
        if (!course_id && !isDraft) return;

        onSectionDelete(section_id);

        // Update local state for immediate UI feedback
        setSectionsOrder((prev) =>
            prev.filter((section) => section.section_id !== section_id),
        );

        // For draft mode, also update sectionData state
        setSectionData((prev) =>
            prev.filter((section) => section.section_id !== section_id),
        );
    };

    const handleEditSectionTitle = async (
        section_id: string,
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => {
        const existingSection = sectionsOrder.find(
            (s) => s.section_id === section_id,
        );
        if (!existingSection) return;

        const sectionToUpdate = {
            ...existingSection,
            ...updatedSection,
            section_id: section_id,
        };

        onSectionChange(sectionToUpdate);

        // Update local state immediately
        setSectionsOrder((prev) =>
            prev.map((section) =>
                section.section_id === section_id ? sectionToUpdate : section,
            ),
        );

        setSectionData((prev) =>
            prev.map((section) =>
                section.section_id === section_id ? sectionToUpdate : section,
            ),
        );
    };

    // Handle add function to add lesson.
    const handleAddLesson = async (
        section_id: string,
        lesson: LessonBase,
    ): Promise<void> => {
        try {
            // Update the local section data first for immediate feedback
            setSectionData((prev) =>
                prev.map((section) => {
                    if (section.section_id === section_id) {
                        const updatedLessons = [
                            ...(section.lessons || []),
                            lesson,
                        ];
                        return {
                            ...section,
                            lessons: updatedLessons,
                        };
                    }
                    return section;
                }),
            );

            // Then propagate to parent (which handles the Firebase updates)
            await onLessonChange(section_id, lesson);
        } catch (error) {
            console.error('Failed to add lesson:', error);
            // Rollback local state on error
            setSectionData((prev) => [...prev]);
        }
    };

    const handleEditLesson = async (
        section_id: string,
        lesson: LessonBase,
    ): Promise<void> => {
        onLessonChange(section_id, lesson);
    };

    const handleDeleteLesson = async (
        section_id: string,
        lesson_id: string,
    ): Promise<void> => {
        onLessonDelete(section_id, lesson_id);
    };

    return (
        // <div className='w-full bg-white shadow-sm rounded-lg'>
        //     <div className='p-6'>
        //         <div className='flex justify-between items-center'>
        //             <h2 className='text-2xl font-bold'>Course Content</h2>
        //             {canEditCourse() && (
        //                 <button
        //                     type='button'
        //                     className='bg-primary text-white px-4 py-2 flex items-center space-x-2 hover:bg-secondary-dark transition-colors'
        //                     onClick={openCreateSectionModal}
        //                 >
        //                     <FaPlus className='w-3 h-3' />
        //                     <span>New Section</span>
        //                 </button>
        //             )}
        //         </div>
        //         <hr className='mt-6'></hr>
        //     </div>

        //     <div className='p-6'>
        //         <CourseContentView
        //             course_id={course_id || ''}
        //             isDraft={isDraft}
        //             canEdit={canEditCourse()}
        //             sectionsOrder={sectionsOrder || []}
        //             setSectionsOrder={setSectionsOrder || (() => {})}
        //             onSaveOrder={onSaveOrder || (() => {})}
        //             onDeleteSection={handleDeleteSection}
        //             onEditSectionTitle={handleEditSectionTitle}
        //             onAddLesson={handleAddLesson}
        //             onEditLesson={handleEditLesson}
        //             onDeleteLesson={handleDeleteLesson}
        //             onLessonSelect={onLessonSelect}
        //         />

        //         {isModalOpen && (
        //             <AddSectionModal
        //                 isOpen={isModalOpen}
        //                 isDraft={isDraft}
        //                 onClose={closeSectionModal}
        //                 onSubmit={handleAddSection}
        //             />
        //         )}
        //     </div>
        // </div>

        <div className='w-full bg-white shadow-sm rounded-lg'>
            <div className='p-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold'>Course Content</h2>
                    {canEditCourse() && (
                        <button
                            type='button'
                            className='bg-primary text-white px-4 py-2 flex items-center space-x-2 hover:bg-secondary-dark transition-colors'
                            onClick={openCreateSectionModal}
                        >
                            <FaPlus className='w-3 h-3' />
                            <span>New Section</span>
                        </button>
                    )}
                </div>
                <hr className='mt-6'></hr>
            </div>

            <div className='p-6 max-h-[calc(100vh-400px)] overflow-y-auto'>
                <CourseContentView
                    course_id={course_id || ''}
                    isDraft={isDraft}
                    canEdit={canEditCourse()}
                    sectionsOrder={sectionsOrder || []}
                    setSectionsOrder={setSectionsOrder || (() => {})}
                    onSaveOrder={onSaveOrder || (() => {})}
                    onDeleteSection={handleDeleteSection}
                    onEditSectionTitle={handleEditSectionTitle}
                    onAddLesson={handleAddLesson}
                    onEditLesson={handleEditLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onLessonSelect={onLessonSelect}
                />

                {/* Modal should stay here */}
                {isModalOpen && (
                    <AddSectionModal
                        isOpen={isModalOpen}
                        isDraft={isDraft}
                        onClose={closeSectionModal}
                        onSubmit={handleAddSection}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseContentList;
