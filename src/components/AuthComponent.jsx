import React from 'react';
import {useAuth} from '../hooks/useAuth';
import {useState} from 'react';

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
        <form onSubmit={handleSubmit}>
            {!isSignIn && (
                <div>
                    <input
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
            )}
            <input
                type='text'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit'>{isSignIn ? 'Sign In' : 'Sign Up'}</button>
            <button type='button' onClick={() => setSignIn(!isSignIn)}>
                {isSignIn ? 'Switch To Register' : 'Switch To Sign In'}
            </button>
        </form>
    );
};

export default AuthComponent;
