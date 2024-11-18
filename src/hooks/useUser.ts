import {useDispatch, useSelector} from 'react-redux';
import {
    addUser,
    getUserById,
    updateUserById,
    deleteUserById,
} from '../services/firestore/UserService';
import {setUser, modifyUser, clearUser} from '../store/slices/userSlice';
import {User} from '../types/user';

interface UserState {
    currentUser: User | null;
    userRole: 'student' | 'instructor';
}

export const useUser = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state: {users: UserState}) => state.users.currentUser,
    );
    const userRole = useSelector(
        (state: {users: UserState}) => state.users.userRole,
    );

    // Function to create a new user as 'student' (default role)
    const createUser = async (
        userRole: 'student' | 'instructor',
        userData: User,
    ): Promise<void> => {
        try {
            // If no user exists, create a new user with the provided role
            if (!currentUser) {
                await addUser({...userData, role: userRole});
                dispatch(setUser({...userData, role: userRole}));
            } else {
                console.log('User already exists, cannot create a new one');
            }
        } catch (error) {
            console.error('Failed to create user: ', error);
        }
    };

    // Function to toggle user role between 'student' and 'instructor'
    const toggleUserRole = async (): Promise<User | null> => {
        if (!currentUser) {
            console.log('No current user found.');
            return null;
        }

        const newRole =
            currentUser.role === 'student' ? 'instructor' : 'student';

        try {
            if (currentUser.role !== newRole) {
                const updatedUser = await updateUserById(currentUser.uid, {
                    role: newRole,
                });
                if (updatedUser) {
                    dispatch(modifyUser(updatedUser));
                    return updatedUser;
                }
            } else {
                console.log(`User is already a ${newRole}`);
            }
        } catch (error) {
            console.error(`Failed to change role to ${newRole}: `, error);
        }

        return null;
    };

    // Fetch user by ID and update Redux state
    const fetchUserById = async (uid: string): Promise<void> => {
        if (currentUser?.uid === uid) {
            console.log('User data already available in Redux for UID: ', uid);
            return;
        }

        try {
            const getUser = await getUserById(uid);
            if (getUser) {
                dispatch(setUser(getUser));
            }
        } catch (error) {
            console.error('Failed to fetch this specific user: ', error);
        }
    };

    // Update user by ID
    const updateUser = async (
        uid: string,
        updatedFields: Partial<User>,
    ): Promise<User | null> => {
        if (!uid) {
            console.error('UID is required to update user');
            return null;
        }

        try {
            // Perform the update operation
            const updatedUser = await updateUserById(uid, updatedFields);

            if (updatedUser) {
                // Update the Redux store with the new user data
                dispatch(modifyUser(updatedUser));
                console.log('User updated successfully:', updatedUser);
                return updatedUser;
            } else {
                console.error('Failed to fetch the updated user');
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        }
        return null; // Return null in case of failure
    };

    // Delete user by ID
    const deleteUser = async (uid: string): Promise<void> => {
        if (!uid) {
            console.error('UID is required to delete user');
            return;
        }

        try {
            // Perform the delete operation
            await deleteUserById(uid);

            // Clear the Redux user state
            dispatch(clearUser());
            console.log('User deleted successfully');
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return {
        currentUser,
        userRole,
        createUser,
        toggleUserRole, // Combined role toggle function
        fetchUserById,
        updateUser,
        deleteUser,
    };
};
