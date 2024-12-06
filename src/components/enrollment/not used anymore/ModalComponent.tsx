import { useEffect, useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import {
	DocumentLesson,
	LessonBase,
	QuizLesson,
	VideoLesson,
} from '../../../types/lesson';
import { Quiz } from '../../../types/quiz';
import QuizPanel from './QuizPanel';

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        lessonData: Omit<
            DocumentLesson | VideoLesson | QuizLesson,
            'lesson_id' | 'section_id' | 'lesson_order'
        >,
    ) => void;
    initialData?: LessonBase | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ModalComponent: React.FC<ModalComponentProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [lessonTitle, setLessonTitle] = useState<string>('');
    const [lessonType, setLessonType] = useState<'document' | 'video' | 'quiz'>(
        'document',
    );
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [documentUrl, setDocumentUrl] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
    const [uploadError, setUploadError] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<Quiz>({
        quiz_id: '',
        quiz_title: '',
        quiz_number_of_questions: 0,
        questions: [],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    interface NewDocumentLesson
        extends Omit<
            DocumentLesson,
            'lesson_id' | 'section_id' | 'lesson_order'
        > {}
    interface NewVideoLesson
        extends Omit<
            VideoLesson,
            'lesson_id' | 'section_id' | 'lesson_order'
        > {}
    interface NewQuizLesson
        extends Omit<QuizLesson, 'lesson_id' | 'section_id' | 'lesson_order'> {}

    const validateFile = (file: File): boolean => {
        setUploadError('');

        if (file.size > MAX_FILE_SIZE) {
            setUploadError('File size exceeds 10MB limit');
            return false;
        }

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];

        if (!allowedTypes.includes(file.type)) {
            setUploadError(
                'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files',
            );
            return false;
        }

        return true;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setUploadedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setFilePreviewUrl(fileUrl);
            setDocumentUrl(fileUrl);
            setUploadError('');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            setUploadedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setFilePreviewUrl(fileUrl);
            setDocumentUrl(fileUrl);
            setUploadError('');
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const processVideoUrl = (url: string): string => {
        try {
            // Handle YouTube URLs
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('youtu.be')
                    ? url.split('/').pop()
                    : new URLSearchParams(new URL(url).search).get('v');
                return `https://www.youtube.com/embed/${videoId}`;
            }
            // Handle Vimeo URLs
            if (url.includes('vimeo.com')) {
                const videoId = url.split('/').pop();
                return `https://player.vimeo.com/video/${videoId}`;
            }
        } catch (error) {
            console.error('Error processing video URL:', error);
        }
        return url;
    };

    useEffect(() => {
        if (initialData) {
            setLessonTitle(initialData.lesson_title);
            setLessonType(initialData.lesson_type);

            if (initialData.lesson_type === 'document') {
                setDocumentUrl((initialData as DocumentLesson).document_url);
            } else if (initialData.lesson_type === 'video') {
                setVideoUrl((initialData as VideoLesson).video_url);
                setVideoDuration((initialData as VideoLesson).video_duration);
            } else if (initialData.lesson_type === 'quiz') {
                setQuiz((initialData as QuizLesson).quiz);
            }
        }
    }, [initialData]);

    // Cleanup effect for file preview URLs
    useEffect(() => {
        return () => {
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, [filePreviewUrl]);

    const handleClose = (): void => {
        resetForm();
        onClose();
    };

    const resetForm = (): void => {
        setLessonTitle('');
        setLessonType('document');
        setVideoUrl('');
        setVideoDuration(0);
        setDocumentUrl('');
        setUploadedFile(null);
        setFilePreviewUrl('');
        setUploadError('');
        setQuiz({
            quiz_id: '',
            quiz_title: '',
            quiz_number_of_questions: 0,
            questions: [],
        });
    };

    const PreviewPanel = () => {
        if (lessonType === 'video') {
            return (
                <div className='h-full'>
                    <h3 className='font-abhaya text-lg font-medium mb-2'>
                        Video Preview
                    </h3>
                    {videoUrl ? (
                        <div className='bg-black overflow-hidden aspect-video'>
                            <iframe
                                src={processVideoUrl(videoUrl)}
                                className='w-full h-full'
                                allowFullScreen
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                title='Video preview'
                            />
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-64 bg-gray-100 rounded-lg'>
                            <p className='text-gray-500'>
                                Enter a video URL to see preview
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        if (lessonType === 'document') {
            if (!uploadedFile && !documentUrl) {
                return (
                    <div
                        className={`flex flex-col items-center justify-center h-full border-2 border-dashed transition-colors ${
                            isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 bg-gray-50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <FiUploadCloud className='text-4xl text-gray-400 mb-4' />
                        <p className='text-gray-600 mb-2'>
                            Drag and drop your document here
                        </p>
                        <p className='text-gray-400 text-sm mb-4'>or</p>
                        <button
                            type='button'
                            onClick={triggerFileUpload}
                            className='px-4 py-2 bg-secondary flex items-center gap-2 hover:bg-gray-300 transition-colors text-white'
                        >
                            <FiUploadCloud className='text-xl' />
                            Upload File
                        </button>
                        <p className='text-sm text-gray-400 mt-4'>
                            Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                        </p>
                    </div>
                );
            }

            return (
                <div className='h-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-abhaya text-lg font-medium'>
                            Document Preview
                        </h3>
                        <button
                            type='button'
                            onClick={triggerFileUpload}
                            className='px-3 py-1.5 bg-gray-200 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-300 transition-colors'
                        >
                            <FiUploadCloud />
                            Change File
                        </button>
                    </div>

                    <div className='bg-white rounded-xl overflow-hidden h-[500px] relative'>
                        {uploadedFile ? (
                            uploadedFile.type === 'application/pdf' ? (
                                <object
                                    data={filePreviewUrl}
                                    type='application/pdf'
                                    className='w-full h-full'
                                >
                                    <p>PDF preview not available</p>
                                </object>
                            ) : (
                                <div className='flex flex-col items-center justify-center h-full p-4'>
                                    <div className='p-6 bg-gray-50 rounded-xl text-center'>
                                        <p className='text-gray-600 font-medium mb-2'>
                                            {uploadedFile.name}
                                        </p>
                                        <p className='text-gray-400 text-sm'>
                                            {(
                                                uploadedFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{' '}
                                            MB
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : documentUrl ? (
                            <object
                                data={documentUrl}
                                type='application/pdf'
                                className='w-full h-full'
                            >
                                <p>Document preview not available</p>
                            </object>
                        ) : null}
                    </div>
                </div>
            );
        }

        return (
            <div className='flex items-center justify-center h-full bg-gray-50 rounded-3xl'>
                <p className='text-gray-400'>No preview available</p>
            </div>
        );
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        // Important: Prevent form submission first thing
        e.preventDefault();
        e.stopPropagation();

        if (!lessonTitle) {
            alert('Title is required.');
            return;
        }

        try {
            let lessonData: NewDocumentLesson | NewVideoLesson | NewQuizLesson;

            switch (lessonType) {
                case 'video':
                    if (!videoUrl) {
                        alert('Video URL is required.');
                        return;
                    }
                    lessonData = {
                        lesson_title: lessonTitle,
                        lesson_type: 'video',
                        video_url: processVideoUrl(videoUrl),
                        video_duration: videoDuration,
                    };
                    break;

                case 'document':
                    if (!documentUrl && !uploadedFile) {
                        alert(
                            'Please provide a document URL or upload a file.',
                        );
                        return;
                    }
                    lessonData = {
                        lesson_title: lessonTitle,
                        lesson_type: 'document',
                        document_url: documentUrl,
                    };
                    break;

                case 'quiz':
                    lessonData = {
                        lesson_title: lessonTitle,
                        lesson_type: 'quiz',
                        quiz: quiz,
                    };
                    break;

                default:
                    throw new Error('Invalid lesson type');
            }

            console.log('Submitting lesson:', lessonData);

            // Call onSubmit and wait for it to complete
            await onSubmit(lessonData);

            console.log('Lesson submitted successfully');
            handleClose();
        } catch (error) {
            console.error('Error submitting lesson:', error);
            // Handle the error, e.g., show an error message in the UI
            alert('Failed to create lesson. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-[90%] h-[80vh] p-6 bg-white'>
                <div className='flex h-full gap-6'>
                    {/* Form Section */}
                    <div className='w-1/2 overflow-y-auto'>
                        <div className='flex items-center justify-between mb-4'>
                            <h1 className='font-abhaya text-3xl font-bold'>
                                {initialData
                                    ? 'Edit Lesson Content'
                                    : 'Add Lesson Content'}
                            </h1>
                            <button
                                type='button'
                                className='text-3xl w-16 h-16 flex items-center justify-end'
                                onClick={handleClose}
                                aria-label='Close modal'
                            >
                                <IoCloseOutline />
                            </button>
                        </div>

                        <div className='w-full'>
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Lesson Title *
                                    </label>
                                    <input
                                        className='w-full border border-gray p-3 bg-transparent font-abhaya focus:ring-primary'
                                        type='text'
                                        value={lessonTitle}
                                        onChange={(e) =>
                                            setLessonTitle(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Lesson Type *
                                    </label>
                                    <select
                                        className='w-full border border-gray p-3 bg-transparent font-abhaya focus:ring-primary'
                                        value={lessonType}
                                        onChange={(e) => {
                                            setLessonType(
                                                e.target.value as
                                                    | 'document'
                                                    | 'video'
                                                    | 'quiz',
                                            );
                                            setUploadedFile(null);
                                            setFilePreviewUrl('');
                                            setDocumentUrl('');
                                            setVideoUrl('');
                                        }}
                                        required
                                    >
                                        <option value='document'>
                                            Document
                                        </option>
                                        <option value='video'>Video</option>
                                        <option value='quiz'>Quiz</option>
                                    </select>
                                </div>

                                {lessonType === 'document' && (
                                    <div>
                                        <label className='font-abhaya text-lg font-medium mb-1 block'>
                                            Document *
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type='file'
                                            className='hidden'
                                            onChange={handleFileUpload}
                                            accept='.pdf,.doc,.docx,.txt'
                                        />
                                        <div className='space-y-2'>
                                            {!uploadedFile && (
                                                <input
                                                    className='w-full border border-gray p-3 bg-transparent font-abhaya focus:ring-primary'
                                                    type='url'
                                                    placeholder='Document URL'
                                                    value={documentUrl}
                                                    onChange={(e) =>
                                                        setDocumentUrl(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {uploadError && (
                                                <p className='text-red-500 text-sm'>
                                                    {uploadError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {lessonType === 'video' && (
                                    <>
                                        <div>
                                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                                Video URL *
                                            </label>
                                            <input
                                                className='w-full border border-gray p-3 bg-transparent font-abhaya focus:ring-primary'
                                                type='url'
                                                value={videoUrl}
                                                onChange={(e) =>
                                                    setVideoUrl(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                                Duration (minutes) *
                                            </label>
                                            <input
                                                className='w-full border border-gray p-3 bg-transparent font-abhaya'
                                                type='number'
                                                min='1'
                                                value={videoDuration}
                                                onChange={(e) =>
                                                    setVideoDuration(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {lessonType === 'quiz' && <div></div>}

                                <div className='mt-8'>
                                    <button
                                        type='submit'
                                        className='w-full py-3 bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                                    >
                                        {initialData
                                            ? 'Save Changes'
                                            : 'Add Lesson'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className='w-1/2 bg-gray-50 p-6'>
                        {lessonType === 'quiz' && (
                            <QuizPanel quiz={quiz} setQuiz={setQuiz} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
