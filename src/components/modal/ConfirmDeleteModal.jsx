const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
    isSection,
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white rounded-3xl'>
                <h2 className='text-3xl font-bold'>Confirm Delete</h2>
                <p className='mb-4 mt-4 text-lg'>
                    {`Are you sure you want to delete ${
                        isSection
                            ? 'this section'
                            : `the following lesson${
                                  itemTitle ? ' "' + itemTitle + '"' : ''
                              }`
                    }?`}
                </p>
                <p className='text-center text-lg'>
                    {isSection ? (
                        <strong>{itemTitle}</strong> // Display section title
                    ) : (
                        <strong>Lesson {parseInt(itemTitle, 10) + 1}</strong> // Display lesson number (adjust for lesson 1 index)
                    )}
                </p>

                <div className='flex justify-end space-x-3 mt-6 text-lg'>
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
