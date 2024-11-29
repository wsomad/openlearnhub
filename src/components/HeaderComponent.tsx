import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {useAuth} from '../hooks/useAuth';
import {useUser} from '../hooks/useUser';

interface Category {
    name: string;
    path: string;
    onClick?: () => Promise<void>;
}

interface MenuItem {
    name: string;
    path: string;
    onClick?: () => Promise<void>;
}

const HeaderComponent: React.FC = () => {
    const navigate = useNavigate();
    const {signUserOut} = useAuth();
    const {currentUser, userRole, fetchUserById, toggleUserRole} = useUser();
    const [IsCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
        useState<boolean>(false);
    const [IsUserDropdownOpen, setIsUserDropdownOpen] =
        useState<boolean>(false);
    // const currentState = useSelector((state) => state);
    // console.log('Current State from Selector:', currentState);

    // List of objects under categories.
    const categories: Category[] = [
        {name: 'Development', path: '/categories/development'},
        {name: 'Language', path: '/categories/language'},
        {name: 'Nature', path: '/categories/nature'},
        {name: 'Science', path: '/categories/science'},
    ];

    // List of student menus for student.
    const studentMenu: MenuItem[] = [
        {name: 'Profile', path: '/profile'},
        {name: 'Enrolled Courses', path: '/listofenrolledcourse'},
        ...(userRole === 'student'
            ? [
                  {
                      name: 'Switch to Instructor',
                      path: '/instructor/dashboard',
                      onClick: async () => {
                          await toggleUserRole();
                      },
                  },
              ]
            : []),
    ];

    // List of instructor menus for instructor.
    const instructorMenu: MenuItem[] = [
        ...(userRole === 'instructor'
            ? [{name: 'Profile', path: '/profile'}]
            : []),
        {name: 'Course Dashboard', path: '/courses'},
        ...(userRole === 'instructor'
            ? [
                  {
                      name: 'Switch to Student',
                      path: '/home',
                      onClick: async () => {
                          await toggleUserRole();
                      },
                  },
              ]
            : []),
    ];

    // Run this side effect to fetch current user data.
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser?.uid) {
                try {
                    fetchUserById(currentUser.uid);
                } catch (error) {
                    console.error(
                        `Failed to fetch user ${currentUser.uid}:`,
                        error,
                    );
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    // Open categories dropdown.
    const toggleCategoriesDropdown = () =>
        setIsCategoriesDropdownOpen((prev) => !prev);

    // Open user dropdown.
    const toggleUserDropdown = () => setIsUserDropdownOpen((prev) => !prev);

    // Set both dropdowns to be closed.
    const closeAllMenus = () => {
        setIsCategoriesDropdownOpen(false);
        setIsUserDropdownOpen(false);
    };

    // Handle navigation of sign in/sign up process.
    const handleSignInAndSignUp = () => navigate('/auth');

    // Handle navigation of sign out process.
    const handleSignOut = async () => {
        try {
            await signUserOut();
            navigate('/auth');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    const handleViewSwitch = (path: string) => {
        // navigate(`/home${path}`);
        navigate(path);
        closeAllMenus();
    };

    const menuItems = userRole === 'instructor' ? instructorMenu : studentMenu;

    return (
        <>
            {(IsCategoriesDropdownOpen || IsUserDropdownOpen) && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-10'
                    onClick={closeAllMenus}
                ></div>
            )}

            <header className='flex items-center justify-between p-4 px-10 bg-white shadow-sm'>
                <div className='flex items-center space-x-4'>
                    <Link
                        to='/home'
                        className='text-2xl font-bold no-underline'
                    >
                        <span className='font-abhaya text-2xl text-primary'>
                            OpenLearn
                        </span>
                        <span className='font-abhaya text-2xl text-tertiary'>
                            Hub.
                        </span>
                    </Link>

                    {userRole === 'student' && (
                        <div className='relative'>
                            <button
                                onClick={toggleCategoriesDropdown}
                                className='font-abhaya font-semibold ml-4 text-lg px-4 py-2 rounded-md hover:bg-gray-100 transition-colors'
                                aria-expanded={IsCategoriesDropdownOpen}
                            >
                                Categories
                            </button>

                            {IsCategoriesDropdownOpen && (
                                <div
                                    className='absolute bg-white mt-2 text-black shadow-lg z-20 w-48 ml-5'
                                    onClick={toggleCategoriesDropdown}
                                >
                                    <ul className='py-1'>
                                        {categories.map((category) => (
                                            <li key={category.name}>
                                                <Link
                                                    to={category.path}
                                                    className='font-abhaya font-semibold block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 font-abhaya no-underline'
                                                >
                                                    {category.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

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
                            <div className='flex items-center'>
                                <button
                                    onClick={toggleUserDropdown}
                                    className='font-abhaya font-semibold text-lg py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2'
                                    aria-expanded={IsUserDropdownOpen}
                                >
                                    <img
                                        src={currentUser?.profile_image}
                                        alt={`${currentUser.username}'s Profile`}
                                        className='w-8 h-8 border rounded-full object-cover'
                                    />
                                    <span>
                                        {currentUser?.username || 'User'}
                                    </span>
                                </button>
                            </div>

                            {IsUserDropdownOpen && (
                                <div className='absolute right-0 mt-2 bg-white shadow-lg z-20 w-48'>
                                    <ul className='py-1'>
                                        {menuItems.map((item) => (
                                            <li key={item.name}>
                                                <button
                                                    onClick={async () => {
                                                        if (item.onClick) {
                                                            await item.onClick();
                                                        }
                                                        handleViewSwitch(
                                                            item.path,
                                                        );
                                                    }}
                                                    className='font-abhaya font-semibold text-md w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
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

                                        <li>
                                            <button
                                                onClick={handleSignOut}
                                                className='font-abhaya font-semibold text-md w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-abhaya'
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
