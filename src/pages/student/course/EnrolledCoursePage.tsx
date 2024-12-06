// import React, { useEffect, useState } from 'react';
// import { HiOutlineDocumentText } from 'react-icons/hi';
// import { MdQuiz } from 'react-icons/md';
// import { RiTimer2Line } from 'react-icons/ri';
// import { Link, useParams } from 'react-router-dom';

// import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
// import CourseRequirements from '../../../components/enrollment/CourseRequirements';
// import DocumentPreview from '../../../components/enrollment/testingLesson/DocumentPreview';
// import QuizPreview from '../../../components/enrollment/testingLesson/QuizPanel';
// import VideoPreview from '../../../components/enrollment/testingLesson/VideoPreview';
// import HeaderComponent from '../../../components/HeaderComponent';
// import { useCourses } from '../../../hooks/useCourses';
// import { useSections } from '../../../hooks/useSections';
// import { useUser } from '../../../hooks/useUser';
// import {
// 	DocumentLesson,
// 	Lesson,
// 	LessonBase,
// 	QuizLesson,
// 	VideoLesson,
// } from '../../../types/lesson';

// const EnrolledCoursePage: React.FC = () => {
//     const {selectedCourse, fetchCourseById} = useCourses();
//     const {allSections, fetchAllSections} = useSections();
//     const {currentUser, userRole} = useUser();
//     const {id} = useParams<{id: string}>();
//     const [loading, setLoading] = useState(true);

//     const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//     const [selectedLessonType, setSelectedLessonType] = useState<
//         'video' | 'document' | 'quiz' | null
//     >(null);

//     useEffect(() => {
//         const loadCourse = async () => {
//             if (id && currentUser?.uid) {
//                 await fetchCourseById(id, currentUser.uid, userRole);
//                 console.log('Currently in selected course page.');
//                 setLoading(false);
//             }
//         };
//         loadCourse();
//     }, [currentUser, userRole]);

//     useEffect(() => {
//         const loadSections = async () => {
//             if (id) {
//                 await fetchAllSections(id);
//                 console.log(
//                     `Successfully fetch all sections under ${id} course.`,
//                 );
//             }
//         };
//         loadSections();
//     }, [id, currentUser, userRole]);

//     // A handler for lesson selection
//     const handleLessonSelect = (lesson: LessonBase) => {
//         setSelectedLesson(lesson);
//         // Type guard to determine lesson type
//         switch (lesson.lesson_type) {
//             case 'video':
//                 setSelectedLessonType('video');
//                 break;
//             case 'document':
//                 setSelectedLessonType('document');
//                 break;
//             case 'quiz':
//                 setSelectedLessonType('quiz');
//                 break;
//             default:
//                 setSelectedLessonType(null);
//         }
//     };

//     return (
//         <div>
//             <HeaderComponent />
//             <div>
//                 {/* <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-10'> */}
//                 <div className='w-screen-xl h-full w-full justify-between'>
//                     <div className='flex justify-between items-start gap-6'>
//                         {/* Left side: Course Info and Content List */}
//                         <div className='w-1/3'>
//                             <CourseContentList
//                                 course_id={id || ''}
//                                 sectionsOrder={allSections}
//                                 setSectionsOrder={(sections) => {
//                                     // Handle section order updates if needed
//                                 }}
//                                 onSaveOrder={() => {
//                                     // Handle save order if needed
//                                 }}
//                                 onLessonSelect={handleLessonSelect}
//                                 selectedLessonId={selectedLesson?.lesson_id}
//                             />
//                         </div>

//                         {/* Right side: Lesson Preview Panel */}
//                         <div className='w-2/3'>
//                             {selectedLesson ? (
//                                 <div className='bg-white rounded-lg shadow-sm p-6'>
//                                     <h2 className='text-2xl font-bold mb-4'>
//                                         {selectedLesson.lesson_title}
//                                     </h2>

//                                     {selectedLessonType === 'video' && (
//                                         <VideoPreview
//                                             url={
//                                                 (selectedLesson as VideoLesson)
//                                                     .video_url
//                                             }
//                                             onDurationChange={() => {}}
//                                         />
//                                     )}

//                                     {selectedLessonType === 'document' && (
//                                         <DocumentPreview
//                                             url={
//                                                 (
//                                                     selectedLesson as DocumentLesson
//                                                 ).document_url
//                                             }
//                                         />
//                                     )}

//                                     {selectedLessonType === 'quiz' && (
//                                         <QuizPreview
//                                             quizData={
//                                                 (selectedLesson as QuizLesson)
//                                                     .quiz
//                                             }
//                                             lessonId={selectedLesson.lesson_id}
//                                         />
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className='bg-white rounded-lg shadow-sm p-6 text-center text-gray-500'>
//                                     Select a lesson to start learning
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//                 <div className='flex flex-col justify-start items-start mt-10 px-6'>
//                     <h1 className='font-abhaya font-bold text-4xl'>
//                         {selectedCourse?.course_title || 'Course Title'}
//                     </h1>
//                     <p className='font-abhaya font-normal text-lg mt-2'>
//                         {selectedCourse?.course_description ||
//                             'Course Description'}
//                     </p>
//                 </div>
//                 <hr className='border-t gray opacity-15 my-6 mx-6' />
//                 <div className='my-6 '>
//                     <CourseRequirements
//                         course_id={selectedCourse?.course_id || ''}
//                         course_requirements={
//                             selectedCourse?.course_requirements || []
//                         }
//                     ></CourseRequirements>
//                 </div>
//                 <hr className='border-t gray opacity-15 my-6 mx-6' />
//                 <div className='flex flex-col justify-start items-start my-6 px-6'>
//                     <div className='font-abhaya font-bold text-2xl mr-4'>
//                         Instructor Name
//                     </div>
//                     <div className='font-abhaya font-normal text-lg underline underline-offset-2 text-secondary mt-2'>
//                         <Link to={''}>{selectedCourse?.course_instructor}</Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EnrolledCoursePage;

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';
import DocumentPreview from '../../../components/enrollment/testingLesson/DocumentPreview';
import QuizPreview from '../../../components/enrollment/testingLesson/QuizPanel';
import VideoPreview from '../../../components/enrollment/testingLesson/VideoPreview';
import HeaderComponent from '../../../components/HeaderComponent';
import { useCourses } from '../../../hooks/useCourses';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import {
	DocumentLesson,
	Lesson,
	LessonBase,
	QuizLesson,
	VideoLesson,
} from '../../../types/lesson';

const EnrolledCoursePage = () => {
    const {selectedCourse, fetchCourseById} = useCourses();
    const {allSections, fetchAllSections, clearAllSections} = useSections();
    const {currentUser, userRole} = useUser();
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const [selectedLessonType, setSelectedLessonType] = useState<
        'video' | 'document' | 'quiz' | null
    >(null);

    useEffect(() => {
        const loadCourse = async () => {
            if (id && currentUser?.uid) {
                await fetchCourseById(id, currentUser.uid, userRole);
                setLoading(false);
            }
        };
        loadCourse();
    }, [currentUser, userRole]);

    useEffect(() => {
        const loadSections = async () => {
            if (id) {
                await fetchAllSections(id);
            }
        };
        loadSections();

        // Cleanup function to reset sections when unmounting or changing courses
        return () => {
            clearAllSections();
            setSelectedLesson(null);
            setSelectedLessonType(null);
        };
    }, [id]);

    const handleLessonSelect = (lesson: LessonBase) => {
        setSelectedLesson(lesson);
        switch (lesson.lesson_type) {
            case 'video':
                setSelectedLessonType('video');
                break;
            case 'document':
                setSelectedLessonType('document');
                break;
            case 'quiz':
                setSelectedLessonType('quiz');
                break;
            default:
                setSelectedLessonType(null);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
            </div>
        );
    }

    return (
        <div className='font-abhaya min-h-screen bg-gray-50'>
            <HeaderComponent />

            {/* Main Content */}
            <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Course Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 h-full'>
                    <div className='lg:col-span-2 order-2 lg:order-1 h-full'>
                        <div className='bg-white shadow-sm overflow-hidden h-full'>
                            {selectedLesson ? (
                                <div>
                                    <div className='p-6 border-b border-gray-100'>
                                        <h2 className='text-2xl font-semibold text-gray-900'>
                                            Lesson {selectedLesson.lesson_order}
                                            : {selectedLesson.lesson_title}
                                        </h2>
                                    </div>
                                    <div className='p-6'>
                                        {selectedLessonType === 'video' && (
                                            <div className='aspect-w-16 aspect-h-9'>
                                                <VideoPreview
                                                    url={
                                                        (
                                                            selectedLesson as VideoLesson
                                                        ).video_url
                                                    }
                                                    onDurationChange={() => {}}
                                                    height='h-[600px]'
                                                />
                                            </div>
                                        )}

                                        {selectedLessonType === 'document' && (
                                            <DocumentPreview
                                                url={
                                                    (
                                                        selectedLesson as DocumentLesson
                                                    ).document_url
                                                }
                                                height='h-[600px]'
                                            />
                                        )}

                                        {selectedLessonType === 'quiz' && (
                                            <div>
                                                {(selectedLesson as QuizLesson)
                                                    .quiz ? (
                                                    <QuizPreview
                                                        quizData={
                                                            (
                                                                selectedLesson as QuizLesson
                                                            ).quiz
                                                        }
                                                        lessonId={
                                                            selectedLesson.lesson_id
                                                        }
                                                    />
                                                ) : (
                                                    <div className='p-4 text-red-500'>
                                                        Error loading quiz data.
                                                        Please try again.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className='h-full flex items-center justify-center'>
                                    <div className='text-center'>
                                        <div className='text-gray-400 mb-4'>
                                            <svg
                                                className='mx-auto h-12 w-12'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122'
                                                />
                                            </svg>
                                        </div>
                                        <h3 className='text-xl font-medium text-gray-900 mb-2'>
                                            Ready to start learning?
                                        </h3>
                                        <p className='text-gray-500'>
                                            Select a lesson from the course
                                            content to begin
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='lg:col-span-1 order-1 lg:order-2'>
                        <CourseContentList
                            course_id={id || ''}
                            sectionsOrder={allSections}
                            setSectionsOrder={(sections) => {}}
                            onSaveOrder={() => {}}
                            onLessonSelect={handleLessonSelect}
                            selectedLessonId={selectedLesson?.lesson_id}
                        />
                    </div>
                </div>

                <div className='space-y-8 mt-8'>
                    {/* Course Header */}
                    <div className='bg-white rounded-xl shadow-sm p-6'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                            {selectedCourse?.course_title || 'Course Title'}
                        </h1>
                        <p className='text-lg text-gray-600'>
                            {selectedCourse?.course_description ||
                                'Course Description'}
                        </p>
                    </div>

                    {/* Course Requirements */}
                    <div className='bg-white rounded-xl shadow-sm p-6'>
                        <CourseRequirements
                            course_id={selectedCourse?.course_id || ''}
                            course_requirements={
                                selectedCourse?.course_requirements || []
                            }
                        />
                    </div>

                    {/* Instructor Info */}
                    <div className='bg-white rounded-xl shadow-sm p-6'>
                        <h2 className='font-abhaya text-2xl font-semibold mb-4'>
                            Instructor
                        </h2>
                        <Link
                            to={''}
                            className='font-abhaya inline-flex items-center text-lg text-blue-600 hover:text-blue-800 transition-colors'
                        >
                            {selectedCourse?.course_instructor}
                            <svg
                                className='w-5 h-5 ml-2'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M9 5l7 7-7 7'
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursePage;
