import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { User } from '../../types/user';
import { Instructor } from '../../types/instructor';
import { Student, StudentType } from '../../types/student';
import { useUser } from '../../hooks/useUser';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface ProfileComponentProps {
  onClose: () => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
  onClose,
}) => {
  const { currentUser, userRole, updateUser } = useUser();

  const [userFields, setUserFields] = useState<User>({
    uid: '',
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: userRole,
    profile_image: '',
    created_at: new Date(),
    updated_at: new Date(),
    student: undefined,
    instructor: undefined
  });

  const [studentFields, setStudentFields] = useState<Student>({
    ...userFields,
    student_type: 'Undergraduate',
    enrollment_date: new Date(),
    completed_courses: 0,
    courses_enrolled: 0,
    completion_status: false,
    enrolled_courses: [],
  })

  // Initialize instructor-specific fields
  const [instructorFields, setInstructorFields] = useState<Instructor>({
    ...userFields,
    profile_summary: '',
    specialization_area: [],
    years_of_experience: 0,
    total_courses_created: 0,
    created_courses: [],
    rating: 1,
    social_links: {
      github: '',
      linkedin: '',
    },
  });

  const studentTypes: StudentType[] = [
    'Secondary',
    'High School',
    'Undergraduate',
    'Postgraduate',
    'Doctorate',
    'Professional Certification',
  ];

  useEffect(() => {
  if (currentUser) {
    setUserFields({ ...currentUser });
    if (userRole === 'student' && currentUser.student) {
      setStudentFields(currentUser.student || {});
    } else if (userRole === 'instructor' && currentUser.instructor) {
      setInstructorFields(currentUser.instructor || {});
    }
  }
}, [currentUser, userRole]);

  // Form validation logic
  const validateForm = (): boolean => {
    if (!userFields.username || !userFields.firstname || !userFields.lastname) {
      alert('Please fill in all required fields.');
      return false;
    }
    if (userFields.password) {
      if (userFields.password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedStudent: Student = {
      ...studentFields,
      student_type: studentFields.student_type,
    }

    const updatedInstructor: Instructor = {
      ...instructorFields,
      profile_summary: instructorFields.profile_summary,
      years_of_experience: instructorFields.years_of_experience,
      social_links: {
        github: instructorFields.social_links?.github,
        linkedin: instructorFields.social_links?.linkedin
      }
    }

    const updatedUser: User = {
      ...userFields,
      username: userFields.username,
      firstname: userFields.firstname,
      lastname: userFields.lastname,
      updated_at: new Date(),
    };

    let updatedProfile: any = { ...updatedUser };

    if (userRole === 'student' && updatedStudent) {
      updatedProfile.student = { ...updatedStudent }; // Add student-specific updates
    } else if (userRole === 'instructor' && updatedInstructor) {
      updatedProfile.instructor = { ...updatedInstructor }; // Add instructor-specific updates
    }

    try {
      if (currentUser?.uid) {
        await updateUser(currentUser.uid, updatedProfile);
        alert('Profile updated successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('There was an error updating your profile. Please try again.');
    }

    // // Create updated profile object
    // const updatedProfile: User = {
    //   ...userFields,
    //   username: userFields.username,
    //   firstname: userFields.firstname,
    //   lastname: userFields.lastname,
    //   profile_image: userFields.profile_image || '',
    // };

    // If instructor, update instructor profile
    // if (currentUser?.role === 'instructor') {
    //   currentUser.instructor = {
    //     ...userFields,
    //     profile_summary: instructorFields.profile_summary,
    //     specialization_area: instructorFields.specialization_area,
    //     years_of_experience: instructorFields.years_of_experience,
    //     social_links: instructorFields.social_links,
    //   };
    // }

  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-6 right-4 text-3xl text-gray-500 hover:text-gray-800 transition-colors'
          aria-label='Close modal'
        >
          <IoCloseOutline />
        </button>

        <h1 className='text-3xl font-bold mb-6'>
          Update {userRole === 'student' ? '' : 'Instructor'} Profile
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {userRole === 'student' ? (
            <div className='space-y-4'>
              <div>
                <label className='block text-lg font-medium text-gray-700'>
                  Email *
                </label>
                <input
                  type='text'
                  value={userFields.email}
                  className='w-full border border-gray p-3 bg-gray mt-2'
                  required
                  disabled
                />
              </div>
              <div>
                <label className='block text-lg font-medium text-gray-700'>
                  Username *
                </label>
                <input
                  type='text'
                  value={userFields.username}
                  onChange={(e) =>
                    setUserFields({ ...userFields, username: e.target.value })
                  }
                  className='w-full border border-gray p-3 bg-transparent mt-2'
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-lg font-medium text-gray-700'>
                    First Name *
                  </label>
                  <input
                    type='text'
                    value={userFields.firstname}
                    onChange={(e) =>
                      setUserFields({ ...userFields, firstname: e.target.value })
                    }
                    className='w-full border border-gray p-3 bg-transparent mt-2'
                    required
                  />
                </div>
                <div>
                  <label className='block text-lg font-medium text-gray-700'>
                    Last Name *
                  </label>
                  <input
                    type='text'
                    value={userFields.lastname}
                    onChange={(e) =>
                      setUserFields({ ...userFields, lastname: e.target.value })
                    }
                    className='w-full border border-gray p-3 bg-transparent mt-2'
                    required
                  />
                </div>
              </div>
              <div>
                <label className='block text-lg font-medium text-gray-700'>
                  Education Level *
                </label>
                <select
                  value={studentFields.student_type}
                  onChange={(e) =>
                    setStudentFields({
                      ...studentFields,
                        student_type: e.target.value as StudentType
                    })
                  }
                  className='w-full border border-gray p-3 bg-transparent mt-2 appearance-none'
                  required
                >
                  {studentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <label className='block text-lg font-medium text-gray-700'>
                  Profile Summary
                </label>
                <textarea
                  value={instructorFields.profile_summary}
                  onChange={(e) =>
                    setInstructorFields({
                      ...instructorFields,
                      profile_summary: e.target.value
                    })
                  }
                  className='w-full border border-gray p-3 bg-transparent mt-2'
                  rows={4}
                  placeholder='Write a brief summary about yourself and your teaching experience...'
                />
              </div>
              <div>
                <label className='block text-lg font-medium text-gray-700'>
                  Years of Experience
                </label>
                <input
                  type='number'
                  value={instructorFields.years_of_experience}
                  onChange={(e) =>
                    setInstructorFields({ ...instructorFields, years_of_experience: Number(e.target.value) })
                  }
                  className='w-full border border-gray p-3 bg-transparent mt-2'
                  min={0}
                />
              </div>
              <div>
                <label className='block text-lg font-medium text-gray-700'>
                  Social Links
                </label>
                <div className='flex items-center border border-gray p-3 bg-transparent mt-2'>
                  <FaGithub className='text-gray-500 mr-3' />
                  <input
                    type='text'
                    placeholder='GitHub URL'
                    value={instructorFields.social_links?.github}
                    onChange={(e) =>
                      setInstructorFields({
                        ...instructorFields,
                        social_links: { ...instructorFields.social_links, github: e.target.value },
                      })
                    }
                    className='w-full bg-transparent outline-none'
                  />
                </div>

                <div className='flex items-center border border-gray p-3 bg-transparent mt-2'>
                  <FaLinkedin className='text-gray-500 mr-3' />
                  <input
                    type='text'
                    placeholder='LinkedIn URL'
                    value={instructorFields.social_links?.linkedin}
                    onChange={(e) =>
                      setInstructorFields({
                        ...instructorFields,
                        social_links: { ...instructorFields.social_links, linkedin: e.target.value },
                      })
                    }
                    className='w-full bg-transparent outline-none'
                  />
                </div>
              </div>
            </div>
          )}
          <div className='mt-6'>
            <button
              type='submit'
              className='w-full bg-primary text-white py-3 px-4 hover:bg-blue-600'
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileComponent;

// <div>
//                 <label className='block text-lg font-medium text-gray-700'>
//                   Specializations
//                 </label>
//                 <select
//                   value={instructorFields.specialization_area}
//                   onChange={(e) => {
//                     const selected = Array.from(e.target.selectedOptions, (option) => option.value);
//                     setInstructorFields({ ...instructorFields, specialization_area: selected });
//                   }}
//                   className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent mt-2 appearance-none'
//                 >
//                   <option value='Math'>Math</option>
//                   <option value='Science'>Science</option>
//                   {/* Add more specializations if needed */}
//                 </select>
//               </div>


{/* Role-Specific Section */}
