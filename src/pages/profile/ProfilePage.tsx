import React, { useEffect, useState } from 'react';

import HeaderComponent from '../../components/HeaderComponent';
import ProfileView from '../../components/profile/ProfileView';
import { useUser } from '../../hooks/useUser';
import { User } from '../../types/user';

const ProfilePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {currentUser, userRole, fetchUserById} = useUser();
    console.log('Cu user', currentUser);

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
                    <ProfileView />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
