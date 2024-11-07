import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from '../store/slices/authSlice';
import {auth} from '../services/FirebaseConfiguration';
import {
    createUserDocument,
    fetchUserDocument,
} from '../services/FirestoreUserService';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import UserModel from '../models/UserModel';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // SignIn function
    const signIn = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Successfully sign in.');
            // No need to fetch user profile here, since onAuthStateChanged will handle it
        } catch (error) {
            console.error('Sign In Error:', error);
        }
    };

    // SignUp function
    const signUp = async (username, firstName, lastName, email, password) => {
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
            );
            await createUserDocument(userProfile.toJSON());
            console.log(
                'Successfully sign up and create user data into firestore.',
            ); // Call toJSON to ensure it's in JSON format
            dispatch(setUser(userProfile.toJSON())); // Dispatch JSON format as well
        } catch (error) {
            console.error('Sign Up Error:', error);
        }
    };

    // SignOut function
    const signOutUser = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser()); // Clear user data on sign out
        } catch (error) {
            console.error('Sign Out Error:', error);
        }
    };

    // Listen for auth state changes and fetch user data on login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userProfile = await fetchUserDocument(user.uid); // Fetch full user profile
                dispatch(setUser(userProfile));
            } else {
                dispatch(clearUser());
            }
        });
        return unsubscribe;
    }, [dispatch]);

    return {user, isAuthenticated, signIn, signUp, signOut: signOutUser};
};
