import React from 'react';
import {
    DndContext,
    closestCenter,
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
    useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import CourseLesson from './CourseLesson';
import {GripVertical} from 'lucide-react';

// Sortable Course Section Component
const SortableCourseSection = ({
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
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: section.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    // Add the drag handle before the section number
    const DragHandle = () => (
        <div
            {...attributes}
            {...listeners}
            className='absolute cursor-move flex items-center justify-center h-full px-2 text-gray-400 hover:text-gray-600'
            style={{left: '-20px'}} // Adjust the left property to move the icon
        >
            <GripVertical size={20} />
        </div>
    );

    // Modify the CourseLesson component to include the drag handle
    return (
        <div ref={setNodeRef} style={style}>
            <div className='relative'>
                {userType === 'instructor' && <DragHandle />}
                <CourseLesson
                    section={section}
                    index={index}
                    lessonCount={lessonCount}
                    totalDuration={totalDuration}
                    userType={userType}
                    updateLesson={updateLesson}
                    addLesson={addLesson}
                    deleteLesson={deleteLesson}
                    onDeleteSection={onDeleteSection}
                    onEditSectionTitle={onEditSectionTitle}
                />
            </div>
        </div>
    );
};

const CourseContentView = ({
    userType,
    courseSections,
    setCourseSections,
    onDeleteSection,
    onEditSectionTitle,
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

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setCourseSections((sections) => {
                const oldIndex = sections.findIndex(
                    (section) => section.id === active.id,
                );
                const newIndex = sections.findIndex(
                    (section) => section.id === over.id,
                );

                const newSections = arrayMove(sections, oldIndex, newIndex);

                // Log the new order of course sections
                console.log('Sections rearranged:', newSections);

                return newSections;
            });
        }
    };

    const updateLesson = (sectionId, updatedLesson) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map((lesson) =>
                            lesson.title === updatedLesson.oldTitle
                                ? {...lesson, ...updatedLesson.newData}
                                : lesson,
                        ),
                    };
                }
                return section;
            }),
        );
    };

    const addLesson = (sectionId, newLesson) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {...section, lessons: [...section.lessons, newLesson]}
                    : section,
            ),
        );
    };

    const deleteLesson = (sectionId, lessonTitle) => {
        setCourseSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          lessons: section.lessons.filter(
                              (lesson) => lesson.title !== lessonTitle,
                          ),
                      }
                    : section,
            ),
        );
    };

    return (
        <div className='font-abhaya w-full bg-white'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={courseSections.map((section) => section.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {courseSections.map((section, index) => {
                        const lessonCount = section.lessons.length;
                        const totalDuration = section.lessons.reduce(
                            (acc, lesson) => acc + lesson.duration,
                            0,
                        );

                        return (
                            <SortableCourseSection
                                key={section.id}
                                section={section}
                                index={index + 1}
                                lessonCount={lessonCount}
                                totalDuration={totalDuration}
                                userType={userType}
                                updateLesson={updateLesson}
                                addLesson={addLesson}
                                deleteLesson={deleteLesson}
                                onDeleteSection={onDeleteSection}
                                onEditSectionTitle={onEditSectionTitle}
                            />
                        );
                    })}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default CourseContentView;
