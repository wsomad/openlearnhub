///Login, Register, Logout
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from '../store/slices/authSlice';
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {db} from '../services/FirebaseConfiguration';
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

            const user = userCredential.user;
            const userDocRef = doc(db, 'user', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userDetails = userDoc.data();

                dispatch(
                    setUser({
                        uid: userDetails.uid,
                        email: userDetails.email,
                        firstName: userDetails.firstName,
                        lastName: userDetails.lastName,
                        username: userDetails.username,
                    }),
                );
            } else {
                console.log('No user details found in Firestore');
            }
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

            const user = userCredential.user;
            await setDoc(doc(db), 'user', user.uid),
                {
                    uid: user.uid,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: email,
                    password: password,
                };
            dispatch(
                setUser({
                    uid: user.uid,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: email,
                }),
            );
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
