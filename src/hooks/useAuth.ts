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
import {User} from '../types/user';
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

    const signIn = async (email: string, password: string, role: 'student' | 'instructor'): Promise<void> => {
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
                navigate('/home');
            } else {
                dispatch(clearUser());
            }
        } catch (error) {
            console.error('Sign In Error:', (error as Error).message);
        }
    };

    const signUp = async (userProfile: Omit<User, 'uid'> & {password: string}): Promise<void> => {
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
                uid: userCredential.user.uid,
                profile_image: randomProfilePicture,
            };

            await addUser(newUser);
            dispatch(setUser(newUser));
            navigate('/auth');
        } catch (error: unknown) {
            console.error('Sign Up Error:', (error as Error).message);
        }
    };

    const signUserOut = async (): Promise<void> => {
        try {
            dispatch(clearUser());
            dispatch(clearCourses());
            await signOut(auth);
            navigate('/auth');
        } catch (error: unknown) {
            console.error('Sign Out Error:', (error as Error).message);
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser: FirebaseUser | null) => {
                if (firebaseUser) {
                    const userProfile = (
                        await getUserById(firebaseUser.uid)
                    ) as User;
                    dispatch(setUser(userProfile));
                } else {
                    dispatch(clearUser());
                }
            },
        );
        return unsubscribe;
    }, [dispatch]);

    return {currentUser, isAuthenticated, signIn, signUp, signUserOut};
};
