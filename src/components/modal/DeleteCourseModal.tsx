import React from "react";

interface DeleteModalProps {
    isOpen: boolean;
    courseTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteCourseModal: React.FC<DeleteModalProps> = ({
    isOpen,
    courseTitle,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 shadow-lg w-[90%] max-w-md font-abhaya">
                <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                <p className="text-lg">Are you sure you want to delete the course '<span className="text-secondary font-bold">{courseTitle}</span>'?</p>
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-10 py-2 bg-primary hover:bg-red-700 text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCourseModal;
