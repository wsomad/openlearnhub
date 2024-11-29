import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from '../store/slices/userSlice';
import {auth} from '../config/FirebaseConfiguration';
import {addUser, getUserById} from '../services/firestore/UserService';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User as FirebaseUser,
} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {AppDispatch, RootState} from '../store/store';
import {User} from '../types/user'; // Assuming you have a User type here.
import {dicebearStyle} from '../types/avatar';
import {generatedAvatarUrl} from '../api/dicebearApi';
import {clearCourses} from '../store/slices/courseSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.user.user);
    const isAuthenticated = useSelector(
        (state: RootState) => state.user.isAuthenticated,
    );

    /**
     * SignIn function
     */
    const signIn = async (
        email: string,
        password: string,
        role: 'student' | 'instructor',
    ): Promise<void> => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const currentUser = userCredential.user;

            if (currentUser) {
                const userProfile = (await getUserById(
                    currentUser.uid,
                )) as User;
                dispatch(setUser({...userProfile, role}));
                console.log(
                    'Successfully signed in as',
                    currentUser.uid,
                    'and user role is',
                    role,
                );
                navigate('/home');
            } else {
                dispatch(clearUser());
            }
        } catch (error: unknown) {
            console.error('Sign In Error:', (error as Error).message);
        }
    };

    const generateRandomProfilePicture = async (): Promise<string> => {
        const styles: dicebearStyle[] = [
            'adventurer',
            'adventurer-neutral',
            'avataaars',
            'avataaars-neutral',
            'big-ears',
            'big-smile',
            'bottts',
            'bottts-neutral',
            'croodles',
            'croodles-neutral',
            'dylan',
            'fun-emoji',
            'lorelei',
            'lorelei-neutral',
            'micah',
            'miniavs',
            'notionists',
            'notionists-neutral',
            'open-peeps',
            'personas',
            'pixel-art',
            'pixel-art-neutral',
            'rings',
            'shapes',
            'thumbs',
        ];

        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        const randomSeed = Math.random().toString(36).substring(2, 15);
        return generatedAvatarUrl(randomStyle, randomSeed);
    };

    /**
     * SignUp function
     */
    const signUp = async (
        userProfile: Omit<User, 'uid'> & {password: string},
    ): Promise<void> => {
        const {email, password} = userProfile;
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const randomProfilePicture = await generateRandomProfilePicture();

            const newUser: User = {
                ...userProfile,
                uid: userCredential.user.uid, // Add UID from Firebase
                profile_image: randomProfilePicture,
            };

            if (newUser.profile_image) {
                console.log(
                    '[USEAUTH] - Successfully generate random profile image for user.',
                );
            }

            await addUser(newUser); // Save user to Firestore
            console.log(
                'Successfully signed up as',
                newUser.uid,
                'and user role is',
                userProfile.role,
            );

            dispatch(setUser(newUser));
            navigate('/auth');
        } catch (error: unknown) {
            console.error('Sign Up Error:', (error as Error).message);
        }
    };

    /**
     * SignOut function
     */
    const signUserOut = async (): Promise<void> => {
        try {
            await signOut(auth);
            dispatch(clearUser());
            dispatch(clearCourses());
            navigate('/auth');
        } catch (error: unknown) {
            console.error('Sign Out Error:', (error as Error).message);
        }
    };

    // Listen for auth state changes and fetch user data on login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser: FirebaseUser | null) => {
                if (firebaseUser) {
                    const userProfile = (await getUserById(
                        firebaseUser.uid,
                    )) as User;
                    dispatch(setUser(userProfile));
                } else {
                    dispatch(clearUser());
                }
            },
        );

        return unsubscribe; // Cleanup the listener when the component unmounts
    }, [dispatch]);

    return {currentUser, isAuthenticated, signIn, signUp, signUserOut};
};
