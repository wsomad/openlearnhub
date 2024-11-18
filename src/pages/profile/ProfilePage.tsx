import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileComponent from '../../components/profile/ProfileComponent';
import ProfileView from '../../components/profile/ProfileView';
import { Course } from '../../types/course';
import { UserProfile } from '../../types/Profile';
import { ProfileStatistics } from '../../types/ProfileStatistics';
import { ViewMode } from '../../types/Shared';

interface ProfilePageProps {
    userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({userId}) => {
    // Set initial view mode based on the user type (if only student, default to student)
    const [viewMode, setViewMode] = useState<ViewMode>('student');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Define initial user profile data
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [statistics, setStatistics] = useState<ProfileStatistics | null>(
        null,
    );
    const [userCourses, setUserCourses] = useState<{
        enrolled: Course[];
        created: Course[];
    }>({enrolled: [], created: []});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/dummyData.json');
                const data = await response.json();

                // Find user profile
                const profile = data.users.find(
                    (u: UserProfile) => u.uid === userId,
                );
                if (!profile) {
                    throw new Error('User not found');
                }

                // Get enrolled and created courses
                const enrolledCourseIds =
                    profile.studentProfile?.enrolled_courses || [];
                const createdCourseIds =
                    profile.instructorProfile?.created_courses || [];

                const enrolledCourses = data.courses.filter((course: Course) =>
                    enrolledCourseIds.includes(course.course_id),
                );

                const createdCourses = data.courses.filter((course: Course) =>
                    createdCourseIds.includes(course.course_id),
                );

                setUserProfile(profile);
                setStatistics(data.profile_statistics);
                setUserCourses({
                    enrolled: enrolledCourses,
                    created: createdCourses,
                });

                // Set initial view mode based on role
                setViewMode(
                    profile.role === 'instructor' ? 'instructor' : 'student',
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load profile',
                );
                navigate('/error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId, navigate]);

    // Toggle between student and instructor profile view modes (only allow switching if user is both)
    const toggleProfileMode = () => {
        if (userProfile?.role === 'student') {
            setViewMode(viewMode === 'student' ? 'instructor' : 'student');
        }
    };

    // Open/close modal for profile editing
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleProfileUpdate = async (updatedProfile: UserProfile) => {
        try {
            // In a real app, you would make an API call here
            setUserProfile(updatedProfile);
            setIsModalOpen(false);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                Loading...
            </div>
        );
    }

    if (error || !userProfile || !statistics) {
        return (
            <div className='text-red-500 text-center'>
                Error: {error || 'Failed to load profile'}
            </div>
        );
    }

    return (
        <div className='font-abhaya profile-page p-6'>
            {/* <HeaderComponent
                userType={viewMode}
                currentRole='student'
                onToggleView={function (): void {
                    throw new Error('Function not implemented.');
                }}
            /> */}
            <ProfileView
                viewMode={viewMode}
                userProfile={userProfile}
                toggleModal={toggleModal}
                isInstructor={userProfile.role === 'instructor'}
                courses={userCourses}
            />

            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-lg w-full relative'>
                        <ProfileComponent
                            userProfile={userProfile}
                            viewMode={viewMode}
                            onClose={toggleModal}
                            onProfileUpdate={handleProfileUpdate}
                            statistics={statistics}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
