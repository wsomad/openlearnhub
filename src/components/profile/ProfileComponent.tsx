import React, {useEffect, useState} from 'react';
import {IoCloseOutline} from 'react-icons/io5';

import {SpecializationArea} from '../../types/instructor';
import {ProfileStatistics} from '../../types/profilestatistics';
import {ViewMode} from '../../types/shared';
import {StudentType} from '../../types/student';
import {User} from '../../types/user';

interface ProfileComponentProps {
    userProfile: User;
    viewMode: ViewMode;
    onClose: () => void;
    onProfileUpdate: (updatedProfile: User) => void;
    statistics: ProfileStatistics;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
    userProfile,
    viewMode,
    onClose,
    onProfileUpdate,
    statistics,
}) => {
    // Common fields
    const [username, setUsername] = useState<string>(userProfile.username);
    const [firstName, setFirstName] = useState<string>(userProfile.firstname);
    const [lastName, setLastName] = useState<string>(userProfile.lastname);
    const [imageProfile, setImageProfile] = useState<string | null>(
        userProfile.profile_image ?? null,
    );

    // Student-specific fields
    const [studentType, setStudentType] = useState<StudentType>(
        userProfile.student?.student_type || 'Undergraduate',
    );

    // Instructor-specific fields
    const [summary, setSummary] = useState<string>(
        userProfile.instructor?.profile_summary || '',
    );
    const [specializations, setSpecializations] = useState<
        SpecializationArea[]
    >(userProfile.instructor?.specialization_area || []);
    const [experience, setExperience] = useState<number>(
        userProfile.instructor?.years_of_experience || 0,
    );
    const [github, setGithub] = useState<string>(
        userProfile.instructor?.social_links.github || '',
    );
    const [linkedin, setLinkedin] = useState<string>(
        userProfile.instructor?.social_links.linkedin || '',
    );

    // Security fields
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const validateForm = (): boolean => {
        if (!username || !firstName || !lastName) {
            alert('Please fill in all required fields.');
            return false;
        }

        if (password || confirmPassword) {
            if (password.length < 8) {
                alert('Password must be at least 8 characters long.');
                return false;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        // Create updated profile object
        const updatedProfile: User = {
            ...userProfile,
            username,
            firstname: firstName,
            lastname: lastName,
            profile_image: imageProfile || '',
            student: {
                ...userProfile.student,
                student_type: studentType,
            },
        };

        // Update instructor profile if in instructor mode and user has instructor profile
        if (viewMode === 'instructor' && userProfile.instructor) {
            updatedProfile.instructor = {
                ...userProfile.instructor,
                profile_summary: summary,
                specialization_area: specializations,
                years_of_experience: experience,
                social_links: {
                    github,
                    linkedin,
                },
            };
        }

        try {
            await onProfileUpdate(updatedProfile);
        } catch (error) {
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative'>
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute top-8 right-4 text-3xl text-gray-500 hover:text-gray-800 transition-colors'
                    aria-label='Close modal'
                >
                    <IoCloseOutline />
                </button>

                <h1 className='text-3xl font-bold mb-6'>
                    Edit {viewMode === 'student' ? 'Student' : 'Instructor'}{' '}
                    Profile
                </h1>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Basic Information Section */}
                    <div className='space-y-4'>
                        <h2 className='text-2xl font-bold'>
                            Basic Information
                        </h2>
                        <div>
                            <label className='block text-lg font-medium text-gray-700'>
                                Username*
                            </label>
                            <input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                required
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    First Name*
                                </label>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Last Name*
                                </label>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    required
                                />
                            </div>
                            <div className='col-span-2'>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Profile Image
                                </label>
                                <input
                                    type='text'
                                    value={imageProfile || ''}
                                    onChange={(e) =>
                                        setImageProfile(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role-Specific Section */}
                    {viewMode === 'student' ? (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-bold'>
                                Student Details
                            </h2>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Student Type*
                                </label>
                                <select
                                    value={studentType}
                                    onChange={(e) =>
                                        setStudentType(
                                            e.target.value as StudentType,
                                        )
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2 appearance-none'
                                    required
                                >
                                    {statistics.student_types.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-bold'>
                                Instructor Details
                            </h2>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Profile Summary
                                </label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    rows={4}
                                    placeholder='Write a brief summary about yourself and your teaching experience...'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Specializations
                                </label>
                                <select
                                    value={specializations}
                                    onChange={(e) => {
                                        const selected = Array.from(
                                            e.target.selectedOptions,
                                            (option) =>
                                                option.value as SpecializationArea,
                                        );
                                        setSpecializations(selected);
                                    }}
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2 appearance-none'
                                >
                                    {statistics.specialization_areas.map(
                                        (area) => (
                                            <option key={area} value={area}>
                                                {area}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Years of Experience
                                </label>
                                <input
                                    type='number'
                                    value={experience}
                                    onChange={(e) =>
                                        setExperience(Number(e.target.value))
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    min={0}
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    GitHub Profile
                                </label>
                                <input
                                    type='url'
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    placeholder='https://github.com/username'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    LinkedIn Profile
                                </label>
                                <input
                                    type='url'
                                    value={linkedin}
                                    onChange={(e) =>
                                        setLinkedin(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    placeholder='https://linkedin.com/in/username'
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    <div className='space-y-4'>
                        <h2 className='text-2xl font-bold'>Security</h2>
                        <div>
                            <label className='block text-lg font-medium text-gray-700'>
                                New Password
                            </label>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                placeholder='Leave blank to keep current password'
                                minLength={8}
                            />
                        </div>
                        {password && (
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Confirm Password
                                </label>
                                <input
                                    type='password'
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    minLength={8}
                                />
                            </div>
                        )}
                    </div>

                    <div className='pt-4'>
                        <button
                            type='submit'
                            className='w-full py-3 rounded-3xl bg-primary text-white text-lg hover:bg-primary-dark transition-colors active:scale-[.98]'
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileComponent;
