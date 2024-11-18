// HeaderComponent.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { UserProfile } from '../types/Profile';
import { ViewMode } from '../types/Shared';
import { UserRole } from '../types/User';

interface Category {
    name: string;
    path: string;
}

interface MenuItem {
    name: string;
    path: string;
}

interface HeaderComponentProps {
    userType: ViewMode;
    currentRole: UserRole;
    onToggleView: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    userType,
    currentRole,
    onToggleView,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
    const {user, signOut} = useAuth();
    const {currentUser, fetchUserById} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            if (user?.uid && isMounted) {
                try {
                    await fetchUserById(user.uid);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [user?.uid, fetchUserById]);

    const categories: Category[] = [
        {name: 'Development', path: '/categories/development'},
        {name: 'Language', path: '/categories/language'},
        {name: 'Nature', path: '/categories/nature'},
        {name: 'Science', path: '/categories/science'},
    ];

    const menuItems = [
        {name: 'Profile', path: '/profile'},
        {name: 'Course Dashboard', path: '/instructor/courses'},
    ];

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleUser = () => setIsUserOpen((prev) => !prev);

    const handleSignInAndSignUp = () => navigate('/auth');

    const closeDropdowns = () => {
        setIsDropdownOpen(false);
        setIsUserOpen(false);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/auth');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleViewSwitch = (path: string) => {
        navigate(path);
        closeDropdowns();
    };

    return (
        <>
            <header className='flex items-center justify-between p-4 px-10 bg-white shadow-sm'>
                <div className='flex items-center space-x-4'>
                    {/* Logo */}
                    <Link to='/' className='text-2xl font-bold no-underline'>
                        <span className='font-abhaya text-2xl text-primary'>
                            Learn
                        </span>
                        <span className='font-abhaya text-2xl text-tertiary'>
                            Hub.
                        </span>
                    </Link>

                    {/* Categories Dropdown */}
                    <div className='relative'>
                        <button
                            onClick={toggleDropdown}
                            className='font-abhaya font-semibold mt-1 ml-5 text-lg px-4 py-2 rounded-md hover:bg-gray-100 transition-colors'
                            aria-expanded={isDropdownOpen}
                        >
                            Categories
                        </button>

                        {isDropdownOpen && (
                            <div
                                className='absolute bg-white text-black mt-1 rounded-md shadow-lg z-20 w-48 ml-10'
                                onClick={closeDropdowns}
                            >
                                <ul className='py-1'>
                                    {categories.map((category) => (
                                        <li key={category.name}>
                                            <Link
                                                to={category.path}
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-abhaya no-underline'
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Auth Buttons / User Menu */}
                <div className='flex space-x-4'>
                    {!currentUser ? (
                        <div className='space-x-4'>
                            <button
                                onClick={handleSignInAndSignUp}
                                className='px-6 py-2 border border-primary text-primary rounded-3xl text-md font-abhaya font-bold hover:bg-primary hover:text-white transition-colors'
                            >
                                Sign In
                            </button>
                            <button
                                onClick={handleSignInAndSignUp}
                                className='px-6 py-2 bg-primary text-white rounded-3xl text-md font-abhaya font-bold hover:bg-primary-dark transition-colors'
                            >
                                Get Started
                            </button>
                        </div>
                    ) : (
                        <div className='relative'>
                            <button
                                onClick={toggleUser}
                                className='font-abhaya font-semibold text-lg px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2'
                                aria-expanded={isUserOpen}
                            >
                                <span>{currentUser.username || 'User'}</span>
                            </button>

                            {isUserOpen && (
                                <div
                                    className='absolute right-0 mt-2 bg-white rounded-md shadow-lg z-20 w-48'
                                    onClick={closeDropdowns}
                                >
                                    <ul className='py-1'>
                                        {menuItems.map((item) => (
                                            <li key={item.name}>
                                                <button
                                                    onClick={() =>
                                                        handleViewSwitch(
                                                            item.path,
                                                        )
                                                    }
                                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-abhaya'
                                                >
                                                    {item.name}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-abhaya'
                                            >
                                                Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <hr className='border-t gray opacity-15' />
        </>
    );
};

export default HeaderComponent;