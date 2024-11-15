import {useState, useEffect} from 'react';
import {IoCloseOutline} from 'react-icons/io5';

const EditSectionModal = ({isOpen, onClose, onSubmit, initialTitle}) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        setTitle(initialTitle || '');
    }, [initialTitle]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Title is required.');
            return;
        }
        onSubmit(title);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white rounded-3xl'>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            Edit Section Title
                        </h1>
                        <button
                            type='button'
                            className='text-3xl w-16 h-16 flex items-center justify-center'
                            onClick={onClose}
                        >
                            <IoCloseOutline />
                        </button>
                    </div>

                    <div className='space-y-4'>
                        <div>
                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                Section Title
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='text'
                                placeholder='Section Title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='mt-8'>
                        <button
                            className='w-full py-3 rounded-3xl bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                            type='submit'
                        >
                            Save Section Title
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSectionModal;
