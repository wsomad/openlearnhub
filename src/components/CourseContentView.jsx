import {DndContext, closestCenter} from '@dnd-kit/core';
import {SortableContext, arrayMove, useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {FaGripLines} from 'react-icons/fa'; // Import drag handle icon
import CourseLesson from './CourseLesson';

const SortableSection = ({section, children, userType}) => {
    // Only apply drag-and-drop functionality if userType is 'instructor'
    const {attributes, listeners, setNodeRef, transform, transition} =
        userType === 'instructor' ? useSortable({id: section.id}) : {};

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className='flex items-center space-x-4'
        >
            {/* Only show the drag handle if user is an instructor */}
            {userType === 'instructor' && (
                <div {...attributes} {...listeners}>
                    <FaGripLines className='text-gray mb-1' />
                </div>
            )}
            {/* Render the section content (children) beside the drag handle */}
            <div className='flex-grow'>{children}</div>
        </div>
    );
};

// To display the course sections and manage interactions such as reordering sections (via drag-and-drop) and managing lessons.
// The flow of components and logic is divided into sections for instructor users (who can reorder sections) and students
// (who can only view the content).
const CourseContentView = ({
    userType,
    courseSections,
    setCourseSections,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}) => {
    const handleDragEnd = (event) => {
        const {active, over} = event;

        // Ensure both active and over are valid
        if (active.id !== over.id && over) {
            // Find the indices of the active and over sections
            const oldIndex = courseSections.findIndex(
                (section) => section.id === active.id,
            );
            const newIndex = courseSections.findIndex(
                (section) => section.id === over.id,
            );

            // Log the current order and the changed indices
            console.log('Before reorder:');
            console.log(courseSections);
            console.log(
                'Dragged section (active):',
                active.id,
                'Index:',
                oldIndex,
            );
            console.log('Target section (over):', over.id, 'Index:', newIndex);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Reorder the sections array by swapping the active section with the target section
                const updatedSections = arrayMove(
                    courseSections,
                    oldIndex,
                    newIndex,
                );

                // Log the updated sections
                console.log('After reorder:');
                console.log(updatedSections);

                // Update the state with the new order but keep original `id`s intact
                setCourseSections(updatedSections);
            }
        }
    };

    // Function to render the course sections
    const renderCourseSections = () => {
        return courseSections.map((section, index) => {
            const lessonCount = section.lessons.length;
            const totalDuration = section.lessons.reduce(
                (acc, lesson) => acc + lesson.duration,
                0,
            );

            return (
                <SortableSection
                    key={section.id}
                    section={section}
                    index={index}
                    userType={userType}
                >
                    <CourseLesson
                        section={section}
                        index={index + 1}
                        lessonCount={lessonCount}
                        totalDuration={totalDuration}
                        userType={userType}
                        updateLesson={onEditLesson}
                        addLesson={onAddLesson}
                        deleteLesson={onDeleteLesson}
                        onDeleteSection={onDeleteSection}
                        onEditSectionTitle={onEditSectionTitle}
                    />
                </SortableSection>
            );
        });
    };

    return (
        // Only wrap in DndContext and SortableContext if userType is 'instructor'
        userType === 'instructor' ? (
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={courseSections.map((section) => section.id)}
                >
                    <div className='font-abhaya w-full bg-white mt-4'>
                        {renderCourseSections()}
                    </div>
                </SortableContext>
            </DndContext>
        ) : (
            // If the user is not an instructor, just render the course sections without drag-and-drop
            <div className='font-abhaya w-full bg-white mt-4'>
                {renderCourseSections()}
            </div>
        )
    );
};

export default CourseContentView;
