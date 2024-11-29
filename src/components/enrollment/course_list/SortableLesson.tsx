import {GripVertical} from 'lucide-react';
import React from 'react';
import {MdDeleteOutline, MdEditNote} from 'react-icons/md';

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import {
    DocumentLesson,
    LessonBase,
    QuizLesson,
    VideoLesson,
} from '../../../types/lesson';
import {useUser} from '../../../hooks/useUser';

interface SortableLessonProps {
    lesson: LessonBase;
    lessonIndex: number;
    canEdit: boolean;
    onOpenModal: (lesson: LessonBase) => void;
    onDeleteModal: (lessonId: string, e: React.MouseEvent) => void;
}

const SortableLesson: React.FC<SortableLessonProps> = ({
    lesson,
    lessonIndex,
    canEdit,
    onOpenModal,
    onDeleteModal,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: lesson.lesson_id});
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
            style={{left: '0px'}}
        >
            <GripVertical size={16} />
        </div>
    );

    const getLessonDuration = (lesson: LessonBase) => {
        if (lesson.lesson_type === 'video') {
            const videoLesson = lesson as VideoLesson;
            const minutes = Math.floor(videoLesson.video_duration / 60);
            const seconds = videoLesson.video_duration % 60;
            if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            }
            return `${seconds} seconds`;
        }
        return lesson.lesson_type === 'document' ? 'Document' : 'Quiz';
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div className='relative cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 rounded-md'>
                <div className='relative flex items-start'>
                    {canEdit && userRole === 'instructor' && <DragHandle />}
                    <div className='border-secondary text-secondary absolute text-2xl w-10 h-10 rounded-full border-4 bg-white flex items-center justify-center mr-4 ml-8 mt-1'>
                        {lessonIndex + 1}
                    </div>
                    <div className='flex flex-col text-md pl-16 ml-8'>
                        <span className='font-bold'>{lesson.lesson_title}</span>
                        <div className='flex items-center text-gray-500 space-x-2'>
                            <span>{getLessonDuration(lesson)}</span>
                            {lesson.lesson_type === 'document' && (
                                <span className='flex items-center'>
                                    •{' '}
                                    {(lesson as DocumentLesson).document_url
                                        ? 'URL'
                                        : 'File'}
                                </span>
                            )}
                            {lesson.lesson_type === 'quiz' && (
                                <span className='flex items-center'>
                                    •{' '}
                                    {
                                        (lesson as QuizLesson).quiz
                                            .quiz_number_of_questions
                                    }{' '}
                                    questions
                                </span>
                            )}
                        </div>
                    </div>
                    {canEdit && userRole === 'instructor' && (
                        <div className='ml-auto flex space-x-2 mr-2.5 mt-3'>
                            <button
                                onClick={() => onOpenModal(lesson)}
                                className='bg-edit text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-edit-dark transition-all duration-300'
                                aria-label={`Edit lesson: ${lesson.lesson_title}`}
                            >
                                <MdEditNote className='text-lg' />
                            </button>
                            <button
                                onClick={(e) =>
                                    onDeleteModal(lesson.lesson_id, e)
                                }
                                className='bg-delete text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-delete-dark transition-all duration-300'
                                aria-label={`Delete lesson: ${lesson.lesson_title}`}
                            >
                                <MdDeleteOutline className='text-lg' />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SortableLesson;
