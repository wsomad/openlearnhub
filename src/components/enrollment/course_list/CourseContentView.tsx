import { GripVertical } from 'lucide-react';
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
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Lesson } from '../../../types/Lesson';
import { Section } from '../../../types/section';
import CourseLesson from './CourseLesson';

interface SortableCourseSectionProps {
    section: Section;
    index: number;
    userType: 'student' | 'instructor';
    canEdit: boolean;
    onDeleteSection: (sectionId: string) => void;
    onEditSectionTitle: (sectionId: string, newTitle: string) => void;
    onAddLesson: (sectionId: string, lesson: Omit<Lesson, 'lesson_id'>) => void;
    onEditLesson: (
        sectionId: string,
        lessonId: string,
        updatedLesson: Partial<Lesson>,
    ) => void;
    onDeleteLesson: (sectionId: string, lessonId: string) => void;
}

interface CourseContentViewProps {
    userType: 'student' | 'instructor';
    courseSections: Section[];
    setCourseSections: React.Dispatch<React.SetStateAction<Section[]>>;
    canEdit: boolean;
    onDeleteSection: (sectionId: string) => void;
    onEditSectionTitle: (sectionId: string, newTitle: string) => void;
    onAddLesson: (sectionId: string, lesson: Omit<Lesson, 'lesson_id'>) => void;
    onEditLesson: (
        sectionId: string,
        lessonId: string,
        updatedLesson: Partial<Lesson>,
    ) => void;
    onDeleteLesson: (sectionId: string, lessonId: string) => void;
}

const SortableCourseSection: React.FC<SortableCourseSectionProps> = ({
    section,
    index,
    userType,
    canEdit,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: section.section_id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    const totalDuration = section.lessons.reduce(
        (acc, lesson) => acc + lesson.lesson_duration,
        0,
    );

    const DragHandle = () => (
        <div
            {...attributes}
            {...listeners}
            className='absolute cursor-move flex items-center justify-center h-full px-2 text-gray-400 hover:text-gray-600'
            style={{left: '-20px'}}
        >
            <GripVertical size={20} />
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            <div className='relative'>
                {canEdit && userType === 'instructor' && <DragHandle />}
                <CourseLesson
                    section={section}
                    index={index}
                    lessonCount={section.lessons.length}
                    totalDuration={totalDuration}
                    userType={userType}
                    canEdit={canEdit}
                    onDeleteSection={onDeleteSection}
                    onEditSectionTitle={onEditSectionTitle}
                    onAddLesson={onAddLesson}
                    onEditLesson={onEditLesson}
                    onDeleteLesson={onDeleteLesson}
                />
            </div>
        </div>
    );
};

const CourseContentView: React.FC<CourseContentViewProps> = ({
    userType,
    courseSections,
    setCourseSections,
    canEdit,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent): void => {
        if (!canEdit) return;

        const {active, over} = event;

        if (over && active.id !== over.id) {
            setCourseSections((sections) => {
                const oldIndex = sections.findIndex(
                    (section) => section.section_id === active.id,
                );
                const newIndex = sections.findIndex(
                    (section) => section.section_id === over.id,
                );

                return arrayMove(sections, oldIndex, newIndex);
            });
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
                    items={courseSections.map((section) => section.section_id)}
                    strategy={verticalListSortingStrategy}
                >
                    {courseSections.map((section, index) => (
                        <SortableCourseSection
                            key={section.section_id}
                            section={section}
                            index={index + 1}
                            userType={userType}
                            canEdit={canEdit}
                            onDeleteSection={onDeleteSection}
                            onEditSectionTitle={onEditSectionTitle}
                            onAddLesson={onAddLesson}
                            onEditLesson={onEditLesson}
                            onDeleteLesson={onDeleteLesson}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default CourseContentView;
