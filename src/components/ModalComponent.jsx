import {useState, useEffect} from 'react';
import {IoCloseOutline} from 'react-icons/io5';

const ModalComponent = ({modalType, lessonData, onClose}) => {
    const [titleLesson, setTitleLesson] = useState('');
    const [linkContent, setLinkContent] = useState('');
    const [uploadContent, setUploadContent] = useState(null);

    // Initialize state with lessonData when modalType is 'edit'
    useEffect(() => {
        if (modalType === 'edit' && lessonData) {
            setTitleLesson(lessonData.title);
            setLinkContent(lessonData.link);
            setUploadContent(lessonData.uploadContent || null); // Handle if there's no previous upload
        }
    }, [modalType, lessonData]);

    // Conditional title and button based on modalType
    const isEdit = modalType === 'edit';
    const modalTitle = isEdit ? 'Edit Lesson Content' : 'Add Lesson Content';
    const buttonLabel = isEdit ? 'Edit Content' : 'Add Content';

    const handleClose = () => {
        if (onClose) onClose(); // Callback to close modal if needed
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white rounded-3xl'>
                <form className='w-full'>
                    {/* Form title */}
                    <div className='flex items-center justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            {modalTitle}
                        </h1>
                        <button
                            className='text-3xl w-16 h-16 flex items-center justify-center'
                            onClick={handleClose}
                        >
                            <IoCloseOutline />
                        </button>
                    </div>

                    {/* Title Lesson Input */}
                    <div className='space-y-4'>
                        <div>
                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                Title Lesson
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='text'
                                placeholder='Title Lesson'
                                value={titleLesson}
                                onChange={(e) => setTitleLesson(e.target.value)}
                            />
                        </div>

                        {/* Link Content Input */}
                        <div>
                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                Link Content
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='text'
                                placeholder='Link Content'
                                value={linkContent}
                                onChange={(e) => setLinkContent(e.target.value)}
                            />
                        </div>

                        {/* Upload Content Input */}
                        <div>
                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                Upload Content
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='file'
                                accept='.pdf,video/*'
                                onChange={(e) =>
                                    setUploadContent(e.target.files[0])
                                }
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='mt-8'>
                        <button
                            className='w-full py-3 rounded-3xl bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                            type='submit'
                        >
                            {buttonLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalComponent;
