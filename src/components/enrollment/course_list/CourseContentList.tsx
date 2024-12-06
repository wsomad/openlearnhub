import {useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {Lesson} from '../../../types/lesson';
import {Section} from '../../../types/section';
import AddSectionModal from '../../modal/AddSectionModal';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import CourseContentView from './CourseContentView';
import {useUser} from '../../../hooks/useUser';
import {clearSingleSection} from '../../../store/slices/sectionSlice';
import {useCourses} from '../../../hooks/useCourses';
import {useSections} from '../../../hooks/useSections';

interface CourseContentListProps {
    course_id: string;
    sectionsOrder?: Section[];
    setSectionsOrder?: React.Dispatch<React.SetStateAction<Section[]>>;
    onSaveOrder?: () => void;
}

const CourseContentList: React.FC<CourseContentListProps> = ({
    course_id,
    sectionsOrder,
    setSectionsOrder,
    onSaveOrder,
}) => {
    const {selectedCourse} = useCourses();
    const {
        allSections,
        selectedSection,
        createSections,
        updateSection,
        deleteSection,
        deleteSingleSection,
    } = useSections();
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
        if (!course_id || !userRole) return false;

        return (
            userRole === 'instructor' &&
            currentUser?.uid === selectedCourse?.instructor_id
        );
    };

    // Open modal function for modal of content to add section and lesson.
    const openCreateSectionModal = (): void => {
        if (canEditCourse()) {
            setIsModalOpen(true);
        }
    };

    // Close modal function for modal of content.
    const closeSectionModal = (): void => setIsModalOpen(false);

    // Close confirmation function to close modal of content.
    const closeConfirmModal = (): void => {
        setIsConfirmModalOpen(false);
        deleteSingleSection()
    };

    // Handle add function to add section.
    const handleAddSection = async (
        newSection: Omit<Section, 'section_id' | 'lessons'>,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        if (!course_id) {
            return;
        }

        try {
            const section: Section = {
                ...newSection,
                section_id: newSection.section_title || '',
                section_order: newSection.section_order,
                lessons: [],
            };
            await createSections(course_id, section);
            closeSectionModal();
            console.log('Section created successfully.');
        } catch (error) {
            console.error('Failed to create this section:', error);
        }
    };

    // Handle delete function to delete section.
    const handleDeleteSection = (section_id: string): void => {
        if (!canEditCourse()) return;

        if (!course_id || !selectedSection?.section_id) {
            return;
        }

        setIsConfirmModalOpen(true);
        // const checkSection = selectedSection?.section_id === section_id;
        // if (checkSection) {
        //     setIsConfirmModalOpen(true);
        //     deleteSection(selectedCourse.course_id, selectedSection.section_id);
        // }
    };

    // Delete confirmation function to delete section.
    const confirmDeleteSection = (section_id: string): void => {
        if (selectedSection && canEditCourse()) {
            if (!selectedCourse?.course_id || !selectedSection?.section_id) {
                return;
            }

            const checkSection = selectedSection?.section_id === section_id;

            if (checkSection) {
                setIsConfirmModalOpen(true);
                deleteSection(
                    selectedCourse.course_id,
                    selectedSection.section_id,
                );
            }

            closeConfirmModal();
        }
    };

    // Handle edit function to edit section title.
    const handleEditSectionTitle = async (
        section_id: string,
        new_title: string,
    ): Promise<void> => {
        if (!canEditCourse()) return;

        const checkSection = selectedSection?.section_id === section_id;

        if (checkSection) {
            const updatedSection: Partial<Section> = {
                section_title: new_title,
            };
            await updateSection(course_id, section_id, updatedSection);
        }
        // setCourseSections((prevSections) =>
        //     prevSections.map((section) =>
        //         section.section_id === sectionId
        //             ? {...section, section_title: newTitle}
        //             : section,
        //     ),
        // );
    };

    // Handle add function to add lesson.
    const handleAddLesson = (
        //course_id: string,
        section_id: string,
        //lesson: Lesson,
        lesson: Omit<Lesson, 'lesson_id'>,
    ): void => {
        if (!canEditCourse()) return;
        // const lessonData: Lesson = {
        //     lesson_id: lesson?.lesson_id || '',
        //     lesson_title: lesson?.lesson_title || '',
        //     lesson_content: '',
        //     section_id: section_id,

        // };

        // setCourseSections((prevSections) =>
        //     prevSections.map((section) =>
        //         section.section_id === sectionId
        //             ? {
        //                   ...section,
        //                   lessons: [
        //                       ...section.lessons,
        //                       {
        //                           ...newLesson,
        //                           lesson_id: `l${section.lessons.length + 1}`,
        //                           section_id: sectionId,
        //                       },
        //                   ],
        //               }
        //             : section,
        //     ),
        // );
    };

    const handleEditLesson = (
        section_id: string,
        lesson_id: string,
        updated_lesson: Partial<Lesson>,
    ): void => {
        if (!canEditCourse()) return;

        // setCourseSections((prevSections) =>
        //     prevSections.map((section) =>
        //         section.section_id === sectionId
        //             ? {
        //                   ...section,
        //                   lessons: section.lessons.map((lesson) =>
        //                       lesson.lesson_id === lessonId
        //                           ? {...lesson, ...updatedLesson}
        //                           : lesson,
        //                   ),
        //               }
        //             : section,
        //     ),
        // );
    };

    const handleDeleteLesson = (sectionId: string, lessonId: string): void => {
        if (!canEditCourse()) return;

        // setCourseSections((prevSections) =>
        //     prevSections.map((section) =>
        //         section.section_id === sectionId
        //             ? {
        //                   ...section,
        //                   lessons: section.lessons.filter(
        //                       (lesson) => lesson.lesson_id !== lessonId,
        //                   ),
        //               }
        //             : section,
        //     ),
        // );
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
                    canEdit={canEditCourse()}
                    sectionsOrder={sectionsOrder || []}
                    setSectionsOrder={setSectionsOrder || (() => {})}
                    onSaveOrder={onSaveOrder || (() => {})}
                    onDeleteSection={handleDeleteSection}
                    onEditSectionTitle={handleEditSectionTitle}
                    onAddLesson={handleAddLesson}
                    onEditLesson={handleEditLesson}
                    onDeleteLesson={handleDeleteLesson}
                />

                {isModalOpen && (
                    <AddSectionModal
                        isOpen={isModalOpen}
                        onClose={closeSectionModal}
                        onSubmit={handleAddSection}
                    />
                )}

                {isConfirmModalOpen && selectedSection && (
                    <ConfirmDeleteModal
                        isOpen={isConfirmModalOpen}
                        onClose={closeConfirmModal}
                        onConfirm={confirmDeleteSection}
                        itemTitle={selectedSection.section_title || ''}
                        isSection={true}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseContentList;
