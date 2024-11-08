import React from 'react';
import {useAuth} from '../hooks/useAuth';
import {useState} from 'react';
import authImage from '../images/authimage.png';

const AuthComponent = () => {
    const {signIn, signUp, isAuthenticated} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSignIn, setSignIn] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignIn) {
            signIn(email, password);
            console.log('Email');
        } else {
            signUp(email, password, firstName, lastName, username);
            console.log('Email', email);
        }
    };

    return (
        <div className='flex w-full h-screen'>
            {/* Sidebar for larger screens */}
            <div className='hidden lg:flex h-full w-1/3 items-center justify-center bg-background flex-col p-8'>
                <div className='absolute top-4 left-8 text-2xl font-bold mt-8'>
                    <span className='text-secondary'>Learn</span>
                    <span className='text-primary'>Hub</span>
                </div>

                <img
                    src={authImage}
                    alt='Educational Illustration'
                    className='w-3/4 h-auto mx-auto'
                />

                <div className='text-center mb-32'>
                    <h2 className='text-5xl font-bold'>
                        <span className='block text-black'>Unlock Your</span>
                        <span className='block text-black'>Potential</span>
                        <span className='block text-primary'>
                            With LearnHub
                        </span>
                    </h2>
                </div>
            </div>
            {/* Main form container */}
            <div className='w-full flex items-center justify-center lg:w-1/2'>
                <form onSubmit={handleSubmit} className='w-full max-w-xl'>
                    {/* Form title */}
                    <h1 className='text-5xl font-semibold mb-6'>
                        {isSignIn ? 'Login' : 'Create Account'}
                    </h1>

                    {/* Conditionally rendered sign-up fields */}
                    {!isSignIn && (
                        <div className='space-y-4'>
                            <div>
                                <label className='text-lg font-medium mb-1 block'>
                                    First Name
                                </label>
                                <input
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent'
                                    type='text'
                                    placeholder='First Name'
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className='text-lg font-medium mb-1 block'>
                                    Last Name
                                </label>
                                <input
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent'
                                    type='text'
                                    placeholder='Last Name'
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className='text-lg font-medium mb-1 block'>
                                    Username
                                </label>
                                <input
                                    className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent'
                                    type='text'
                                    placeholder='Username'
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {/* Common email and password fields */}
                    <div className='space-y-4 mt-4'>
                        <div>
                            <label className='text-lg font-medium mb-1 block'>
                                Email
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent'
                                type='text'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className='text-lg font-medium mb-1 block'>
                                Password
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='mt-8 flex flex-col gap-y-4'>
                        <button
                            className='w-full py-3 rounded-3xl bg-primary !text-white text-lg active:scale-[.98]'
                            type='submit'
                        >
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </button>
                        <button
                            type='button'
                            className='text-primary hover:underline'
                            onClick={() => setSignIn(!isSignIn)}
                        >
                            {isSignIn
                                ? 'Don’t have an account? Sign Up'
                                : 'Already have an account? Login'}
                        </button>
                    </div>

                    <div className='flex items-center my-4'>
                        <hr className='flex-grow border-t border-gray-300' />
                        <span className='mx-2 text-gray-500 font-bold'>or</span>
                        <hr className='flex-grow border-t border-gray-300' />
                    </div>

                    <button
                        type='button'
                        className='w-full flex items-center justify-center py-3 border-2 border-gray-300 rounded-3xl hover:bg-gray-100'
                    >
                        <span className='text-lg'>Continue with Google</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthComponent;
