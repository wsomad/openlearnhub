import React, {useState} from 'react';
import {IoCloseOutline} from 'react-icons/io5';

const ProfileComponent = ({
    userProfile,
    viewMode,
    onClose,
    onProfileUpdate,
}) => {
    // State for profile editing
    const [username, setUsername] = useState(userProfile.username);
    const [firstName, setFirstName] = useState(userProfile.firstName);
    const [lastName, setLastName] = useState(userProfile.lastName);
    const [studentTypes, setStudentTypes] = useState(
        userProfile.studentTypes || '',
    );

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [summary, setSummary] = useState(userProfile.profileSummary);
    const [specialization, setSpecialization] = useState(
        userProfile.specialization,
    );
    const [experience, setExperience] = useState(userProfile.experience);
    const [github, setGithub] = useState(userProfile.github);
    const [linkedin, setLinkedin] = useState(userProfile.linkedin);

    // List of specialization options
    const specializationOptions = [
        'Web Development',
        'Machine Learning & AI',
        'Business Communication',
        'Environmental Sustainability',
        'Data Science & Analytics',
        'App Development',
        'Psychology & Human Behavior',
        'Creative Writing',
    ];

    const studentTypeOptions = [
        'Secondary',
        'High School',
        'Undergraduate',
        'Postgraduate',
        'Doctorate',
        'Professional Certification',
    ];

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (password && password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const updatedProfile = {
            ...userProfile,
            username,
            firstName,
            lastName,
            studentTypes,
            profileSummary: summary,
            specialization,
            experience,
            github,
            linkedin,
        };

        console.log('Profile updated:', updatedProfile);
        alert('Profile updated successfully');
        onProfileUpdate(updatedProfile); // Call the callback to update the parent state
        onClose();
    };

    return (
        <div className='font-abhaya fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-8 rounded-3xl w-1/3 relative'>
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute top-8 right-4 text-3xl text-gray-500 hover:text-gray-800'
                >
                    <IoCloseOutline />
                </button>

                <h1 className='text-3xl font-bold mb-4'>
                    Edit {viewMode === 'student' ? 'Student' : 'Instructor'}{' '}
                    Profile
                </h1>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {viewMode === 'student' && (
                        <div className='grid grid-cols-1 gap-3'>
                            <div>
                                <h1 className='text-2xl font-bold mb-1'>
                                    Basic
                                </h1>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Username
                                </label>
                                <input
                                    type='text'
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Type of Student
                                </label>
                                <select
                                    value={studentTypes}
                                    onChange={(e) =>
                                        setStudentTypes(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2 appearance-none'
                                >
                                    <option disabled value=''>
                                        Select Student Type
                                    </option>
                                    {studentTypeOptions.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-2'>
                                <h1 className='text-2xl font-bold mb-1'>
                                    Privacy & Security
                                </h1>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    value={userProfile.email}
                                    disabled
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2 cursor-not-allowed'
                                />
                                <label className='block text-lg font-medium text-gray-700 mt-3'>
                                    Password
                                </label>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                                <label className='block text-lg font-medium text-gray-700 mt-3'>
                                    Confirm Password
                                </label>
                                <input
                                    type='password'
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                        </div>
                    )}

                    {viewMode === 'instructor' && (
                        <div className='grid grid-cols-1 gap-3'>
                            <div>
                                <h1 className='text-2xl font-bold mb-1'>
                                    Details
                                </h1>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Profile Summary
                                </label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={4}
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                    placeholder='Write a brief profile summary here...'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Specialization
                                </label>
                                <select
                                    value={specialization}
                                    onChange={(e) =>
                                        setSpecialization(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2 appearance-none pl-3'
                                >
                                    {specializationOptions.map(
                                        (option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    Experience (in years)
                                </label>
                                <input
                                    type='number'
                                    value={experience}
                                    onChange={(e) =>
                                        setExperience(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                            <div className='mt-2'>
                                <h1 className='text-2xl font-bold mb-1'>
                                    Account Links
                                </h1>
                                <label className='block text-lg font-medium text-gray-700'>
                                    GitHub
                                </label>
                                <input
                                    type='text'
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                            <div>
                                <label className='block text-lg font-medium text-gray-700'>
                                    LinkedIn
                                </label>
                                <input
                                    type='text'
                                    value={linkedin}
                                    onChange={(e) =>
                                        setLinkedin(e.target.value)
                                    }
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2'
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type='submit'
                        className='w-full py-3 rounded-3xl bg-primary text-white text-lg mt-8'
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileComponent;
