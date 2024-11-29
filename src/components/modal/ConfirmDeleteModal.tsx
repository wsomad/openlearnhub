import {IoCloseOutline} from 'react-icons/io5';
import {useSections} from '../../hooks/useSections';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (section_id: string) => void;
    itemTitle: string;
    isSection: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
    isSection,
}) => {
    const {selectedSection} = useSections();
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white rounded-3xl'>
                <div className='w-full'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            Confirm Delete
                        </h1>
                        <button
                            type='button'
                            className='text-3xl w-16 h-16 flex items-center justify-center'
                            onClick={onClose}
                            aria-label='Close modal'
                        >
                            <IoCloseOutline />
                        </button>
                    </div>

                    <div className='mt-4'>
                        <p className='font-abhaya text-lg'>
                            Are you sure you want to delete this{' '}
                            {isSection ? 'section' : 'lesson'}
                            {itemTitle ? `: "${itemTitle}"` : ''}?
                        </p>
                        <p className='font-abhaya text-gray-500 mt-2'>
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className='mt-8 flex space-x-4'>
                        <button
                            className='flex-1 py-3 rounded-3xl bg-gray-200 text-gray-700 text-lg active:scale-[.98] font-abhaya'
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className='flex-1 py-3 rounded-3xl bg-delete text-white text-lg active:scale-[.98] font-abhaya'
                            onClick={() =>
                                onConfirm(selectedSection?.section_id || '')
                            }
                            aria-label={`Confirm delete ${
                                isSection ? 'section' : 'lesson'
                            }`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
