import { useEffect, useState } from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';

import { useUser } from '../../../hooks/useUser';
import { getUserById } from '../../../services/firestore/UserService';

interface InstructorRatingProps {
    instructorId: string;
    disabled?: boolean;
}

const InstructorRating = ({instructorId, disabled}: InstructorRatingProps) => {
    const {currentUser, rateInstructor} = useUser();
    const [rating, setRating] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [instructorRating, setInstructorRating] = useState<number | null>(
        null,
    );

    // Fetch instructor rating data directly without affecting Redux state
    useEffect(() => {
        const loadInstructorRating = async () => {
            try {
                const instructorData = await getUserById(instructorId);
                if (instructorData?.instructor?.averageRating) {
                    setInstructorRating(
                        instructorData.instructor.averageRating,
                    );
                }
            } catch (error) {
                console.error('Failed to fetch instructor rating:', error);
            }
        };

        if (instructorId) {
            loadInstructorRating();
        }
    }, [instructorId]);

    // Set initial rating from current user if they've rated before
    useEffect(() => {
        const userRating = currentUser?.instructor?.ratings?.[instructorId];
        if (userRating) {
            setRating(userRating);
            setIsSubmitted(true);
        }
    }, [currentUser, instructorId]);

    const handleRating = async (newRating: number) => {
        if (rating === newRating) {
            setRating(null);
            setIsSubmitted(false);
        } else {
            setRating(newRating);
            setIsSubmitted(false);
        }
    };

    const handleSubmit = async () => {
        if (rating) {
            await rateInstructor(instructorId, rating);
            setIsSubmitted(true);

            // Refresh instructor rating without affecting Redux state
            const updatedInstructor = await getUserById(instructorId);
            if (updatedInstructor?.instructor?.averageRating) {
                setInstructorRating(updatedInstructor.instructor.averageRating);
            }
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 mt-2'>
                <span className='font-medium'>Average Rating: </span>
                <div className='flex items-center gap-1'>
                    <span className='text-lg font-semibold text-gray-900'>
                        {instructorRating?.toFixed(1) || '0'}
                    </span>
                    <FaStar className='text-yellow w-5 h-5 ml-1 mb-1' />
                </div>
            </div>

            {!disabled && (
                <div className='flex items-center gap-3'>
                    <div className='flex gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRating(star)}
                                className='relative group p-1 hover:scale-110 transition-all duration-200'
                            >
                                <FaStar
                                    className={`text-2xl transition-colors duration-200 ${
                                        rating && star <= rating
                                            ? 'text-yellow'
                                            : 'text-gray group-hover:text-yellow'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {!isSubmitted && (
                        <button
                            onClick={handleSubmit}
                            className='ml-2 p-2 rounded-full bg-primary text-white hover:bg-green-100 transition-all duration-200'
                        >
                            <FaCheck className='w-4 h-4' />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default InstructorRating;
