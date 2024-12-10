import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';
import AddSectionModal from '../../modal/AddSectionModal';
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

    // const handleAddSection = async (
    //     newSection: Omit<Section, 'section_id' | 'lessons'>,
    // ): Promise<void> => {
    //     if (!canEditCourse()) return;

    //     console.log('Current sections:', sectionsOrder); // Debug log

    //     // Explicitly calculate next order based on existing sections
    //     const maxOrder = Math.max(
    //         ...sectionsOrder.map((s) => s.section_order),
    //         0,
    //     );
    //     const nextOrder = maxOrder + 1;

    //     console.log('Calculated next order:', nextOrder); // Debug log

    //     const section: Section = {
    //         ...newSection,
    //         section_id: `temp-${Date.now()}`,
    //         section_order: nextOrder, // Use calculated order
    //         lessons: [],
    //     };

    //     console.log('New section being created:', section); // Debug log

    //     onSectionChange(section);
    //     closeSectionModal();
    // };

    // Handle delete function to delete section.
    const handleAddSection = async (
        newSection: Omit<Section, 'section_id' | 'lessons'>,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        // Get existing sections sorted by order
        const sortedSections = [...sectionsOrder].sort(
            (a, b) => a.section_order - b.section_order,
        );

        // The next order should simply be the length + 1
        const nextOrder = sortedSections.length + 1;

        console.log('Current sections:', sortedSections);
        console.log('Next order will be:', nextOrder);

        const section: Section = {
            ...newSection,
            section_id: `temp-${Date.now()}`,
            section_order: nextOrder,
            lessons: [],
        };

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

    // Handle edit function to edit section title.
    const handleEditSectionTitle = async (
        section_id: string,
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => {
        if (!course_id && !isDraft) return;

        const sectionToUpdate = {
            ...updatedSection,
            section_id: section_id,
            lessons: [],
        };

        onSectionChange(sectionToUpdate);

        // Update local state for immediate UI feedback
        setSectionsOrder((prev) =>
            prev.map((section) =>
                section.section_id === section_id
                    ? {...section, ...updatedSection}
                    : section,
            ),
        );

        // For draft mode, also update sectionData state
        setSectionData((prev) =>
            prev.map((section) =>
                section.section_id === section_id
                    ? {...section, ...updatedSection}
                    : section,
            ),
        );
    };

    // Handle add function to add lesson.
    const handleAddLesson = async (
        section_id: string,
        lesson: LessonBase,
    ): Promise<void> => {
        onLessonChange(section_id, lesson);
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

            <div className='p-6'>
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
