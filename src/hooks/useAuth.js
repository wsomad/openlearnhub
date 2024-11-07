///Login, Register, Logout
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from '../store/slices/authSlice';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import {auth} from '../services/FirebaseConfiguration';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            dispatch(setUser(userCredential.user));
        } catch (error) {
            console.error('Sign In Error:', error.message);
        }
    };

    const signUp = async (username, firstName, lastName, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            dispatch(setUser(userCredential.user));
        } catch (error) {
            console.error('Sign Up Error:', error.message);
        }
    };

    const signOut = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error('Sign Out Error: ', error.message);
        }
    };

    useEffect(() => {
        const subscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser(user));
            } else {
                dispatch(clearUser());
            }

            return () => subscribe();
        });
    }, [dispatch]);

    return {user, isAuthenticated, signIn, signOut, signUp};
};
