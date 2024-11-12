import {useDispatch, useSelector} from 'react-redux';
import {
    addUser,
    getUserById,
    adjustUser,
    deleteUserById,
} from '../services/firestore/UserService';
import {setUser} from '../store/slices/userSlice';

export const useUser = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.users.currentUser);
    const allUsers = useSelector((state) => state.users.allUsers);

    const createUser = async (userData) => {
        try {
            const newUser = await addUser(userData);
            dispatch(setUser(newUser));
        } catch (error) {
            console.error('Failed to create new user: ', error);
        }
    };

    const fetchUserById = async (uid) => {
        try {
            const getUser = await getUserById(uid);
            dispatch(setUser(getUser));
        } catch (error) {
            console.error('Failed to fetch this specific user: ', error);
        }
    };

    const updateUser = async (uid, updatedUser) => {
        try {
            await adjustUser(uid, updatedUser);
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
            dispatch(clearCourse(course_id));
        } catch (error) {
            console.error('Failed to delete course: ', error);
        }
    };

    return {
        currentUser,
        allUsers,
        createUser,
        fetchUserById,
        updateUser,
        deleteUser,
    };
};
