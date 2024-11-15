import {useDispatch, useSelector} from 'react-redux';
import {
    addUserAsInstructor,
    addUserAsStudent,
    getUserById,
    updateUserById,
    deleteUserById,
} from '../services/firestore/UserService';
import {setUser, modifyUser, clearUser} from '../store/slices/userSlice';

export const useUser = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.users.currentUser);
    const userRole = useSelector((state) => state.users.userRole);

    const createUser = async (userRole, userData) => {
        try {
            if (userRole === 'instructor') {
                const instructorUser = await addUserAsInstructor(userData);
                dispatch(setUser({...instructorUser, userRole}));
            } else if (userRole === 'student') {
                const studentUser = await addUserAsStudent(userData);
                dispatch(setUser({...studentUser, userRole}));
            }
        } catch (error) {
            console.error(`Failed to create ${userRole} as user: `, error);
        }
    };

    const fetchUserById = async (uid) => {
        if (currentUser?.uid === uid) {
            console.log('User data already available in Redux for UID: ', uid);
            // If the user is already in Redux, no need to fetch again.
            return;
        }
        try {
            const getUser = await getUserById(uid);
            dispatch(setUser(getUser));
        } catch (error) {
            console.error('Failed to fetch this specific user: ', error);
        }
    };

    const updateUser = async (uid, updatedUser) => {
        try {
            await updateUserById(uid, updatedUser);
            dispatch(
                modifyUser({
                    id: uid,
                    updatedUser: updatedUser,
                }),
            );
        } catch (error) {
            console.error('Failed to update user: ', error);
        }
    };
    const deleteUser = async (uid) => {
        try {
            await deleteUserById(uid);
            dispatch(clearUser(course_id));
        } catch (error) {
            console.error('Failed to delete course: ', error);
        }
    };

    return {
        currentUser,
        userRole,
        createUser,
        fetchUserById,
        updateUser,
        deleteUser,
    };
};
