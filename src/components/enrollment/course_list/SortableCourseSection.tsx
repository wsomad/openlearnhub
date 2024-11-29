import {GripVertical} from 'lucide-react';
import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Section} from '../../../types/section';
import {Lesson} from '../../../types/lesson';
import CourseLesson from './CourseLesson';
import {useUser} from '../../../hooks/useUser';

interface SortableCourseSectionProps {
    section: Section;
    index: number;
    canEdit: boolean;
    onDeleteSection: (section_id: string) => void;
    onEditSectionTitle: (section_id: string, new_title: string) => void;
    onAddLesson: (
        section_id: string,
        lesson: Omit<Lesson, 'lesson_id'>,
    ) => void;
    onEditLesson: (
        section_id: string,
        lesson_id: string,
        updatedLesson: Partial<Lesson>,
    ) => void;
    onDeleteLesson: (section_id: string, lesson_id: string) => void;
}

const SortableCourseSection: React.FC<SortableCourseSectionProps> = ({
    section,
    index,
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
    } = useSortable({
        id: section.section_id,
    });
    const {userRole} = useUser();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

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
                {canEdit && userRole === 'instructor' && <DragHandle />}
                <CourseLesson
                    section={section}
                    index={index}
                    lessonCount={section.lessons?.length || 0}
                    totalDuration={0}
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

export default SortableCourseSection;
