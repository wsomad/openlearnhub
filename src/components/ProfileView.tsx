import React from 'react';
import userProfileImg from '../assets/images/userProfile.png';

const ProfileView = ({
    viewMode,
    userProfile,
    toggleProfileMode,
    toggleModal,
    isInstructor, // Receive isInstructor prop
}) => {
    return (
        <div className='profile-view max-w-screen-xl mx-auto px-0.5'>
            <h2 className='text-5xl font-bold mt-12 mb-12'>
                {userProfile.username}'s{' '}
                {viewMode === 'student' ? 'Student' : 'Instructor'} Profile Page
            </h2>

            <div className='flex items-start mb-12'>
                <div
                    className={`relative w-32 h-32 rounded-full overflow-hidden mr-6 ${
                        viewMode === 'student'
                            ? 'filter grayscale'
                            : 'border-4 border-primary'
                    }`}
                >
                    <img
                        src={userProfileImg}
                        alt='User Profile'
                        className='w-full h-full object-cover'
                    />
                </div>
                <div className='flex-1'>
                    <p className='text-3xl font-bold mt-8'>
                        {userProfile.firstName} {userProfile.lastName}
                    </p>

                    <div className='mt-1 flex space-x-16'>
                        {viewMode === 'instructor' && (
                            <>
                                <p>
                                    LinkedIn:{' '}
                                    <a
                                        href={userProfile.linkedin}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-secondary'
                                    >
                                        {userProfile.linkedin}
                                    </a>
                                </p>
                                <p>
                                    GitHub:{' '}
                                    <a
                                        href={userProfile.github}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-secondary'
                                    >
                                        {userProfile.github}
                                    </a>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className='mt-10 space-x-4'>
                    {viewMode === 'student' && (
                        <button
                            onClick={toggleModal}
                            className='bg-primary text-white px-4 py-2 rounded mb-2'
                        >
                            Edit Student Profile
                        </button>
                    )}

                    {viewMode === 'instructor' && (
                        <button
                            onClick={toggleModal}
                            className='bg-primary text-white px-4 py-2 rounded mb-2'
                        >
                            Edit Instructor Profile
                        </button>
                    )}

                    {isInstructor && ( // Only show the switch button if user is an instructor
                        <button
                            onClick={toggleProfileMode}
                            className='bg-primary text-white py-2 px-4 rounded'
                        >
                            Switch to{' '}
                            {viewMode === 'student' ? 'Instructor' : 'Student'}{' '}
                            Profile
                        </button>
                    )}
                </div>
            </div>

            <hr className='border-t gray mb-8 opacity-15' />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {viewMode === 'student' ? (
                    <>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Email
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.email}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Courses Enrolled
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.coursesEnrolled}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Student Type
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.studentTypes}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Number of Courses Created
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.coursesCreated}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Specialization
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.specialization}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Experience
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.experience} years
                            </p>
                        </div>
                    </>
                )}
            </div>

            <hr className='border-t gray mb-8 opacity-15' />

            {viewMode === 'instructor' && (
                <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-3xl font-semibold text-gray-800 mb-4'>
                        Profile Summary
                    </h3>
                    <p className='text-gray-700 text-lg'>
                        {userProfile.profileSummary}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
