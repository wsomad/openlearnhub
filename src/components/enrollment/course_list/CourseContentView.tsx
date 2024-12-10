import React from 'react';

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
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { Lesson, LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';
import SortableCourseSection from './SortableCourseSection';

interface CourseContentViewProps {
    course_id: string;
    isDraft?: boolean;
    canEdit: boolean;
    sectionsOrder: Section[]; // Receive state
    setSectionsOrder: React.Dispatch<React.SetStateAction<Section[]> | []>; // Receive state updater
    onSaveOrder: () => void;
    onDeleteSection: (section_id: string) => void;
    onEditSectionTitle: (
        section_id: string,
        updatedSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => void;
    onAddLesson: (section_id: string, lesson: LessonBase) => Promise<void>;
    onEditLesson: (section_id: string, lesson: LessonBase) => Promise<void>;
    onDeleteLesson: (section_id: string, lesson_id: string) => Promise<void>;
    onLessonSelect?: (lesson: LessonBase) => void;
}

const CourseContentView: React.FC<CourseContentViewProps> = ({
    course_id,
    isDraft,
    canEdit,
    sectionsOrder,
    setSectionsOrder,
    onSaveOrder,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
    onLessonSelect,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const {selectedSection, allSections, fetchAllSections, updateSection} =
        useSections();
    const {currentUser, userRole} = useUser();

    // Handle drag function to rearrange the position of section.
    const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
        if (!canEdit) return;

        const {active, over} = event;

        if (active.id !== over?.id) {
            const oldIndex = sectionsOrder?.findIndex(
                (item) => item.section_id === active.id,
            );
            const newIndex = sectionsOrder?.findIndex(
                (item) => item.section_id === over?.id,
            );
            const newOrder: Section[] | [] = arrayMove(
                sectionsOrder || [],
                oldIndex || 0,
                newIndex || 0,
            );
            setSectionsOrder(newOrder); // Update the state via prop
        }
    };

    // Handle save function to save section order.
    const handleSaveOrder = async () => {
        try {
            const updatedData = sectionsOrder?.map((section) => ({
                section_id: section.section_id,
                section_order: section.section_order,
            }));

            await updateSection(
                course_id,
                selectedSection?.section_id || '',
                updatedData,
            );
            console.log('Sections order saved to Firestore:', updatedData);
        } catch (error) {
            console.error('Error saving section order:', error);
        }
    };

    return (
        <div className='font-abhaya w-full bg-white'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sectionsOrder.map((section) => section.section_id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sectionsOrder.map((section, index) => (
                        <SortableCourseSection
                            key={section.section_id}
                            isDraft={isDraft}
                            section={section}
                            index={index + 1}
                            canEdit={canEdit}
                            onDeleteSection={onDeleteSection}
                            onEditSectionTitle={onEditSectionTitle}
                            onAddLesson={onAddLesson}
                            onEditLesson={onEditLesson}
                            onDeleteLesson={onDeleteLesson}
                            onLessonSelect={onLessonSelect}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default CourseContentView;
