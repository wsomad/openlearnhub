import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { clearSingleCourse } from '../../../store/slices/courseSlice';
import { clearSections } from '../../../store/slices/sectionSlice';
import { Course } from '../../../types/course';
import { Section } from '../../../types/section';
import CourseContentList from './CourseContentList';

interface CourseFormProps {
    courseId?: string;
}

const CourseForm: React.FC<CourseFormProps> = ({courseId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser, userRole} = useUser();
    const {selectedCourse, createCourse, fetchCourseById, updateCourse} =
        useCourses();
    const {
        selectedSection,
        allSections,
        fetchAllSections,
        updateSection,
        resetSectionsState,
    } = useSections();
    const {fetchAllLessons, resetLessonsState} = useLessons();
    const [sectionsOrder, setSectionsOrder] = useState<Section[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Declare initial state to create a new course.
    const [courseData, setCourseData] = useState<Course>({
        course_id: '',
        course_title: '',
        instructor_id: currentUser?.uid || '',
        course_description: '',
        course_pricing: 0,
        course_requirements: [],
        course_type: 'Web Development',
        course_thumbnail_url: '',
        course_enrollment_number: 0,
        course_number_of_section: 0,
        course_created_at: new Date(),
        course_updated_at: new Date(),
        course_instructor: currentUser?.username || '',
        sections: [],
        ready_for_publish: false,
    });

    // Run side effect to fetch course with `courseId`.
    useEffect(() => {
        if (!currentUser || !userRole) return;

        const loadCourse = async () => {
            try {
                if (courseId) {
                    await fetchCourseById(courseId, currentUser.uid, userRole);
                }
            } catch (error) {
                setError('Failed to fetch selected course.');
            }
        };

        loadCourse();
    }, [courseId]);

    // Run side effect to fetch all sections based on `courseId`.
    useEffect(() => {
        if (!currentUser || !userRole || !courseId) return;

        const loadSection = async () => {
            try {
                if (courseId) {
                    await fetchAllSections(courseId);
                }
            } catch (error) {
                console.error('Failed to fetch a list of sections:', error);
            }
        };

        loadSection();

        // Clear sections only when component unmounts or courseId changes
        return () => {
            if (courseId !== undefined) {
                dispatch(clearSections());
                resetSectionsState();
                resetLessonsState();
            }
        };
    }, [courseId, currentUser, userRole]);

    // Separate cleanup for course when component unmounts completely
    useEffect(() => {
        return () => {
            dispatch(clearSingleCourse());
        };
    }, []);

    // Run side effect to fetch all lessons based on `courseId` and `section_id`.
    useEffect(() => {
        if (
            !currentUser ||
            !userRole ||
            !courseId ||
            !selectedSection?.section_id
        )
            return;

        const loadLesson = async () => {
            try {
                if (courseId && selectedSection.section_id) {
                    await fetchAllLessons(courseId, selectedSection.section_id);
                }
            } catch (error) {
                console.error('Failed to fetch a list of lessons:', error);
            }
        };

        loadLesson();
    }, [courseId, selectedSection?.section_id]);

    // Run side effect to set local state management with existing `selectedCourse`.
    useEffect(() => {
        if (selectedCourse) {
            setCourseData(selectedCourse);
        }
    }, [selectedCourse]);

    // Run side effect to clear state management.
    useEffect(() => {
        return () => {
            dispatch(clearSingleCourse());
            dispatch(clearSections());
            resetSectionsState();
            resetLessonsState();
        };
    }, [dispatch]);

    // Run this side effect to sort section order.
    useEffect(() => {
        if (allSections && allSections.length > 0) {
            const sortedSections = [...allSections].sort(
                (a, b) => (a.section_order || 0) - (b.section_order || 0),
            );
            setSectionsOrder(sortedSections);
        }
    }, [allSections]);

    // Add function for course requirement.
    const addRequirement = () => {
        setCourseData((course) => ({
            ...course,
            course_requirements: [...(course.course_requirements || []), ''],
        }));
    };

    // Remove function for course requirement.
    const removeRequirement = (index: number) => {
        setCourseData((course) => ({
            ...course,
            course_requirements: course.course_requirements.filter(
                (_, i) => i !== index,
            ),
        }));
    };

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const {name, value} = e.target;
        setCourseData((course) => ({
            ...course,
            [name]: value,
        }));
    };

    // Handle list of course requirements expansion.
    const handleRequirementChange = (index: number, value: string) => {
        const updatedRequirements = [...(courseData.course_requirements || [])];
        updatedRequirements[index] = value;
        setCourseData((course) => ({
            ...course,
            course_requirements: updatedRequirements,
        }));
    };

    // Handle form submission.
    const handleSubmit = async (
        e: React.FormEvent,
        ready_for_publish: boolean,
    ) => {
        e.preventDefault();
        setError(null);

        try {
            if (selectedCourse) {
                await updateCourse(selectedCourse.course_id, {
                    ...courseData,
                    course_updated_at: new Date(),
                    ready_for_publish: ready_for_publish,
                });
            } else {
                await createCourse({
                    ...courseData,
                    course_id: courseData.course_title,
                    ready_for_publish: ready_for_publish,
                });
            }
            navigate('/instructor/dashboard');
        } catch (error) {
            setError('Failed to save course.');
        }
    };

    // Handle save order of section.
    const handleSaveOrder = async () => {
        try {
            // Prepare the updated data for all sections
            const updatedData = sectionsOrder.map((section, index) => ({
                section_id: section.section_id,
                section_order: index + 1,
            }));

            // Save the updated order for all sections
            await Promise.all(
                updatedData.map((section) =>
                    updateSection(courseId || '', section.section_id, section),
                ),
            );

            console.log('Sections order saved to Firestore:', updatedData);
        } catch (error) {
            console.error('Error saving section order:', error);
        }
    };

    // Handle save draft of course.
    const handleSaveDraft = (e: React.FormEvent) => {
        handleSaveOrder();
        handleSubmit(e, false);
    };

    // Handle create new course.
    const handleCreateCourse = (e: React.FormEvent) => {
        handleSaveOrder();
        handleSubmit(e, true);
    };

    // Handle cancellation of course.
    const handleCancel = () => {
        navigate('/instructor/dashboard');
    };

    return (
        <div>
            <form className='space-y-6 font-abhaya'>
                {error && (
                    <div className='bg-red-50 text-red-500 p-4'>{error}</div>
                )}

                <div className='space-y-4'>
                    <h2 className='text-2xl font-bold font-abhaya'>
                        Course Details
                    </h2>

                    <div>
                        <label
                            htmlFor='course_title'
                            className='block text-lg font-medium text-gray-700 mb-1'
                        >
                            Course Title *
                        </label>
                        <input
                            id='course_title'
                            name='course_title'
                            type='text'
                            value={courseData.course_title}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary'
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='course_description'
                            className='block text-lg font-medium text-gray-700 mb-1'
                        >
                            Course Description *
                        </label>
                        <textarea
                            id='course_description'
                            name='course_description'
                            value={courseData.course_description}
                            onChange={handleInputChange}
                            rows={4}
                            className='w-full px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary'
                            required
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label
                                htmlFor='course_pricing'
                                className='block text-lg font-medium text-gray-700 mb-1'
                            >
                                Course Price *
                            </label>
                            <input
                                id='course_pricing'
                                name='course_pricing'
                                type='number'
                                min='0'
                                step='0.01'
                                value={courseData.course_pricing}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary'
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='course_type'
                                className='block text-lg font-medium text-gray-700 mb-1'
                            >
                                Course Type *
                            </label>
                            <select
                                id='course_type'
                                name='course_type'
                                value={courseData.course_type}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary appearance-none'
                                required
                            >
                                <option value='Web Development'>
                                    Web Development
                                </option>
                                <option value='App Development'>
                                    App Development
                                </option>
                                <option value='UI/UX'>UI/UX</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <h2 className='text-lg font-medium font-abhaya'>
                        Course Requirements
                    </h2>

                    {courseData.course_requirements?.map(
                        (requirement, index) => (
                            <div key={index} className='flex gap-2'>
                                <input
                                    type='text'
                                    value={requirement}
                                    onChange={(e) =>
                                        handleRequirementChange(
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    className='flex-1 px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary'
                                    placeholder='Enter requirement'
                                />
                                <button
                                    type='button'
                                    onClick={() => removeRequirement(index)}
                                    className='px-4 py-2 text-red-500 bg-primary text-white'
                                >
                                    Remove
                                </button>
                            </div>
                        ),
                    )}

                    <button
                        type='button'
                        onClick={addRequirement}
                        className='bg-primary text-white px-4 py-2 flex items-center space-x-2 hover:bg-secondary-dark transition-colors'
                    >
                        <FaPlus className='w-3 h-3' />
                        <span>Add Requirement</span>
                    </button>
                </div>

                <div>
                    <div>
                        {courseData.course_thumbnail_url && (
                            <div className='mb-4'>
                                <p className='text-gray-600 mb-2'>
                                    Thumbnail Preview:
                                </p>
                                <img
                                    src={courseData.course_thumbnail_url}
                                    alt='Thumbnail Preview'
                                    className='w-full max-h-64 object-cover border border-gray'
                                />
                            </div>
                        )}

                        <label
                            htmlFor='course_thumbnail_url'
                            className='block text-lg font-medium text-gray-700 mb-1'
                        >
                            Thumbnail URL *
                        </label>
                        <input
                            id='course_thumbnail_url'
                            name='course_thumbnail_url'
                            type='url'
                            value={courseData.course_thumbnail_url}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary'
                            required
                        />
                    </div>
                </div>

                <CourseContentList
                    course_id={courseId || ''}
                    sectionsOrder={sectionsOrder}
                    setSectionsOrder={setSectionsOrder}
                    onSaveOrder={handleSaveOrder}
                ></CourseContentList>

                <div className='flex justify-end space-x-4'>
                    <button
                        type='button'
                        onClick={handleCancel}
                        className='px-6 py-2 border border-gray hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSaveDraft}
                        className='px-6 py-2 bg-secondary text-white hover:bg-gray-50'
                    >
                        Save Draft
                    </button>
                    <button
                        type='button'
                        onClick={handleCreateCourse}
                        className='px-6 py-2 bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400'
                    >
                        {selectedCourse ? 'Update Course' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
