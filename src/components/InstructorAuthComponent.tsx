import React, { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // To handle navigation
import { FaGoogle } from 'react-icons/fa';
import { Instructor, SpecializationArea } from '../types/instructor';
import { useUser } from '../hooks/useUser';
import { User } from '../types/user';

const InstructorAuthComponent: React.FC = () => {
    const { currentUser, updateUser } = useUser();
    const navigate = useNavigate();

    const [instructor, setInstructor] = useState<Instructor>({
        profile_summary: '',
        specialization_area: [],
        years_of_experience: 0,
        total_courses_created: 0,
        rating: 1,
        social_links: { github: '', linkedin: '' }
    });

    // Redirect if user already has registered
    React.useEffect(() => {
        if (currentUser?.instructor?.hasRegister) {
            navigate('/instructor/dashboard');
        }
    }, [currentUser, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInstructor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSpecializationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(event.target.selectedOptions, option => option.value) as SpecializationArea[];
        setInstructor(prevState => ({
            ...prevState,
            specialization_area: selectedValues || [],
        }));
    };

    const handleRemoveSpecialization = (specialization: string) => {
        setInstructor(prevState => ({
            ...prevState,
            specialization_area: prevState.specialization_area?.filter(item => item !== specialization) || [],
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
                await updateUser(currentUser.uid, {role: 'instructor', ...defaultInstructorProfile} as Partial<User>);
                toast.success('Successfully registered as an instructor!');
                navigate('/instructor/dashboard'); // Navigate to the instructor dashboard
            }
        } catch (error) {
            toast.error('Failed to create instructor profile. Please try again.');
            console.error('Error during instructor sign-up:', error);
        }
    };

    return (
        <div className='w-full flex items-center justify-center mx-auto'>
            <form onSubmit={handleSubmit} className='w-full max-w-lg'>
                <h1 className='font-abhaya text-5xl font-bold mb-6'>
                    Instructor Registration
                </h1>

                <div className='space-y-4'>
                    <div>
                        <label htmlFor='email' className='font-abhaya text-lg font-medium mb-1 block'>
                            Email
                        </label>
                        <input
                            id='email'
                            name='email'
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            type='email'
                            placeholder='Email@example.com'
                            value={currentUser?.email}
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor='profileSummary' className='font-abhaya text-lg font-medium mb-1 block'>
                            Profile Summary
                        </label>
                        <textarea
                            id='profileSummary'
                            name='profile_summary'
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='Write a brief summary about yourself'
                            value={instructor.profile_summary}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='specializationArea' className='font-abhaya text-lg font-medium mb-1 block'>
                            Specialization Area
                        </label>
                        <select
                            id='specializationArea'
                            name='specialization_area'
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            multiple
                            value={instructor.specialization_area}
                            onChange={handleSpecializationChange}
                            required
                        >
                            <option value=''>Select Specialization</option>
                            <option value='Web Development'>Web Development</option>
                            <option value='Machine Learning'>Machine Learning</option>
                            <option value='Mobile Development'>Mobile Development</option>
                            <option value='Cybersecurity'>Cybersecurity</option>
                        </select>
                    </div>

                    {/* Display selected specializations */}
                    <div className='mt-4'>
                        <div className='flex flex-wrap gap-2'>
                            {instructor.specialization_area?.map((specialization) => (
                                <div key={specialization} className='flex items-center bg-gray-200 px-3 py-1 rounded-full'>
                                    <span>{specialization}</span>
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveSpecialization(specialization)}
                                        className='ml-2 text-red-600'
                                    >
                                        <FaGoogle />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor='yearsOfExperience' className='font-abhaya text-lg font-medium mb-1 block'>
                            Years of Experience
                        </label>
                        <input
                            id='yearsOfExperience'
                            name='years_of_experience'
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            type='number'
                            placeholder='Years of Experience'
                            value={instructor.years_of_experience || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='github' className='font-abhaya text-lg font-medium mb-1 block'>
                            GitHub Link (Optional)
                        </label>
                        <input
                            id='github'
                            name='github'
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            type='url'
                            placeholder='GitHub Profile'
                            value={instructor.social_links?.github}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='linkedin' className='font-abhaya text-lg font-medium mb-1 block'>
                            LinkedIn Link (Optional)
                        </label>
                        <input
                            id='linkedin'
                            name='linkedin'
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            type='url'
                            placeholder='LinkedIn Profile'
                            value={instructor.social_links?.linkedin}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className='mt-8'>
                    <button
                        className='w-full py-3 bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                        type='submit'
                    >
                        Proceed to Instructor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InstructorAuthComponent;
