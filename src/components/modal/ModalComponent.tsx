import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { Lesson } from '../../types/lesson';

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (lessonData: Partial<Lesson>) => void;
    initialData?: Lesson | null;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [lessonTitle, setLessonTitle] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [documentUrl, setDocumentUrl] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setLessonTitle(initialData.lesson_title || '');
            setDuration(initialData.lesson_duration?.toString() || '');
            setContent(initialData.lesson_content || '');
            setVideoUrl(initialData.lesson_videoUrl || '');
            setDocumentUrl(initialData.lesson_documentUrl || '');
        }
    }, [initialData]);

    const handleClose = (): void => {
        resetForm();
        onClose();
    };

    const resetForm = (): void => {
        setLessonTitle('');
        setDuration('');
        setContent('');
        setVideoUrl('');
        setDocumentUrl('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!lessonTitle || !duration) {
            alert('Title and Duration are required fields.');
            return;
        }

        const lessonData: Partial<Lesson> = {
            lesson_title: lessonTitle,
            lesson_duration: parseInt(duration, 10),
            lesson_content: content,
            lesson_videoUrl: videoUrl || undefined,
            lesson_documentUrl: documentUrl || undefined,
        };

        onSubmit(lessonData);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white rounded-3xl'>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            {initialData
                                ? 'Edit Lesson Content'
                                : 'Add Lesson Content'}
                        </h1>
                        <button
                            type='button'
                            className='text-3xl w-16 h-16 flex items-center justify-center'
                            onClick={handleClose}
                            aria-label='Close modal'
                        >
                            <IoCloseOutline />
                        </button>
                    </div>

                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='lessonTitle'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Lesson Title*
                            </label>
                            <input
                                id='lessonTitle'
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='text'
                                placeholder='Enter lesson title'
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='duration'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Duration (minutes)*
                            </label>
                            <input
                                id='duration'
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='number'
                                min='1'
                                placeholder='Enter duration in minutes'
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='content'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Lesson Content
                            </label>
                            <textarea
                                id='content'
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                rows={4}
                                placeholder='Enter lesson content or description'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='videoUrl'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Video URL
                            </label>
                            <input
                                id='videoUrl'
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='url'
                                placeholder='Enter video URL'
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='documentUrl'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Document URL
                            </label>
                            <input
                                id='documentUrl'
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='url'
                                placeholder='Enter document URL'
                                value={documentUrl}
                                onChange={(e) => setDocumentUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='mt-8'>
                        <button
                            type='submit'
                            className='w-full py-3 rounded-3xl bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                        >
                            {initialData ? 'Save Changes' : 'Add Lesson'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalComponent;
