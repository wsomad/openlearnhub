import 'react-toastify/dist/ReactToastify.css';
import '../toast.css';

import React, { FormEvent, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { User } from '../types/user';

const AuthComponent: React.FC = () => {
    const {signIn, signUp} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [isSignIn, setSignIn] = useState(true);
    const {userRole} = useUser();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignIn) {
            try {
                await signIn(email, password, userRole);
                toast.success('Successfully logged in!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                });
            } catch (error: any) {
                const errorMessage =
                    error.code === 'auth/wrong-password' ||
                    error.code === 'auth/user-not-found'
                        ? 'Incorrect email/password, try again!'
                        : 'An error occurred during sign in. Please try again.';

                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                });
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
                student: {},
                instructor: {
                    hasRegister: false,
                },
            };

            try {
                await signUp(defaultUserProfile);
                toast.success('Account created successfully! Please sign in.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                });
                setTimeout(() => {
                    setSignIn(true);
                }, 1000);
            } catch (error: any) {
                const errorMessage =
                    error.code === 'auth/email-already-in-use'
                        ? 'Failed to create account. Please try again.'
                        : 'Email is already registered. Please use a different email.';

                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                });
                console.error('Error during sign-up:', error);
            }
        }
    };

    return (
        <div className='min-h-screen bg-white relative'>
            <ToastContainer style={{fontFamily: '"Abhaya Libre", serif'}} />

            <div
                className='absolute top-4 left-4 font-abhaya cursor-pointer'
                onClick={() => setSignIn(true)}
            >
                <h1 className='text-2xl font-bold'>
                    <span className='text-primary'>OpenLearn</span>
                    <span className='text-tertiary'>Hub.</span>
                </h1>
            </div>

            <div className='min-h-screen flex flex-col items-center justify-center p-4'>
                <div className='w-full max-w-lg bg-white p-8 rounded-lg'>
                    <form
                        role='form'
                        onSubmit={handleSubmit}
                        className='space-y-6'
                    >
                        <h2 className='font-abhaya text-4xl font-bold text-center mb-4'>
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </h2>

                        {!isSignIn && (
                            <div className='space-y-4'>
                                <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
                                    <div className='flex-1'>
                                        <label className='font-abhaya font-bold text-lg mb-1 block'>
                                            First Name
                                        </label>
                                        <input
                                            className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                            type='text'
                                            placeholder='First Name'
                                            value={firstname}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <label className='font-abhaya text-lg font-bold mb-1 block'>
                                            Last Name
                                        </label>
                                        <input
                                            className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                            type='text'
                                            placeholder='Last Name'
                                            value={lastname}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='font-abhaya text-lg font-bold mb-1 block'>
                                        Username
                                    </label>
                                    <input
                                        className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
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

                        <div className='space-y-4'>
                            <div>
                                <label className='font-abhaya text-lg font-bold mb-1 block'>
                                    Email
                                </label>
                                <input
                                    className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                    type='email'
                                    placeholder='Email@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className='font-abhaya text-lg font-bold mb-1 block'>
                                    Password
                                </label>
                                <input
                                    className='w-full border border-gray-300 p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <button
                                className='w-full py-3 bg-primary text-white text-lg active:scale-95 font-abhaya transition-transform'
                                type='submit'
                            >
                                {isSignIn ? 'Sign In' : 'Sign Up'}
                            </button>
                            <div className='text-center font-abhaya text-lg'>
                                {isSignIn ? (
                                    <p>
                                        Don't have an account?{' '}
                                        <button
                                            type='button'
                                            className='text-secondary font-bold hover:underline'
                                            onClick={() => setSignIn(false)}
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?{' '}
                                        <button
                                            type='button'
                                            className='text-secondary font-bold hover:underline'
                                            onClick={() => setSignIn(true)}
                                        >
                                            Sign In
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <hr className='flex-grow border-t border-gray-300' />
                            <span className='px-4 text-gray-500 font-medium font-abhaya'>
                                or
                            </span>
                            <hr className='flex-grow border-t border-gray-300' />
                        </div>

                        <button
                            type='button'
                            className='w-full flex items-center justify-center py-3 border border-gray-300 hover:bg-gray-50 transition-colors'
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
        </div>
    );
};

export default AuthComponent;
