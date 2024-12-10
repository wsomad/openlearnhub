import { GripVertical } from 'lucide-react';
import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useUser } from '../../../hooks/useUser';
import { LessonBase } from '../../../types/lesson';
import { Section } from '../../../types/section';
import Lesson from '../testingLesson/Lesson';

interface SortableCourseSectionProps {
    section: Section;
    isDraft?: boolean;
    index: number;
    canEdit: boolean;
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

const SortableCourseSection: React.FC<SortableCourseSectionProps> = ({
    section,
    isDraft,
    index,
    canEdit,
    onDeleteSection,
    onEditSectionTitle,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
    onLessonSelect,
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
                <Lesson
                    key={section.section_id}
                    isDraft={isDraft}
                    section={section}
                    index={index}
                    canEdit={userRole === 'instructor'}
                    onLessonSelect={onLessonSelect}
                    onEditSectionTitle={onEditSectionTitle}
                    onDeleteSection={onDeleteSection}
                    onAddLesson={onAddLesson}
                    onEditLesson={onEditLesson}
                    onDeleteLesson={onDeleteLesson}
                />
            </div>
        </div>
    );
};

export default SortableCourseSection;
