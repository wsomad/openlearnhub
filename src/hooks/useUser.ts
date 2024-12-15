import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import {
	addUser,
	deleteUserById,
	getUserById,
	updateUserById,
} from '../services/firestore/UserService';
import {
	clearCourses,
	clearSearchCourseResults,
	clearSingleCourse,
} from '../store/slices/courseSlice';
import { clearUser, modifyUser, setUser } from '../store/slices/userSlice';
import { RootState } from '../store/store';
import { User } from '../types/user';

export const useUser = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.user);
    const userRole = useSelector((state: RootState) => state.user.userRole);
    const navigate = useNavigate();

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

    // Fetch user by ID and update Redux state
    const fetchUserById = async (uid: string): Promise<void> => {
        if (currentUser?.uid === uid) {
            console.log(`This user ${uid} data is already available in Redux.`);
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
                dispatch(modifyUser(updatedUser));
                if (updatedFields.role) {
                    dispatch(
                        setUser({...updatedUser, role: updatedFields.role}),
                    );
                }
                console.log('User updated successfully:', updatedUser);
                return updatedUser;
            } else {
                console.error('Failed to fetch the updated user');
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        }
        return null;
    };

    // Delete user by ID
    const deleteUser = async (uid: string): Promise<void> => {
        if (!uid) {
            console.error('UID is required to delete user');
            return;
        }

        try {
            await deleteUserById(uid);
            dispatch(clearUser());
            console.log('User deleted successfully');
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    // Function to toggle user role between 'student' and 'instructor'
    const toggleUserRole = async (): Promise<void> => {
        if (!currentUser) {
            console.error('No current user.');
            return;
        }

        const newRole =
            currentUser.role === 'student' ? 'instructor' : 'student';

        try {
            if (userRole === 'student') {
                if (currentUser.instructor?.hasRegister === true) {
                    const updatedUser = await updateUserById(currentUser.uid, {
                        role: newRole,
                    });

                    if (updatedUser) {
                        dispatch(modifyUser(updatedUser));
                        console.log(
                            'User successfully switched back to student role.',
                        );
                    }
                    console.log(
                        'User is already registered as an instructor. Redirecting to dashboard...',
                    );
                    navigate('/instructor/dashboard'); // Redirect to dashboard
                    return;
                } else {
                    console.log(
                        'User is not registered as an instructor. Redirecting to registration...',
                    );
                    navigate('/instructor/auth');
                    return;
                    // // Update `hasRegister` to true after successful registration
                    // const updatedUser = await updateUserById(currentUser.uid, {
                    //     role: 'instructor',
                    //     'instructor.hasRegister': true
                    // } as Partial<User>);

                    // if (updatedUser) {
                    //     dispatch(modifyUser(updatedUser));
                    //     navigate('/instructor/dashboard'); // Redirect to dashboard after successful registration
                    //     console.log('User successfully registered as instructor.');
                    // }
                    // return;
                }
            } else {
                // Handle switching back to student role
                //const newRole = 'student';
                const updatedUser = await updateUserById(currentUser.uid, {
                    role: newRole,
                });

                if (updatedUser) {
                    dispatch(modifyUser(updatedUser));
                    console.log(
                        'User successfully switched back to student role.',
                    );
                }
            }
        } catch (error) {
            console.error('Failed to toggle user role:', error);
        }
    };

    // const toggleUserRole = async (): Promise<User | null> => {
    //     if (!currentUser) {
    //         return null;
    //     }
    //     const newRole = currentUser.role === 'student' ? 'instructor' : 'student';

    //     try {
    //         if (currentUser.role !== newRole) {
    //             const updatedUser = await updateUserById(currentUser.uid, {
    //                 role: newRole,
    //             });
    //             if (updatedUser) {
    //                 dispatch(modifyUser(updatedUser));
    //                 dispatch(clearSingleCourse());
    //                 dispatch(clearCourses());
    //                 dispatch(clearSearchCourseResults());
    //                 return updatedUser;
    //             }
    //             console.log('Current user role:', newRole);
    //         } else {
    //             console.log(`User is already a ${newRole}`);
    //         }
    //     } catch (error) {
    //         console.error(`Failed to change role to ${newRole}: `, error);
    //     }
    //     return null;
    // };

    return {
        currentUser,
        userRole,
        createUser,
        toggleUserRole,
        fetchUserById,
        updateUser,
        deleteUser,
    };
};
