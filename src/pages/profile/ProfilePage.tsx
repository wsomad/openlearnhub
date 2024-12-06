import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ProfileComponent from '../../components/profile/ProfileComponent';
import ProfileView from '../../components/profile/ProfileView';
import {User} from '../../types/user';
import HeaderComponent from '../../components/HeaderComponent';
import {useUser} from '../../hooks/useUser';

const ProfilePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {currentUser, userRole, fetchUserById} = useUser();
    console.log('Cu user',currentUser);

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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleProfileUpdate = async (updatedProfile: User) => {
        try {
            setUserProfile(updatedProfile);
            setIsModalOpen(false);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto font-abhaya'>
                    <ProfileView/>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

// const [statistics, setStatistics] = useState<ProfileStatistics | null>(
    //     null,
    // );
    // const [userCourses, setUserCourses] = useState<{
    //     enrolled: Course[];
    //     created: Course[];
    // }>({enrolled: [], created: []});

    //const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchProfileData = async () => {
    //         try {
    //             setIsLoading(true);
    //             const response = await fetch('/dummyData.json');
    //             const data = await response.json();

    //             // Find user profile
    //             const profile = data.users.find((u: User) => u.uid === userId);
    //             if (!profile) {
    //                 throw new Error('User not found');
    //             }

    //             // Get enrolled and created courses
    //             const enrolledCourseIds =
    //                 profile.student?.enrolled_courses || [];
    //             const createdCourseIds =
    //                 profile.instructor?.created_courses || [];

    //             const enrolledCourses = data.courses.filter((course: Course) =>
    //                 enrolledCourseIds.includes(course.course_id),
    //             );

    //             const createdCourses = data.courses.filter((course: Course) =>
    //                 createdCourseIds.includes(course.course_id),
    //             );

    //             setUserProfile(profile);
    //             setStatistics(data.profile_statistics);
    //             setUserCourses({
    //                 enrolled: enrolledCourses,
    //                 created: createdCourses,
    //             });

    //             // Set initial view mode based on role
    //             setViewMode(
    //                 profile.role === 'instructor' ? 'instructor' : 'student',
    //             );
    //         } catch (err) {
    //             setError(
    //                 err instanceof Error
    //                     ? err.message
    //                     : 'Failed to load profile',
    //             );
    //             navigate('/error');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchProfileData();
    // }, [userId, navigate]);

    // Toggle between student and instructor profile view modes (only allow switching if user is both)
    // const toggleProfileMode = () => {
    //     if (userProfile?.role === 'student') {
    //         setViewMode(viewMode === 'student' ? 'instructor' : 'student');
    //     }
    // };


    // if (isLoading) {
    //     return (
    //         <div className='flex justify-center items-center h-screen'>
    //             Loading...
    //         </div>
    //     );
    // }

    // //|| !statistics
    // if (error || !userProfile) {
    //     return (
    //         <div className='text-red-500 text-center'>
    //             Error: {error || 'Failed to load profile'}
    //         </div>
    //     );
    // }


    // <ProfileView
    //                     //viewMode={viewMode}
    //                     //userProfile={userProfile}
    //                     toggleModal={toggleModal}
    //                     //isInstructor={userProfile.role === 'instructor'}
    //                     //courses={userCourses}
    //                 />
