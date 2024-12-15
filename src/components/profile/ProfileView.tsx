import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaRegStar, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import defaultProfilePicture from '../../assets/images/userProfile.png';
import { useCourses } from '../../hooks/useCourses';
import { useUser } from '../../hooks/useUser';
import CardCourseComponent from '../card/CardCourseComponent';
import ProfileComponent from './ProfileComponent';

const ProfileView: React.FC = () => {
    //const currentCourses = isStudent ? courses.enrolled : courses.created;
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const {allCourses, fetchAllCourses} = useCourses();
    const {currentUser, userRole, fetchUserById} = useUser();
    const isStudent = userRole === 'student';
    const isInstructor = userRole === 'instructor';
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (!currentUser?.uid) {
                    await fetchUserById(currentUser?.uid || '');
                    console.log('Successfully get user data');
                }
            } catch (error) {
                console.error('Failed to get user data');
            }
        };
        loadUser();
    }, [currentUser]);

    useEffect(() => {
        const loadCourses = async () => {
            const filterType = isStudent ? 'enrollment' : 'creator';
            const readyForPublish = isStudent ? true : false;

            if (currentUser?.uid) {
                await fetchAllCourses(
                    currentUser.uid,
                    userRole,
                    filterType,
                    'newest',
                    readyForPublish,
                );
            }
        };
        loadCourses();
    }, [currentUser?.uid, userRole]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (!currentUser) {
        return;
    }

    return (
        <div>
            <div className='profile-view max-w-screen-xl mx-auto px-0.5'>
                <div className='flex items-start justify-start my-6'>
                    <div
                        className={`relative w-40 h-40 rounded-full overflow-hidden mr-10 border-2 border-primary`}
                    >
                        <img
                            src={
                                currentUser.profile_image ||
                                defaultProfilePicture
                            }
                            alt={`${currentUser.firstname}'s Profile`}
                            className='w-full h-full object-cover'
                        />
                    </div>

                    <div className='flex-1'>
                        <div className='flex flex-row'>
                            <p className='text-3xl font-bold'>
                                {currentUser.username}
                            </p>
                            {/* Only instructor has this */}
                            {isInstructor ? (
                                <div className='flex flex-row ml-4 items-center justify-center'>
                                    {currentUser?.instructor?.social_links
                                        ?.github && (
                                        <a
                                            href={
                                                currentUser.instructor
                                                    .social_links.github
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='mr-2'
                                        >
                                            <FaGithub className='w-5 h-5 cursor-pointer' />
                                        </a>
                                    )}

                                    {currentUser?.instructor?.social_links
                                        ?.linkedin && (
                                        <a
                                            href={
                                                currentUser?.instructor
                                                    ?.social_links?.linkedin
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <FaLinkedin className='w-5 h-5 cursor-pointer' />
                                        </a>
                                    )}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>

                        <div className='grid grid-row-1 md:grid-row-2 lg:grid-row-3 gap-3 mt-4'>
                            {isStudent ? (
                                <>
                                    <div className='flex flex-row items-center'>
                                        <p className='text-md bg-gray px-2 font-medium text-white mr-4'>
                                            Email
                                        </p>
                                        <p className='text-lg font-semibold text-gray-700'>
                                            {currentUser.email}
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <p className='text-md bg-gray px-2 font-medium text-white mr-4'>
                                            Joined At
                                        </p>
                                        <p className='text-lg font-semibold text-gray-700'>
                                            {currentUser.created_at instanceof
                                            Timestamp
                                                ? currentUser.created_at
                                                      .toDate()
                                                      .toLocaleDateString(
                                                          'en-uk',
                                                          {
                                                              year: 'numeric',
                                                              month: 'long',
                                                              day: 'numeric',
                                                          },
                                                      )
                                                : (
                                                      currentUser.created_at as Date
                                                  ).toLocaleDateString(
                                                      'en-uk',
                                                      {
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                      },
                                                  )}
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <p className='text-md bg-gray px-2 font-medium text-white mr-4'>
                                            Education Level
                                        </p>
                                        <p className='text-lg font-semibold text-black'>
                                            {currentUser?.student
                                                ?.student_type ||
                                                'No Education Level'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                currentUser.instructor && (
                                    <>
                                        <div className='flex flex-row items-center'>
                                            <p className='text-md bg-gray px-2 font-medium text-white mr-4'>
                                                Specialization
                                            </p>
                                            <p className='text-lg font-semibold text-gray-700'>
                                                {currentUser?.instructor
                                                    ?.specialization_area &&
                                                currentUser.instructor
                                                    .specialization_area
                                                    .length > 0
                                                    ? currentUser.instructor.specialization_area.join(
                                                          ' | ',
                                                      )
                                                    : 'No specialization areas available'}
                                            </p>
                                        </div>
                                        <div className='flex flex-row items-center'>
                                            <p className='text-md bg-gray px-2 font-medium text-white mr-4'>
                                                Experience
                                            </p>
                                            <p className='text-lg font-semibold text-gray-700'>
                                                {
                                                    currentUser.instructor
                                                        .years_of_experience
                                                }{' '}
                                                years
                                            </p>
                                        </div>
                                        <div className='flex flex-row items-center'>
                                            <p className='text-md bg-gray px-2 font-medium text-white mr-4'>
                                                Rating
                                            </p>
                                            <p className='flex flex-row text-lg font-semibold text-black'>
                                                {[...Array(5)].map(
                                                    (_, index) => (
                                                        <span
                                                            key={index}
                                                            className='text-yellow-500 text-xl'
                                                        >
                                                            {currentUser
                                                                ?.instructor
                                                                ?.rating &&
                                                            index <
                                                                currentUser
                                                                    .instructor
                                                                    .rating ? (
                                                                <FaStar className='text-secondary' /> // Solid star
                                                            ) : (
                                                                <FaRegStar className='text-gray' /> // Outlined star
                                                            )}
                                                        </span>
                                                    ),
                                                )}
                                            </p>
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='space-x-4 flex items-end'>
                        <button
                            onClick={toggleModal}
                            className='bg-primary text-white px-4 py-2 mb-2 transition-colors '
                        >
                            Update {isStudent ? 'Your' : 'Instructor'} Profile
                        </button>
                    </div>
                </div>

                {/* Instructor Summary Section */}
                {isInstructor && currentUser.instructor && (
                    <div className='flex flex-row gap-6 mt-8'>
                        <div className='w-full bg-white p-4 border border-gray'>
                            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                                Profile Summary
                            </h3>
                            <p className='text-gray-700 text-lg'>
                                {currentUser.instructor.profile_summary}
                            </p>
                        </div>
                    </div>
                )}

                {/* <hr className='border-t gray mb-8 opacity-15' /> */}

                {/* Course List Section */}
                <div className='mt-8'>
                    <h3 className='text-2xl font-bold mb-4'>
                        {isStudent ? 'Enrolled Courses' : 'Created Courses'}
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {isStudent
                            ? allCourses.map((course) => (
                                  <CardCourseComponent
                                      key={course.course_id}
                                      thumbnail={course.course_thumbnail_url}
                                      title={course.course_title}
                                      instructor={course.course_instructor}
                                      pricing={course.course_pricing}
                                      buttonText='Continue'
                                      onButtonClick={() =>
                                          navigate(
                                              `/selectedcourse/${course.course_id}`,
                                          )
                                      }
                                      size='sm'
                                  />
                              ))
                            : allCourses.map((course) => (
                                  <CardCourseComponent
                                      key={course.course_id}
                                      thumbnail={course.course_thumbnail_url}
                                      title={course.course_title}
                                      instructor={course.course_instructor}
                                      enrolledStudents={
                                          course.course_enrollment_number
                                      }
                                      buttonText='Edit'
                                      onButtonClick={() =>
                                          navigate(
                                              `/instructor/dashboard/${course.course_id}/edit`,
                                          )
                                      }
                                      size='sm'
                                  />
                              ))}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-lg w-full relative'>
                        <ProfileComponent onClose={toggleModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
