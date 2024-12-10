import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (e?: React.MouseEvent) => void;
    itemTitle: string;
    itemType: 'lesson' | 'section';
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
    itemType,
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg w-96'>
                <h3 className='text-lg font-bold mb-4'>Delete {itemType}</h3>
                <p className='mb-6'>
                    Are you sure you want to delete "{itemTitle}"? This action
                    cannot be undone.
                </p>
                <div className='flex justify-end space-x-2'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 border rounded hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            onConfirm(e);
                            onClose(); // Ensure modal closes
                        }}
                        className='px-4 py-2 bg-delete text-white rounded hover:bg-red-600'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
