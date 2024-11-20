import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {useAuth} from '../hooks/useAuth';
import {useUser} from '../hooks/useUser';
//import { ViewMode } from '../types/shared';
import {User, UserRole} from '../types/user';

interface Category {
    name: string;
    path: string;
}

interface MenuItem {
    name: string;
    path: string;
}

interface HeaderComponentProps {
    //userType: ViewMode;
    currentRole: UserRole;
    onToggleView: () => void;
    // userId: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    //userType,
    currentRole,
    onToggleView,
    // userId,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const {user, signUserOut} = useAuth();
    const {currentUser, fetchUserById} = useUser();
    //const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            if (currentUser?.uid && isMounted) {
                try {
                    fetchUserById(currentUser?.uid);
                    console.log(currentUser?.uid);
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

    // // Fetch user data from dummyData.json
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await fetch('/dummyData.json');
    //             const data = await response.json();
    //             const user = data.users.find((u: User) => u.uid === userId);
    //             if (user) {
    //                 setCurrentUser(user);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch user:', error);
    //         }
    //     };

    //     fetchUserData();
    // }, [userId]);

    const categories: Category[] = [
        {name: 'Development', path: '/categories/development'},
        {name: 'Language', path: '/categories/language'},
        {name: 'Nature', path: '/categories/nature'},
        {name: 'Science', path: '/categories/science'},
    ];

    const studentMenu: MenuItem[] = [
        {name: 'Profile', path: '/profile'},
        {name: 'Enrolled Courses', path: '/courses/enrolled'},
        ...(currentRole === 'instructor'
            ? [{name: 'Switch to Instructor', path: '/instructor/dashboard'}]
            : []),
    ];

    const instructorMenu: MenuItem[] = [
        {name: 'Profile', path: '/profile'},
        {name: 'Course Dashboard', path: '/instructor/courses'},
        ...(currentRole === 'student'
            ? [{name: 'Switch to Student', path: '/courses/enrolled'}]
            : []),
    ];

    const closeAllMenus = () => {
        setIsDropdownOpen(false);
        setIsUserOpen(false);
    };

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleUser = () => setIsUserOpen((prev) => !prev);

    const handleSignInAndSignUp = () => navigate('/auth');

    const handleLogout = async () => {
        try {
            await signUserOut();
            navigate('/auth');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleViewSwitch = (path: string) => {
        if (path.includes('Switch to')) {
            onToggleView();
        }
        navigate(path);
        closeAllMenus();
    };

    const menuItems =
        currentRole === 'instructor' ? instructorMenu : studentMenu;

    return (
        <>
            {(isDropdownOpen || isUserOpen) && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-10'
                    onClick={closeAllMenus}
                ></div>
            )}

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
                                onClick={toggleDropdown}
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
                            <div className='flex items-center space-x-4'>
                                {/* User Dropdown Button */}
                                <button
                                    onClick={toggleUser}
                                    className='font-abhaya font-semibold text-lg px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2'
                                    aria-expanded={isUserOpen}
                                >
                                    <img
                                        src={
                                            currentUser?.profile_image ||
                                            '/path/to/default/image.jpg'
                                        }
                                        alt={`${currentUser.username}'s Profile`}
                                        className='w-8 h-8 border rounded-full object-cover'
                                    />
                                    <span>
                                        {currentUser?.username || 'User'}
                                    </span>
                                </button>
                            </div>

                            {/* User Dropdown Menu */}
                            {isUserOpen && (
                                <div className='absolute right-0 mt-2 bg-white rounded-md shadow-lg z-20 w-48'>
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

                                        {/* Add "Go to Student/Instructor Page" Option
                                        {currentRole === 'instructor' && (
                                            <li>
                                                <button
                                                    onClick={() =>
                                                        handleViewSwitch(
                                                            userType ===
                                                                'student'
                                                                ? '/instructor/dashboard'
                                                                : '/courses/enrolled',
                                                        )
                                                    }
                                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-abhaya'
                                                >
                                                    Go to{' '}
                                                    {userType === 'student'
                                                        ? 'Instructor Page'
                                                        : 'Student Page'}
                                                </button>
                                            </li>
                                        )} */}

                                        {/* Sign Out Option */}
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
