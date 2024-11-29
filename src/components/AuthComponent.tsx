import React, {useState, FormEvent} from 'react';
import {useAuth} from '../hooks/useAuth';
import authImage from '../assets/images/authimage.png';
import {FaGoogle} from 'react-icons/fa';
import {useUser} from '../hooks/useUser';
import {User} from '../types/user';
import {toast} from 'react-toastify'; // Optional: Include toast notifications
import {useSelector} from 'react-redux';

const AuthComponent: React.FC = () => {
    const {signIn, signUp} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [isSignIn, setSignIn] = useState(true);
    const {userRole} = useUser();
    const currentState = useSelector((state) => state);
    console.log('Current State from Selector:', currentState);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignIn) {
            try {
                await signIn(email, password, userRole);
                toast.success("Welcome back! You've signed in.");
            } catch (error) {
                toast.error(
                    'Failed to sign in. Please check your credentials.',
                );
                console.error('Error during sign-in:', error);
            }
        } else {
            const defaultUserProfile: Omit<User, 'uid'> & {password: string} = {
                email,
                password,
                username,
                firstname,
                lastname,
                role: userRole,
                profile_image: '../assets/images/userProfile.png',
                created_at: new Date(),
                updated_at: new Date(),
            };
            try {
                await signUp(defaultUserProfile);
                toast.success('Account created successfully! Please sign in.');
                setSignIn(true);
            } catch (error) {
                toast.error('Failed to create account. Please try again.');
                console.error('Error during sign-up:', error);
            }
        }
    };

    return (
        <div className='flex w-full h-screen'>
            {/* Sidebar for larger screens */}
            <div className='hidden lg:flex h-full w-1/3 items-center justify-center bg-background flex-col p-8'>
                <div className='absolute top-4 left-8 text-2xl font-bold mt-8'>
                    <span className='font-abhaya text-3xl text-primary'>
                        OpenLearn
                    </span>
                    <span className='font-abhaya text-3xl text-tertiary'>
                        Hub.
                    </span>
                </div>
                <img
                    src={authImage}
                    alt='Educational Illustration'
                    className='w-3/4 h-auto mx-auto'
                />
                <div className='text-center mb-32'>
                    <h2 className='text-5xl font-bold'>
                        <span className='font-abhaya text-7xl block text-black'>
                            Unlock Your
                        </span>
                        <span className='font-abhaya text-7xl block text-black'>
                            Potential
                        </span>
                        <span className='font-abhaya text-7xl block'>
                            <span className='text-black'>With </span>
                            <span className='text-primary'>Learn</span>
                            <span className='text-black'>Hub.</span>
                        </span>
                    </h2>
                </div>
            </div>

            {/* Main form container */}
            <div className='w-full flex items-center justify-center lg:w-1/2'>
                <form onSubmit={handleSubmit} className='w-full max-w-xl'>
                    <h1 className='font-abhaya text-5xl font-bold mb-6'>
                        {isSignIn ? 'Sign In' : 'Sign Up'}
                    </h1>

                    {!isSignIn && (
                        <div className='space-y-4'>
                            <div>
                                <label className='font-abhaya font-bold text-lg mb-1 block'>
                                    First Name
                                </label>
                                <input
                                    id='firstName'
                                    className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                    type='text'
                                    placeholder='First Name'
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='lastName'
                                    className='font-abhaya text-lg font-medium mb-1 block'
                                >
                                    Last Name
                                </label>
                                <input
                                    id='lastName'
                                    className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                    type='text'
                                    placeholder='Last Name'
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='username'
                                    className='font-abhaya text-lg font-medium mb-1 block'
                                >
                                    Username
                                </label>
                                <input
                                    id='username'
                                    className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                    type='text'
                                    placeholder='Username'
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className='space-y-4 mt-4'>
                        <div>
                            <label
                                htmlFor='email'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Email
                            </label>
                            <input
                                id='email'
                                className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                type='email'
                                placeholder='Email@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='password'
                                className='font-abhaya text-lg font-medium mb-1 block'
                            >
                                Password
                            </label>
                            <input
                                id='password'
                                className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='mt-8 flex flex-col gap-y-4'>
                        <button
                            className='w-full py-3 bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                            type='submit'
                        >
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </button>
                        <div className='flex justify-center items-center text-black font-abhaya text-lg font-medium mb-1'>
                            {isSignIn ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        type='button'
                                        className='text-secondary font-bold hover:underline ml-1'
                                        onClick={() => setSignIn(false)}
                                    >
                                        Sign Up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type='button'
                                        className='text-secondary font-bold hover:underline ml-1'
                                        onClick={() => setSignIn(true)}
                                    >
                                        Sign In
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center my-4'>
                        <hr className='flex-grow border-t border-gray-300' />
                        <span className='mx-2 text-gray-500 font-medium font-abhaya'>
                            or
                        </span>
                        <hr className='flex-grow border-t border-gray-300' />
                    </div>

                    <button
                        type='button'
                        className='w-full flex items-center justify-center py-3 border border-gray hover:bg-gray-100'
                        onClick={() => {
                            /* Handle Google sign-in */
                        }}
                    >
                        <FaGoogle className='text-xl mr-3' />
                        <span className='text-lg font-abhaya'>
                            Continue with Google
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthComponent;
