import {useState} from 'react';
import {IoCloseOutline} from 'react-icons/io5';

const EditSectionModal = ({section, onClose, onSubmit}) => {
    const [newTitle, setNewTitle] = useState(section.title);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            alert('Section title is required.');
            return;
        }

        onSubmit(newTitle);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-8 rounded-3xl w-1/3'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-3xl font-bold'>Edit Section Title</h3>
                    <button onClick={onClose} className='text-xl'>
                        <IoCloseOutline />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='mt-4'>
                    <label className='block text-lg font-medium text-gray-700'>
                        New Title
                    </label>
                    <input
                        type='text'
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya mt-2'
                    />
                    <button
                        type='submit'
                        className='w-full py-3 rounded-3xl bg-primary text-white text-lg active:scale-[.98] font-abhaya mt-8'
                    >
                        Save Title Section
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditSectionModal;
