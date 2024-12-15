import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useQuestions } from '../../../hooks/useQuestions';
import { LessonBase } from '../../../types/lesson';
import DocumentPreview from './DocumentPreview';
import VideoPreview from './VideoPreview';

interface LessonModalProps {
    sectionId: string;
    isDraft?: boolean;
    onClose: () => void;
    lessonToEdit?: LessonBase;
    onSubmit: (lessonData: LessonBase) => Promise<void>;
}

const LessonModal: React.FC<LessonModalProps> = ({
    sectionId,
    isDraft,
    onClose,
    lessonToEdit,
    onSubmit,
}) => {
    const {selectedCourse} = useCourses();
    const {createLessons, updateLesson, fetchAllLessons} = useLessons();
    const {
        quizQuestions,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        initializeQuizQuestions,
        clearQuestionsState,
    } = useQuestions();
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonType, setLessonType] = useState<'document' | 'video' | 'quiz'>(
        'document',
    );

    // Document specific state
    const [documentUrl, setDocumentUrl] = useState('');

    // Video specific state
    const [videoUrl, setVideoUrl] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);

    // Quiz specific state
    const [quizTitle, setQuizTitle] = useState('');

    useEffect(() => {
        if (lessonToEdit) {
            setLessonTitle(lessonToEdit.lesson_title);
            setLessonType(lessonToEdit.lesson_type);

            switch (lessonToEdit.lesson_type) {
                case 'document':
                    setDocumentUrl(lessonToEdit.document_url);
                    break;
                case 'video':
                    setVideoUrl(lessonToEdit.video_url);
                    setVideoDuration(lessonToEdit.video_duration);
                    break;
                case 'quiz':
                    setQuizTitle(lessonToEdit.quiz.quiz_title);
                    initializeQuizQuestions(lessonToEdit.quiz.questions);
                    break;
            }
        } else {
            // Reset states when creating new lesson
            setLessonTitle('');
            setDocumentUrl('');
            setVideoUrl('');
            setVideoDuration(0);
            setQuizTitle('');
            clearQuestionsState(); // Clear quiz questions
        }

        // Cleanup when component unmounts
        return () => {
            if (lessonType === 'quiz') {
                clearQuestionsState();
            }
        };
    }, [lessonToEdit]);

    useEffect(() => {
        if (lessonType === 'quiz' && !lessonToEdit) {
            clearQuestionsState(); // Clear quiz questions when switching to quiz type
            setQuizTitle(''); // Reset quiz title
        }
    }, [lessonType]);

    const renderLessonTypeInputs = () => {
        switch (lessonType) {
            case 'document':
                return (
                    <div>
                        <label className='block mb-1'>Document URL</label>
                        <input
                            type='url'
                            value={documentUrl}
                            onChange={(e) => setDocumentUrl(e.target.value)}
                            className='w-full border p-2'
                            placeholder='Enter document URL'
                        />
                    </div>
                );

            case 'video':
                return (
                    <div>
                        <label className='block mb-1'>Video URL</label>
                        <input
                            type='url'
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className='w-full border p-2'
                            placeholder='Enter YouTube URL'
                        />
                        {videoDuration > 0 && (
                            <p className='text-sm text-gray-600 mt-1'>
                                Duration: {videoDuration} minutes
                            </p>
                        )}
                    </div>
                );

            case 'quiz':
                return null; // Quiz form is rendered in the right panel
        }
    };

    const renderQuizForm = () => {
        return (
            <div className='space-y-6'>
                {/* Quiz Title Section - Matching Lesson Title style */}
                <div className='space-y-4'>
                    <div>
                        <label className='block mb-1 font-medium'>
                            Quiz Title
                        </label>
                        <input
                            type='text'
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            className='w-full border p-2'
                            placeholder='Enter quiz title'
                        />
                    </div>
                </div>

                {/* Questions List */}
                <div className='space-y-4'>
                    {quizQuestions.map((question, qIndex) => (
                        <div
                            key={question.question_id}
                            className='bg-white p-6 border shadow-sm relative group'
                        >
                            {/* Question Number Badge */}
                            <div className='absolute -top-3 -left-3 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-medium shadow-sm'>
                                {qIndex + 1}
                            </div>

                            <div className='space-y-4'>
                                {/* Question Text with separate delete button */}
                                <div className='flex items-start justify-between gap-4 mb-4'>
                                    <input
                                        type='text'
                                        value={question.question_text}
                                        onChange={(e) =>
                                            updateQuestion(
                                                qIndex,
                                                'question_text',
                                                e.target.value,
                                            )
                                        }
                                        className='flex-1 w-full border p-2'
                                        placeholder='Enter your question'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => deleteQuestion(qIndex)}
                                        className='p-2 bg-delete text-white rounded-md'
                                        title='Delete question'
                                    >
                                        <Trash2 className='w-5 h-5' />
                                    </button>
                                </div>

                                {/* Rest of the question form remains the same */}
                                <div className='grid grid-cols-2 gap-3'>
                                    {question.question_options.map(
                                        (option, oIndex) => (
                                            <div
                                                key={oIndex}
                                                className={`relative rounded-lg border ${
                                                    question.question_correct_answer_index ===
                                                    oIndex
                                                        ? 'border-add bg-add'
                                                        : 'border-black'
                                                }`}
                                            >
                                                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                                    {String.fromCharCode(
                                                        65 + oIndex,
                                                    )}
                                                    .
                                                </div>
                                                <input
                                                    type='text'
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [
                                                            ...question.question_options,
                                                        ];
                                                        newOptions[oIndex] =
                                                            e.target.value;
                                                        updateQuestion(
                                                            qIndex,
                                                            'question_options',
                                                            newOptions,
                                                        );
                                                    }}
                                                    className='w-full pl-8 pr-3 py-2 border-0 bg-transparent focus:ring-0'
                                                    placeholder={`Option ${
                                                        oIndex + 1
                                                    }`}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>

                                <div className='grid grid-cols-2 gap-4 pt-4'>
                                    <div>
                                        <label className='block mb-1 font-medium'>
                                            Correct Answer
                                        </label>
                                        <select
                                            value={
                                                question.question_correct_answer_index
                                            }
                                            onChange={(e) =>
                                                updateQuestion(
                                                    qIndex,
                                                    'question_correct_answer_index',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className='w-full border p-2'
                                        >
                                            {question.question_options.map(
                                                (_, index) => (
                                                    <option
                                                        key={index}
                                                        value={index}
                                                    >
                                                        Option{' '}
                                                        {String.fromCharCode(
                                                            65 + index,
                                                        )}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block mb-1 font-medium'>
                                            Explanation
                                        </label>
                                        <textarea
                                            value={
                                                question.question_answer_explanation ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                updateQuestion(
                                                    qIndex,
                                                    'question_answer_explanation',
                                                    e.target.value,
                                                )
                                            }
                                            rows={1}
                                            className='w-full border p-2'
                                            placeholder='Why is this the correct answer?'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Question Button */}
                <button
                    type='button'
                    onClick={createQuestion}
                    className='w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2'
                >
                    <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                    </svg>
                    Add New Question
                </button>
            </div>
        );
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            let lessonData: LessonBase;
            // Generate ID upfront to ensure it's never empty
            const uniqueId = isDraft
                ? `draft-${sectionId}-${Date.now()}-${Math.random()
                      .toString(36)
                      .substring(2, 9)}`
                : `temp-${sectionId}-${Date.now()}-${Math.random()
                      .toString(36)
                      .substring(2, 9)}`;

            // Always use either the existing ID or the new unique one
            const lessonId = lessonToEdit?.lesson_id || uniqueId;

            if (lessonType === 'document') {
                lessonData = {
                    lesson_id: lessonId,
                    section_id: sectionId,
                    lesson_title: lessonTitle,
                    lesson_type: 'document',
                    lesson_order: lessonToEdit?.lesson_order || 0,
                    document_url: documentUrl,
                };
            } else if (lessonType === 'video') {
                lessonData = {
                    lesson_id: lessonId,
                    section_id: sectionId,
                    lesson_title: lessonTitle,
                    lesson_type: 'video',
                    lesson_order: lessonToEdit?.lesson_order || 0,
                    video_url: videoUrl,
                    video_duration: videoDuration,
                };
            } else {
                // Quiz type - keep as is since it's working
                const quiz_id =
                    lessonToEdit?.lesson_type === 'quiz'
                        ? lessonToEdit.quiz.quiz_id
                        : isDraft
                        ? `draft-quiz-${Date.now()}`
                        : `quiz-${Date.now()}`;

                lessonData = {
                    lesson_id: lessonId,
                    section_id: sectionId,
                    lesson_title: lessonTitle,
                    lesson_type: 'quiz',
                    lesson_order: lessonToEdit?.lesson_order || 0,
                    quiz: {
                        quiz_id,
                        quiz_title: quizTitle,
                        quiz_number_of_questions: quizQuestions.length,
                        questions: quizQuestions,
                    },
                };
            }

            console.log('=== LessonModal: Submitting lesson ===', lessonData);

            try {
                await onSubmit(lessonData);
                console.log(
                    '=== LessonModal: Lesson submitted successfully ===',
                );
                onClose();
            } catch (error) {
                console.error('Failed to submit lesson:', error);
            }
        } catch (error) {
            console.error('Failed to create lesson data:', error);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-md w-[1000px] max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='p-6 border-b'>
                    <h2 className='text-xl font-bold'>
                        {lessonToEdit ? 'Edit Lesson' : 'Add New Lesson'}
                    </h2>
                </div>

                {/* Content */}
                <div className='flex-1 min-h-0 flex'>
                    {/* Left Panel - Basic Info */}
                    <div className='w-1/3 p-6 border-r overflow-y-auto'>
                        <div className='space-y-6'>
                            {/* Basic Info */}
                            <div className='space-y-4'>
                                <div>
                                    <label className='block mb-1 font-medium'>
                                        Lesson Title
                                    </label>
                                    <input
                                        type='text'
                                        value={lessonTitle}
                                        onChange={(e) =>
                                            setLessonTitle(e.target.value)
                                        }
                                        className='w-full border p-2'
                                        placeholder='Enter lesson title'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='block mb-1 font-medium'>
                                        Lesson Type
                                    </label>
                                    <select
                                        value={lessonType}
                                        onChange={(e) =>
                                            setLessonType(e.target.value as any)
                                        }
                                        className='w-full border p-2'
                                        disabled={!!lessonToEdit}
                                    >
                                        <option value='document'>
                                            Document
                                        </option>
                                        <option value='video'>Video</option>
                                        <option value='quiz'>Quiz</option>
                                    </select>
                                </div>
                            </div>

                            {/* Type-specific inputs */}
                            {lessonType !== 'quiz' && renderLessonTypeInputs()}
                        </div>
                    </div>

                    {/* Right Panel - Preview/Quiz Form */}
                    <div className='w-2/3 p-6 overflow-y-auto'>
                        {lessonType === 'video' && (
                            <VideoPreview
                                url={videoUrl}
                                onDurationChange={setVideoDuration}
                                height='h-[400px]'
                            />
                        )}
                        {lessonType === 'document' && (
                            <DocumentPreview
                                url={documentUrl}
                                height='h-[400px]'
                            />
                        )}
                        {lessonType === 'quiz' && renderQuizForm()}
                    </div>
                </div>

                {/* Footer */}
                <div className='p-6 border-t'>
                    <div className='flex justify-end space-x-2'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 border rounded hover:bg-gray-50'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
                        >
                            {lessonToEdit ? 'Save Changes' : 'Add Lesson'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonModal;
