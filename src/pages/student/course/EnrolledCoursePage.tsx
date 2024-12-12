import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';
import DocumentPreview from '../../../components/enrollment/testingLesson/DocumentPreview';
import QuizPanel from '../../../components/enrollment/testingLesson/QuizPanel';
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
    const {allSections, fetchAllSections} = useSections();
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
    }, [currentUser, userRole]);

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
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            </div>
        );
    }

    return (
        <div className='font-abhaya min-h-screen bg-gray-50'>
            <HeaderComponent />

            {/* Main Content */}
            <div className='max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8'>
                {/* Course Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
                    {/* Main Content Area */}
                    <div className='lg:col-span-2 order-2 lg:order-1'>
                        <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
                            {selectedLesson ? (
                                <div>
                                    <div className='p-4 md:p-6 border-b border-gray'>
                                        <h2 className='text-xl md:text-2xl font-semibold text-gray-900'>
                                            Lesson {selectedLesson.lesson_order}
                                            : {selectedLesson.lesson_title}
                                        </h2>
                                    </div>
                                    <div className='p-4 md:p-6'>
                                        {selectedLessonType === 'video' && (
                                            <div className='aspect-w-16 aspect-h-9'>
                                                <VideoPreview
                                                    url={
                                                        (
                                                            selectedLesson as VideoLesson
                                                        ).video_url
                                                    }
                                                    onDurationChange={() => {}}
                                                    height='h-[300px] sm:h-[400px] md:h-[500px] lg:h-[533px]'
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
                                                height='h-[300px] sm:h-[400px] md:h-[500px] lg:h-[533px]'
                                            />
                                        )}

                                        {selectedLessonType === 'quiz' && (
                                            <QuizPanel
                                                quizData={
                                                    (
                                                        selectedLesson as QuizLesson
                                                    ).quiz
                                                }
                                                lessonId={
                                                    selectedLesson.lesson_id
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className='h-[300px] sm:h-[400px] md:h-[500px] lg:h-[660px] flex items-center justify-center p-4'>
                                    <div className='text-center max-w-md mx-auto'>
                                        <div className='text-gray mb-4'>
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
                                        <h3 className='text-lg md:text-xl font-medium text-gray-900 mb-2'>
                                            Ready to start learning?
                                        </h3>
                                        <p className='text-gray'>
                                            Select a lesson from the course
                                            content to begin
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Content Sidebar */}
                    <div className='lg:col-span-1 order-1 lg:order-2'>
                        <div className='sticky top-4'>
                            <CourseContentList
                                course_id={id || ''}
                                sectionsOrder={[...allSections].sort(
                                    (a, b) => a.section_order - b.section_order,
                                )}
                                setSectionsOrder={(sections) => {}}
                                onSaveOrder={() => {}}
                                onLessonSelect={handleLessonSelect}
                                selectedLessonId={selectedLesson?.lesson_id}
                                onSectionChange={() => {}}
                                onSectionDelete={() => {}}
                                onLessonChange={() => {}}
                                onLessonDelete={() => {}}
                            />
                        </div>
                    </div>
                </div>

                {/* Course Information Section*/}
                <div className='space-y-4 md:space-y-6 lg:space-y-8 mt-4 md:mt-6 lg:mt-8'>
                    {/* Course Header */}
                    <div className='bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8'>
                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4'>
                            {selectedCourse?.course_title || 'Course Title'}
                        </h1>
                        <p className='text-base md:text-lg'>
                            {selectedCourse?.course_description ||
                                'Course Description'}
                        </p>
                    </div>

                    {/* Course Requirements */}
                    <div className='bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8'>
                        <CourseRequirements
                            course_id={selectedCourse?.course_id || ''}
                            course_requirements={
                                selectedCourse?.course_requirements || []
                            }
                        />
                    </div>

                    {/* Instructor Info */}
                    <div className='bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8'>
                        <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                            Instructor
                        </h2>
                        <Link
                            to={`/instructor/${selectedCourse?.instructor_id}/profile`}
                            className='font-abhaya inline-flex items-center text-lg text-blue-600 hover:text-blue-800 transition-colors'
                        >
                            {selectedCourse?.course_instructor}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursePage;
