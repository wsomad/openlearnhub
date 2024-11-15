import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from '../store/slices/authSlice';
import {auth} from '../config/FirebaseConfiguration';
import {addUser, getUserById} from '../services/firestore/UserService';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import UserModel from '../models/UserModel';
import {useNavigate} from 'react-router-dom';

export const useAuth = () => {
    // To dispatch an action
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // SignIn function
    const signIn = async (email, password, role) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (user) {
                const userProfile = await getUserById(user.uid); // Fetch full user profile
                dispatch(setUser({...userProfile, role}));
            } else {
                dispatch(clearUser());
            }
            console.log(
                'Successfully sign in as',
                user.uid,
                'and user role is',
                role,
            );
            navigate('/home');
            // No need to fetch user profile here, since onAuthStateChanged will handle it
        } catch (error) {
            console.error('Sign In Error:', error);
        }
    };

    // SignUp function
    const signUp = async (
        username,
        firstName,
        lastName,
        email,
        password,
        role,
    ) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const userProfile = new UserModel(
                userCredential.user.uid,
                email,
                firstName,
                lastName,
                username,
                role,
            );
            await addUser(userProfile.toJSON());
            console.log(
                'Successfully sign up as',
                user.uid,
                'and user role is',
                role,
            );
            dispatch(setUser({...userProfile.toJSON(), role})); // Dispatch JSON format as well
            navigate('/auth');
        } catch (error) {
            console.error('Sign Up Error:', error);
        }
    };

    // SignOut function
    const signUserOut = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser()); // Clear user data on sign out
            navigate('/auth');
        } catch (error) {
            console.error('Sign Out Error:', error);
        }
    };

    // // Listen for auth state changes and fetch user data on login
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //         if (user) {
    //             const userProfile = await getUserById(user.uid); // Fetch full user profile
    //             dispatch(setUser(userProfile));
    //         } else {
    //             dispatch(clearUser());
    //         }
    //     });
    //     return unsubscribe;
    // }, [dispatch]);

    return {user, isAuthenticated, signIn, signUp, signOut};
};
