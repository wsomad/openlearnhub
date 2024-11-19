import React from 'react';

import userProfileImg from '../../assets/images/userProfile.png';
import { Course } from '../../types/course';
import { ViewMode } from '../../types/shared';
import { User } from '../../types/user';
import CardDashboard from '../CardDashboard';

interface ProfileViewProps {
    viewMode: ViewMode;
    userProfile: User;
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
                        src={userProfile.profile_image || userProfileImg}
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
                        {!isStudent && userProfile.instructor && (
                            <>
                                {userProfile.instructor.social_links
                                    .linkedin && (
                                    <p>
                                        LinkedIn:{' '}
                                        <a
                                            href={
                                                userProfile.instructor
                                                    .social_links.linkedin
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-secondary hover:text-secondary-dark transition-colors'
                                        >
                                            {
                                                userProfile.instructor
                                                    .social_links.linkedin
                                            }
                                        </a>
                                    </p>
                                )}
                                {userProfile.instructor.social_links.github && (
                                    <p>
                                        GitHub:{' '}
                                        <a
                                            href={
                                                userProfile.instructor
                                                    .social_links.github
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-secondary hover:text-secondary-dark transition-colors'
                                        >
                                            {
                                                userProfile.instructor
                                                    .social_links.github
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
                                {userProfile.student.courses_enrolled}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-medium text-gray-500'>
                                Student Type
                            </p>
                            <p className='text-lg font-semibold text-gray-700'>
                                {userProfile.student.student_type}
                            </p>
                        </div>
                    </>
                ) : (
                    userProfile.instructor && (
                        <>
                            <div className='flex flex-col'>
                                <p className='text-md font-medium text-gray-500'>
                                    Courses Created
                                </p>
                                <p className='text-lg font-semibold text-gray-700'>
                                    {
                                        userProfile.instructor
                                            .total_courses_created
                                    }
                                </p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-medium text-gray-500'>
                                    Specialization
                                </p>
                                <p className='text-lg font-semibold text-gray-700'>
                                    {userProfile.instructor.specialization_area.join(
                                        ', ',
                                    )}
                                </p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-medium text-gray-500'>
                                    Experience
                                </p>
                                <p className='text-lg font-semibold text-gray-700'>
                                    {userProfile.instructor.years_of_experience}{' '}
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
                        <CardDashboard
                            key={course.course_id}
                            courseId={course.course_id}
                            thumbnailUrl={course.course_thumbnail_url}
                            title={course.course_title}
                            description={course.course_description}
                            pricing={course.course_pricing}
                            enrollmentNumber={course.course_enrollment_number}
                        />
                    ))}
                </div>
            </div>

            {/* Instructor Summary Section */}
            {!isStudent && userProfile.instructor && (
                <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-3xl font-semibold text-gray-800 mb-4'>
                        Profile Summary
                    </h3>
                    <p className='text-gray-700 text-lg'>
                        {userProfile.instructor.profile_summary}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
