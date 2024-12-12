import { X } from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // To handle navigation
import { toast } from 'react-toastify';

import { useUser } from '../hooks/useUser';
import { Instructor, SpecializationArea } from '../types/instructor';
import { User } from '../types/user';

const InstructorAuthComponent: React.FC = () => {
    const {currentUser, updateUser} = useUser();
    const navigate = useNavigate();

    const [instructor, setInstructor] = useState<Instructor>({
        profile_summary: '',
        specialization_area: [],
        years_of_experience: 0,
        total_courses_created: 0,
        rating: 1,
        social_links: {github: '', linkedin: ''},
    });

    // Redirect if user already has registered
    React.useEffect(() => {
        if (currentUser?.instructor?.hasRegister) {
            navigate('/instructor/dashboard');
        }
    }, [currentUser, navigate]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const {name, value} = e.target;
        setInstructor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSpecializationChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const selectedValues = Array.from(
            event.target.selectedOptions,
            (option) => option.value,
        ) as SpecializationArea[];
        setInstructor((prevState) => ({
            ...prevState,
            specialization_area: selectedValues || [],
        }));
    };

    const handleRemoveSpecialization = (specialization: string) => {
        setInstructor((prevState) => ({
            ...prevState,
            specialization_area:
                prevState.specialization_area?.filter(
                    (item) => item !== specialization,
                ) || [],
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const defaultInstructorProfile = {
            instructor,
            'instructor.hasRegister': true, // Update the registration status
        };

        try {
            if (currentUser?.uid) {
                await updateUser(currentUser.uid, {
                    role: 'instructor',
                    ...defaultInstructorProfile,
                } as Partial<User>);
                toast.success('Successfully registered as an instructor!');
                navigate('/instructor/dashboard'); // Navigate to the instructor dashboard
            }
        } catch (error) {
            toast.error(
                'Failed to create instructor profile. Please try again.',
            );
            console.error('Error during instructor sign-up:', error);
        }
    };

    return (
        <div className='min-h-screen relative flex flex-col items-center justify-center bg-white p-4'>
            <div className='absolute top-4 left-8 font-abhaya'>
                <h1 className='text-2xl font-bold'>
                    <span className='text-primary'>OpenLearn</span>
                    <span className='text-tertiary'>Hub.</span>
                </h1>
            </div>

            <div className='w-full max-w-lg bg-white p-8 rounded-lg'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <h2 className='font-abhaya text-4xl font-bold text-center mb-4'>
                        Instructor Registration
                    </h2>

                    <div className='space-y-4'>
                        <div>
                            <label className='font-abhaya text-lg font-bold mb-1 block'>
                                Email
                            </label>
                            <input
                                className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary rounded'
                                type='email'
                                value={currentUser?.email}
                                disabled
                            />
                        </div>

                        <div>
                            <label className='font-abhaya text-lg font-bold mb-1 block'>
                                Profile Summary
                            </label>
                            <textarea
                                name='profile_summary'
                                className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary rounded h-32'
                                placeholder='Write a brief summary about yourself'
                                value={instructor.profile_summary}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className='font-abhaya text-lg font-bold mb-1 block'>
                                Specialization Area
                            </label>
                            <select
                                name='specialization_area'
                                className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary rounded'
                                onChange={handleSpecializationChange}
                                value=''
                            >
                                <option value=''>Select Specialization</option>
                                <option value='Web Development'>
                                    Web Development
                                </option>
                                <option value='Machine Learning'>
                                    Machine Learning
                                </option>
                                <option value='Mobile Development'>
                                    Mobile Development
                                </option>
                                <option value='Cybersecurity'>
                                    Cybersecurity
                                </option>
                            </select>

                            <div className='font-abhaya font-bold mt-3 flex flex-wrap gap-2'>
                                {instructor.specialization_area?.map(
                                    (specialization) => (
                                        <div
                                            key={specialization}
                                            className='flex items-center gap-2 bg-gray px-3 py-1.5 rounded-full text-sm'
                                        >
                                            <span>{specialization}</span>
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    handleRemoveSpecialization(
                                                        specialization,
                                                    )
                                                }
                                                className='text-delete'
                                            >
                                                <X className='h-4 w-4' />
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div>
                            <label className='font-abhaya text-lg font-bold mb-1 block'>
                                Years of Experience
                            </label>
                            <input
                                name='years_of_experience'
                                className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary rounded'
                                type='number'
                                placeholder='Years of Experience'
                                value={instructor.years_of_experience || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className='font-abhaya text-lg font-bold mb-1 block'>
                                GitHub Link (Optional)
                            </label>
                            <input
                                name='github'
                                className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary rounded'
                                type='url'
                                placeholder='GitHub Profile'
                                value={instructor.social_links?.github}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='font-abhaya text-lg font-bold mb-1 block'>
                                LinkedIn Link (Optional)
                            </label>
                            <input
                                name='linkedin'
                                className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary rounded'
                                type='url'
                                placeholder='LinkedIn Profile'
                                value={instructor.social_links?.linkedin}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        className='w-full py-3 bg-primary text-white text-lg active:scale-95 font-abhaya rounded transition-transform'
                        type='submit'
                    >
                        Proceed to Instructor
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InstructorAuthComponent;
