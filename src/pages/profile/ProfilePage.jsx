import React, {useState} from 'react';
import ProfileView from '../../components/ProfileView';
import ProfileComponent from '../../components/ProfileComponent';
import HeaderComponent from '../../components/HeaderComponent';

const ProfilePage = ({userType}) => {
    const isInstructor = userType.includes('instructor');

    // Set initial view mode based on the user type (if only student, default to student)
    const [viewMode, setViewMode] = useState(
        isInstructor ? 'instructor' : 'student',
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Define initial user profile data
    const [userProfile, setUserProfile] = useState({
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        studentTypes: 'Undergraduate',
        coursesEnrolled: 3,
        profileSummary: 'Experienced web developer and instructor',
        specialization: 'Web Development',
        experience: '5 years in full-stack development',
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        coursesCreated: 12,
    });

    // Toggle between student and instructor profile view modes (only allow switching if user is both)
    const toggleProfileMode = () => {
        if (isInstructor) {
            setViewMode(viewMode === 'student' ? 'instructor' : 'student');
        }
    };

    // Open/close modal for profile editing
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Handle profile update from modal form submission
    const handleProfileUpdate = (updatedProfile) => {
        setUserProfile(updatedProfile);
        setIsModalOpen(false);
    };

    return (
        <div className='font-abhaya profile-page p-6'>
            <HeaderComponent userType={userType} />

            <ProfileView
                viewMode={viewMode}
                userProfile={userProfile}
                toggleProfileMode={toggleProfileMode}
                toggleModal={toggleModal}
                isInstructor={isInstructor} // Pass isInstructor prop to ProfileView
            />

            {isModalOpen && (
                <div className='modal-overlay'>
                    <div className='bg-white p-6 rounded-lg max-w-lg w-full relative'>
                        <ProfileComponent
                            userProfile={userProfile}
                            viewMode={viewMode}
                            onClose={toggleModal}
                            onProfileUpdate={handleProfileUpdate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
