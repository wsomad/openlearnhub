import React from 'react';
import { Link } from 'react-router-dom';

import userProfileImg from '../../assets/images/userProfile.png';
import { Course } from '../../types/course';
import { UserProfile } from '../../types/Profile';
import { ViewMode } from '../../types/Shared';

interface ProfileViewProps {
    viewMode: ViewMode;
    userProfile: UserProfile;
    toggleModal: () => void;
    isInstructor: boolean;
    courses: {
        enrolled: Course[];
        created: Course[];
    };
}

const ProfileView: React.FC<ProfileViewProps> = ({
    viewMode,
    userProfile,
    toggleModal,
    isInstructor,
    courses,
}) => {
    const isStudent = viewMode === 'student';
    const currentCourses = isStudent ? courses.enrolled : courses.created;

    return (
        <div className='profile-view max-w-screen-xl mx-auto px-0.5'>
            <h2 className='text-5xl font-bold mt-12 mb-12'>
                {userProfile.username}'s {isStudent ? 'Student' : 'Instructor'}{' '}
                Profile
            </h2>

            <div className='flex items-start mb-12'>
                {/* Profile Image Section */}
                <div
                    className={`relative w-32 h-32 rounded-full overflow-hidden mr-6 ${
                        isStudent
                            ? 'filter grayscale'
                            : 'border-4 border-primary'
                    }`}
                >
                    <img
                        src={userProfile.profileImage || userProfileImg}
                        alt={`${userProfile.firstname}'s Profile`}
                        className='w-full h-full object-cover'
                    />
                </div>

                {/* Profile Info Section */}
                <div className='flex-1'>
                    <p className='text-3xl font-bold mt-8'>
                        {userProfile.firstname} {userProfile.lastname}
                    </p>

                    <div className='mt-1 flex space-x-16'>
                        {!isStudent && userProfile.instructorProfile && (
                            <>
                                {userProfile.instructorProfile.socialLinks
                                    .linkedin && (
                                    <p>
                                        LinkedIn:{' '}
                                        <a
                                            href={
                                                userProfile.instructorProfile
                                                    .socialLinks.linkedin
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-secondary hover:text-secondary-dark transition-colors'
                                        >
                                            {
                                                userProfile.instructorProfile
                                                    .socialLinks.linkedin
                                            }
                                        </a>
                                    </p>
                                )}
                                {userProfile.instructorProfile.socialLinks
                                    .github && (
                                    <p>
                                        GitHub:{' '}
                                        <a
                                            href={
                                                userProfile.instructorProfile
                                                    .socialLinks.github
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-secondary hover:text-secondary-dark transition-colors'
                                        >
                                            {
                                                userProfile.instructorProfile
                                                    .socialLinks.github
                                            }
                                        </a>
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='mt-10 space-x-4'>
                    <button
                        onClick={toggleModal}
                        className='bg-primary text-white px-4 py-2 rounded mb-2 hover:bg-primary-dark transition-colors'
                    >
                        Edit {isStudent ? 'Student' : 'Instructor'} Profile
                    </button>
                </div>
            </div>

            <hr className='border-t gray mb-8 opacity-15' />

            {/* Profile Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {isStudent ? (
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
                                {userProfile.studentProfile.coursesEnrolled}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Student Type
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.studentProfile.studentType}
                            </p>
                        </div>
                    </>
                ) : (
                    userProfile.instructorProfile && (
                        <>
                            <div className='flex flex-col'>
                                <p className='text-md font-medium text-gray-500'>
                                    Courses Created
                                </p>
                                <p className='text-lg font-semibold text-gray-700'>
                                    {
                                        userProfile.instructorProfile
                                            .coursesCreated
                                    }
                                </p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-medium text-gray-500'>
                                    Specialization
                                </p>
                                <p className='text-lg font-semibold text-gray-700'>
                                    {userProfile.instructorProfile.specializationArea.join(
                                        ', ',
                                    )}
                                </p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-medium text-gray-500'>
                                    Experience
                                </p>
                                <p className='text-lg font-semibold text-gray-700'>
                                    {
                                        userProfile.instructorProfile
                                            .yearsOfExperience
                                    }{' '}
                                    years
                                </p>
                            </div>
                        </>
                    )
                )}
            </div>

            <hr className='border-t gray mb-8 opacity-15' />

            {/* Course List Section */}
            <div className='mt-8'>
                <h3 className='text-2xl font-bold mb-4'>
                    {isStudent ? 'Enrolled Courses' : 'Created Courses'}
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {currentCourses.map((course) => (
                        <Link
                            key={course.course_id}
                            to={`/course/${course.course_id}`}
                            className='block hover:shadow-lg transition-shadow'
                        >
                            <div className='bg-white rounded-lg overflow-hidden shadow'>
                                <img
                                    src={course.course_thumbnail_url}
                                    alt={course.course_title}
                                    className='w-full h-40 object-cover'
                                />
                                <div className='p-4'>
                                    <h4 className='text-xl font-semibold mb-2'>
                                        {course.course_title}
                                    </h4>
                                    <p className='text-gray-600 text-sm mb-2'>
                                        {course.course_description}
                                    </p>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-primary font-semibold'>
                                            ${course.course_pricing}
                                        </span>
                                        <span className='text-gray-500 text-sm'>
                                            {course.course_enrollment_number}{' '}
                                            students
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Instructor Summary Section */}
            {!isStudent && userProfile.instructorProfile && (
                <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-3xl font-semibold text-gray-800 mb-4'>
                        Profile Summary
                    </h3>
                    <p className='text-gray-700 text-lg'>
                        {userProfile.instructorProfile.profileSummary}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
