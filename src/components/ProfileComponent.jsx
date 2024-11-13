import React, {useState} from 'react';

const ProfileComponent = ({userType}) => {
    // Student Profile
    const [changeUsername, setChangeUsername] = useState('');
    const [changeFirstName, setChangeFirstName] = useState('');
    const [changeLastName, setChangeLastName] = useState('');
    const [email, setEmail] = useState('suffian111@gmail.com');
    const [changePassword, setChangePassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Instructor
    const [summary, setSummary] = useState('');
    const [specializationArea, setSpecializationArea] = useState('');
    const [experience, setExperience] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');

    return (
        <div className='flex w-full min-h-screen'>
            {/* Main form container */}
            <div className='w-full flex items-center justify-center'>
                <form className='w-full max-w-xl overflow-auto'>
                    <h1 className='font-abhaya text-5xl font-bold mb-6'>
                        Profile Settings
                    </h1>

                    <h3 className='font-abhaya text-lg mb-6'>
                        Here is your profile settings.
                    </h3>

                    {/* Basic Information */}
                    <div className='space-y-4'>
                        {/* For student */}
                        {userType === 'student' && (
                            <>
                                <h2 className='font-abhaya text-2xl font-semibold mb-2'>
                                    Basic
                                </h2>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Username
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Username'
                                        value={changeUsername}
                                        onChange={(e) =>
                                            setChangeUsername(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        First Name
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='First Name'
                                        value={changeFirstName}
                                        onChange={(e) =>
                                            setChangeFirstName(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Last Name
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Last Name'
                                        value={changeLastName}
                                        onChange={(e) =>
                                            setChangeLastName(e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {/* For instructor */}
                        {userType === 'instructor' && (
                            <>
                                <h2 className='font-abhaya text-2xl font-semibold mb-2'>
                                    Details
                                </h2>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Profile Summary
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Enter your profile summary'
                                        value={summary}
                                        onChange={(e) =>
                                            setSummary(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Specialization Area
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Enter your specialization area'
                                        value={specializationArea}
                                        onChange={(e) =>
                                            setSpecializationArea(
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Experience
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Let us know your experience!'
                                        value={experience}
                                        onChange={(e) =>
                                            setExperience(e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Privacy & Security */}
                    <div className='space-y-4 mt-8'>
                        {/* For student */}
                        {userType === 'student' && (
                            <>
                                <h2 className='font-abhaya text-2xl font-semibold mb-2'>
                                    Privacy & Security
                                </h2>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Email
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Email'
                                        value={email}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Password
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='password'
                                        placeholder='Password'
                                        value={changePassword}
                                        onChange={(e) =>
                                            setChangePassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Confirm Password
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='password'
                                        placeholder='Confirm Password'
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {/* For instructor */}
                        {userType === 'instructor' && (
                            <>
                                <h2 className='font-abhaya text-2xl font-semibold mb-2'>
                                    Account Links
                                </h2>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        LinkedIn
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Enter your LinkedIn Link'
                                        value={linkedin}
                                        onChange={(e) =>
                                            setLinkedin(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-medium mb-1 block'>
                                        Github
                                    </label>
                                    <input
                                        className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                        type='text'
                                        placeholder='Enter your Github Profile Link'
                                        value={github}
                                        onChange={(e) =>
                                            setGithub(e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Submit button */}
                    <div className='mt-8 flex gap-y-4'>
                        <button
                            className='w-full py-3 rounded-3xl bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                            type='submit'
                        >
                            {userType === 'student'
                                ? 'Update Student Profile'
                                : 'Update Instructor Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileComponent;
