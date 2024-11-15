import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {useUser} from '../hooks/useUser';

const HeaderComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userType, setUserType] = useState('student');
    const {user} = useAuth();
    const {currentUser, fetchUserById} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        let isCancelled = false;

        const fetchUser = async () => {
            if (user && user.uid && !isCancelled) {
                try {
                    await fetchUserById(user.uid);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };

        // Only fetch if we actually have a valid `user` and `user.uid`.
        if (user && user.uid) {
            fetchUser();
        }

        return () => {
            isCancelled = true;
        };
    }, [user?.uid, fetchUserById]);

    const categories = [
        {name: 'Development', path: '/development'},
        {name: 'Language', path: '/language'},
        {name: 'Nature', path: '/nature'},
        {name: 'Science', path: '/science'},
    ];

    const studentMenu = [
        {name: 'Profile', path: '/profile'},
        {name: 'Course Enrolled', path: '/course-enrolled'},
        {name: 'Go to Instructor Site', path: '/instructor'},
    ];

    const instructorMenu = [
        {name: 'Profile', path: '/profile'},
        {name: 'Course Dashboard', path: '/course-dashboard'},
        {name: 'Go to Student Site', path: '/student'},
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleUser = () => {
        setIsUserOpen((prev) => !prev);
    };

    const handleSignInAndSignUp = () => {
        navigate('/auth');
    };

    const handleCategoryClick = (path) => {
        setIsDropdownOpen(false);
        navigate(path);
    };

    const handleUserClick = (path) => {
        setIsUserOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/auth');
    };

    return (
        <>
            <header className='flex items-center justify-between p-4 px-10'>
                <div className='flex items-center space-x-4'>
                    <div className='text-2xl font-bold'>
                        <span className='font-abhaya text-2xl text-primary'>
                            OpenLearn
                        </span>
                        <span className='font-abhaya text-2xl text-tertiary'>
                            Hub.
                        </span>
                    </div>

                    <div className='relative'>
                        <button
                            onClick={toggleDropdown}
                            className='font-abhaya font-semibold mt-1 ml-5 text-lg bg-gray-800 hover:bg-gray-700 rounded-md'
                        >
                            Categories
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out absolute bg-white text-black mt-1 rounded-sm shadow-lg z-20 w-48 ml-10 transform ${
                                isDropdownOpen
                                    ? 'opacity-100 h-auto'
                                    : 'opacity-0 h-0'
                            } overflow-hidden`}
                        >
                            <ul>
                                {categories.map((category) => (
                                    <li
                                        key={category.name}
                                        className='font-abhaya p-2 hover:bg-gray-200 mr-12'
                                    >
                                        <button
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category.path,
                                                )
                                            }
                                            className='w-full text-left ml-2'
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='flex space-x-4'>
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={handleSignInAndSignUp}
                                className='w-32 h-10 border border-primary text-primary rounded-3xl text-md font-abhaya font-bold'
                            >
                                Sign In
                            </button>
                            <button
                                onClick={handleSignInAndSignUp}
                                className='w-32 h-10 bg-primary text-white rounded-3xl text-md font-abhaya font-bold'
                            >
                                Get Started
                            </button>
                        </>
                    ) : (
                        <div className='relative'>
                            <div className='flex justify-end'>
                                {' '}
                                {/* Adjust to align the button to the right */}
                                <button
                                    onClick={toggleUser}
                                    className='font-abhaya font-semibold text-lg bg-gray-800 hover:bg-gray-700 rounded-md text-right' // Align text to the right
                                >
                                    {currentUser
                                        ? currentUser.username
                                        : 'User'}
                                </button>
                            </div>

                            <div
                                className={`transition-all duration-300 ease-in-out absolute bg-white text-center text-black mt-1 rounded-sm shadow-lg z-20 w-48 ${
                                    isUserOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <ul>
                                    {(userType === 'student'
                                        ? studentMenu
                                        : instructorMenu
                                    ).map((item) => (
                                        <li
                                            key={item.name}
                                            className='font-abhaya p-2 hover:bg-gray-200'
                                        >
                                            <button
                                                onClick={() =>
                                                    handleUserClick(item.path)
                                                }
                                                className='w-full text-left ml-2'
                                            >
                                                {item.name}
                                            </button>
                                        </li>
                                    ))}
                                    <li className='font-abhaya p-2 hover:bg-gray-200'>
                                        <button
                                            onClick={handleLogout}
                                            className='w-full text-left ml-2'
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <hr className='border-t gray opacity-15' />
        </>
    );
};

export default HeaderComponent;
