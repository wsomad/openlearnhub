const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
    isSection,
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white p-5 rounded-md shadow-lg w-96'>
                <h2 className='text-2xl font-bold mb-4'>Confirm Delete</h2>
                <p className='mb-4'>
                    {`Are you sure you want to delete the ${
                        isSection ? 'section' : 'lesson'
                    }?`}
                </p>
                <p className='text-center'>
                    <strong>{itemTitle}</strong>
                </p>
                <div className='flex justify-end space-x-3 mt-6'>
                    <button
                        onClick={onClose}
                        className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className='bg-primary text-white px-4 py-2 rounded-md'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
