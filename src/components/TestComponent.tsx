import React from 'react';
import CardCourseComponent from './card/CardCourseComponent';
import thumbnail from '../assets/images/thumbnail.png';
import {useUser} from '../hooks/useUser';

const TestComponent = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [username, setUsername] = useState('');
    const {userRole} = useUser();
    console.log('what is user role? ', userRole);

    // // Dummy function to simulate user creation
    // const createUser = async (userData) => {
    //     try {
    //         // Simulating user data being saved in Firebase Firestore (common data)
    //         console.log('Creating user with data:', userData);

    //         // Simulating role-based subcollection creation
    //         if (userRole === 'student') {
    //             console.log('Creating student subcollection');
    //             addUserAsStudent(userData); // Uncomment if you have addUserAsStudent function
    //         } else if (userRole === 'instructor') {
    //             console.log('Creating instructor subcollection');
    //             addUserAsInstructor(userData); // Uncomment if you have addUserAsInstructor function
    //         }
    //         alert(`User created as ${userRole}`);
    //     } catch (error) {
    //         console.error('Error creating user: ', error);
    //     }
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const userData = {
    //         email,
    //         password,
    //         firstName,
    //         lastName,
    //         username,
    //     };

    //     createUser(userData);
    // };

    // return (
    //     <div>
    //         <h2>Create User (Student/Instructor)</h2>
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Email</label>
    //                 <input
    //                     type='email'
    //                     value={email}
    //                     onChange={(e) => setEmail(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Password</label>
    //                 <input
    //                     type='password'
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>First Name</label>
    //                 <input
    //                     type='text'
    //                     value={firstName}
    //                     onChange={(e) => setFirstName(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Last Name</label>
    //                 <input
    //                     type='text'
    //                     value={lastName}
    //                     onChange={(e) => setLastName(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Username</label>
    //                 <input
    //                     type='text'
    //                     value={username}
    //                     onChange={(e) => setUsername(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             {/* <div>
    //                 <label>Role</label>
    //                 <select
    //                     value={role}
    //                     onChange={(e) => setRole(e.target.value)}
    //                 >
    //                     <option value='student'>Student</option>
    //                     <option value='instructor'>Instructor</option>
    //                 </select>
    //             </div> */}
    //             <div>
    //                 <button type='submit'>Create User</button>
    //             </div>
    //         </form>
    //     </div>
    // );
};

export default TestComponent;

// <div className='flex justify-center items-center min-h-screen bg-gray-100'>
//     <div className='flex gap-6'>
//         <CardCourseComponent
//             thumbnail={thumbnail}
//             title='Build Web App with React Redux'
//             instructor='Dr. John Doe, Dev Kaki Community'
//             pricing='FREE'
//             buttonText='View Course'
//             onButtonClick={() =>
//                 // Later, create a navigation route
//                 console.log('Navigating to Course Details page')
//             }
//             size='medium'
//         />
//         <CardCourseComponent
//             thumbnail={thumbnail}
//             title='Build Web App with React Redux'
//             instructor='Dr. John Doe'
//             pricing='FREE'
//             buttonText='Incomplete'
//             onButtonClick={() =>
//                 // Later, create a navigation route
//                 console.log('Navigating to Course Selected page')
//             }
//             size='big'
//             hoursDuration='40'
//             numSections='23'
//             numLectures='120'
//         />
//     </div>
// </div>
