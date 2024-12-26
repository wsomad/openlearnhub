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
import { SpecializationArea } from '../../../types/instructor';
import {
	DocumentLesson,
	LessonBase,
	QuizLesson,
	VideoLesson,
} from '../../../types/lesson';
import { Section } from '../../../types/section';
import CourseContentList from './CourseContentList';

interface CourseFormProps {
    courseId?: string;
    isDraft?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({courseId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser, userRole} = useUser();
    const {
        selectedCourse,
        createCourse,
        fetchCourseById,
        updateCourse,
        deleteSingleCourse,
    } = useCourses();
    const {
        selectedSection,
        allSections,
        fetchAllSections,
        updateSection,
        resetSectionsState,
        createSections,
        deleteSection,
    } = useSections();
    const {
        fetchAllLessons,
        resetLessonsState,
        createLessons,
        updateLesson,
        deleteLesson,
    } = useLessons();
    const [sectionsOrder, setSectionsOrder] = useState<Section[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [isUnmounting, setIsUnmounting] = useState(false);

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

    const specializationOptions: SpecializationArea[] = [
        'Web Development',
        'Machine Learning',
        'Mobile Development',
        'Cybersecurity',
    ];

    const [pendingChanges, setPendingChanges] = useState<{
        sections: Section[];
        deletedSections: string[];
        lessons: LessonBase[];
        deletedLessons: {sectionId: string; lessonId: string}[];
    }>({
        sections: [],
        deletedSections: [],
        lessons: [],
        deletedLessons: [],
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

    useEffect(() => {
        if (!currentUser || !userRole) return;

        const loadSection = async () => {
            try {
                if (courseId) {
                    await fetchAllSections(courseId);
                } else {
                    setSectionsOrder([]);
                    dispatch(clearSections());
                    resetSectionsState();
                    resetLessonsState();
                }
            } catch (error) {
                console.error('Failed to fetch a list of sections:', error);
            }
        };

        if (!isUnmounting) {
            loadSection();
        }

        return () => {
            setIsUnmounting(true);
            dispatch(clearSections());
            resetSectionsState();
            resetLessonsState();
            setSectionsOrder([]);
        };
    }, [courseId, currentUser, userRole]);

    // Separate cleanup for course when component unmounts completely
    // useEffect(() => {
    //     return () => {
    //         dispatch(clearSingleCourse());
    //     };
    // }, []);

    useEffect(() => {
        if (!courseId) {
            deleteSingleCourse();
            dispatch(clearSingleCourse());
            dispatch(clearSections());
            resetSectionsState();
            resetLessonsState();
            setSectionsOrder([]);
        }

        return () => {
            dispatch(clearSingleCourse());
            dispatch(clearSections());
            resetSectionsState();
            resetLessonsState();
        };
    }, [courseId]);

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

    useEffect(() => {
        if (!courseId) {
            setSectionsOrder([]);
            dispatch(clearSections());
            resetSectionsState();
            resetLessonsState();
        }

        return () => {
            setIsUnmounting(true);
            deleteSingleCourse();
            dispatch(clearSingleCourse());
            dispatch(clearSections());
            resetSectionsState();
            resetLessonsState();
            setSectionsOrder([]);
            setPendingChanges({
                sections: [],
                deletedSections: [],
                lessons: [],
                deletedLessons: [],
            });
        };
    }, [courseId]);

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

    const onSectionChange = async (section: Section) => {
        setSectionsOrder((prev) => {
            return prev.map((s) =>
                s.section_id === section.section_id ? {...s, ...section} : s,
            );
        });

        setPendingChanges((prev) => {
            const existingIndex = prev.sections.findIndex(
                (s) => s.section_id === section.section_id,
            );

            const updatedSections =
                existingIndex >= 0
                    ? prev.sections.map((s, index) =>
                          index === existingIndex ? section : s,
                      )
                    : [...prev.sections, section];

            return {
                ...prev,
                sections: updatedSections,
            };
        });
    };

    const onSectionDelete = async (sectionId: string) => {
        // Remove the section and reorder remaining sections
        setSectionsOrder((prev) => {
            const filtered = prev.filter(
                (section) => section.section_id !== sectionId,
            );
            // Reorder remaining sections
            return filtered.map((section, index) => ({
                ...section,
                section_order: index + 1,
            }));
        });

        // Update pending changes and ensure orders are updated there too
        setPendingChanges((prev) => {
            const updatedSections = prev.sections
                .filter((s) => s.section_id !== sectionId)
                .map((s, index) => ({
                    ...s,
                    section_order: index + 1,
                }));

            return {
                ...prev,
                sections: updatedSections,
                deletedSections: [...prev.deletedSections, sectionId],
            };
        });
    };

    const onLessonChange = (sectionId: string, lesson: LessonBase) => {
        setPendingChanges((prev) => {
            // Check if lesson already exists in pending changes
            const existingLessonIndex = prev.lessons.findIndex(
                (l) => l.lesson_id === lesson.lesson_id,
            );

            let updatedLessons;
            if (existingLessonIndex >= 0) {
                // Update existing lesson
                updatedLessons = prev.lessons.map((l) =>
                    l.lesson_id === lesson.lesson_id
                        ? {...lesson, section_id: sectionId}
                        : l,
                );
            } else {
                // Add new lesson
                updatedLessons = [
                    ...prev.lessons,
                    {...lesson, section_id: sectionId},
                ];
            }

            return {
                ...prev,
                lessons: updatedLessons,
            };
        });
    };

    const onLessonDelete = (sectionId: string, lessonId: string) => {
        setPendingChanges((prev) => ({
            ...prev,
            // Add to deletedLessons
            deletedLessons: [...prev.deletedLessons, {sectionId, lessonId}],
            // Also remove from pending lessons
            lessons: prev.lessons.filter(
                (lesson) =>
                    !(
                        lesson.section_id === sectionId &&
                        lesson.lesson_id === lessonId
                    ),
            ),
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

    const handleSaveOrder = async () => {
        try {
            // First sort sections by current order
            const sortedSections = [...sectionsOrder].sort(
                (a, b) => a.section_order - b.section_order,
            );

            // Create updates with sequential orders
            const updatedData = sortedSections.map((section, index) => ({
                section_id: section.section_id,
                section_order: index + 1,
            }));

            // Save the updated orders
            await Promise.all(
                updatedData.map((section) =>
                    updateSection(courseId || '', section.section_id, section),
                ),
            );
        } catch (error) {
            console.error('Error saving section order:', error);
        }
    };

    const [tempLessonCounter, setTempLessonCounter] = useState(0);
    const createLessonData = (
        lesson: any,
        sectionTitle: string,
    ): LessonBase => {
        setTempLessonCounter((prev) => prev + 1);

        const baseLesson = {
            lesson_id: `temp-${Date.now()}-${tempLessonCounter}`, // Generate unique temporary ID
            section_id: sectionTitle,
            lesson_title: lesson.lesson_title,
            lesson_order: lesson.lesson_order || 0,
            lesson_type: lesson.lesson_type,
        };

        switch (lesson.lesson_type) {
            case 'document':
                return {
                    ...baseLesson,
                    lesson_type: 'document',
                    document_url: lesson.document_url || '',
                } as DocumentLesson;
            case 'video':
                return {
                    ...baseLesson,
                    lesson_type: 'video',
                    video_url: lesson.video_url || '',
                    video_duration: lesson.video_duration || 0,
                } as VideoLesson;
            case 'quiz':
                return {
                    ...baseLesson,
                    lesson_type: 'quiz',
                    quiz: lesson.quiz || {
                        quiz_id: '',
                        quiz_title: lesson.lesson_title,
                        quiz_number_of_questions: 0,
                        questions: [],
                    },
                } as QuizLesson;
            default:
                return {
                    ...baseLesson,
                    lesson_type: 'document',
                    document_url: '',
                } as DocumentLesson;
        }
    };

    const handleCourseAction = async (
        e: React.FormEvent,
        readyForPublish: boolean,
    ) => {
        e.preventDefault();
        try {
            if (!courseId) {
                // For new courses (CreateCoursePage) - This part remains unchanged
                const courseToCreate = {
                    ...courseData,
                    course_id: courseData.course_title,
                    ready_for_publish: readyForPublish,
                };
                await createCourse(courseToCreate);

                // Create sections and lessons sequentially
                for (let section of sectionsOrder) {
                    try {
                        const sectionToCreate: Omit<Section, 'section_id'> = {
                            section_title: section.section_title,
                            section_order: section.section_order,
                            course_id: courseData.course_title,
                            lessons: [],
                        };

                        const createdSection = await createSections(
                            courseData.course_title,
                            sectionToCreate,
                        );

                        if (createdSection) {
                            // Filter lessons that belong to this section AND haven't been deleted
                            const sectionLessons =
                                pendingChanges.lessons.filter((lesson) => {
                                    const isDeleted =
                                        pendingChanges.deletedLessons.some(
                                            (deletedLesson) =>
                                                deletedLesson.lessonId ===
                                                    lesson.lesson_id &&
                                                deletedLesson.sectionId ===
                                                    section.section_id,
                                        );
                                    return (
                                        lesson.section_id ===
                                            section.section_id && !isDeleted
                                    );
                                });

                            for (const lesson of sectionLessons) {
                                try {
                                    const lessonToCreate = createLessonData(
                                        lesson,
                                        createdSection.section_id,
                                    );
                                    await createLessons(
                                        courseData.course_title,
                                        createdSection.section_id,
                                        lessonToCreate,
                                    );
                                } catch (error) {
                                    console.error(
                                        'Error creating lesson:',
                                        error,
                                    );
                                }
                            }
                        }
                    } catch (error) {
                        console.error(
                            'Error in section/lesson creation:',
                            error,
                        );
                    }
                }
            } else {
                // For existing courses (EditCoursePage)
                for (const section of pendingChanges.sections) {
                    try {
                        const sectionToUpdate = {
                            section_title: section.section_title,
                            section_order: section.section_order,
                            course_id: courseId,
                        };

                        await updateSection(
                            courseId,
                            section.section_id,
                            sectionToUpdate,
                        );
                    } catch (error) {
                        console.error('Error updating section:', error);
                    }
                }

                // Handle deletions first
                for (const sectionId of pendingChanges.deletedSections) {
                    const sectionToDelete = sectionsOrder.find(
                        (s) => s.section_id === sectionId,
                    );
                    if (sectionToDelete && sectionToDelete.lessons) {
                        for (const lesson of sectionToDelete.lessons) {
                            await deleteLesson(
                                courseId,
                                sectionId,
                                lesson.lesson_id,
                            );
                        }
                    }
                    await deleteSection(courseId, sectionId);
                }

                // Delete marked lessons
                for (const {
                    sectionId,
                    lessonId,
                } of pendingChanges.deletedLessons) {
                    // Skip deletion for temporary lessons since they don't exist in Firebase yet
                    if (!lessonId.startsWith('temp-')) {
                        await deleteLesson(courseId, sectionId, lessonId);
                    }
                }

                for (const section of pendingChanges.sections) {
                    if (section.section_id.startsWith('temp-')) {
                        const sectionToCreate: Omit<Section, 'section_id'> = {
                            section_title: section.section_title,
                            section_order: section.section_order,
                            course_id: courseId,
                            lessons: [],
                        };

                        const createdSection = await createSections(
                            courseId,
                            sectionToCreate,
                        );

                        if (createdSection) {
                            const sectionLessons =
                                pendingChanges.lessons.filter(
                                    (lesson) =>
                                        lesson.section_id ===
                                        section.section_id,
                                );

                            for (const lesson of sectionLessons) {
                                const lessonToCreate = createLessonData(
                                    lesson,
                                    createdSection.section_id,
                                );
                                await createLessons(
                                    courseId,
                                    createdSection.section_id,
                                    lessonToCreate,
                                );
                            }
                        }
                    }
                }

                const existingSectionLessons = pendingChanges.lessons;

                // Process lessons section by section
                for (const section of sectionsOrder) {
                    const sectionLessons = existingSectionLessons.filter(
                        (lesson) => {
                            return lesson.section_id === section.section_id;
                        },
                    );

                    // Get current max lesson order for this section
                    const existingLessonsInSection = await fetchAllLessons(
                        courseId,
                        section.section_id,
                    );

                    const maxLessonOrder = Math.max(
                        ...existingLessonsInSection.map((l) => l.lesson_order),
                        0,
                    );

                    // Create each lesson with correct order
                    for (let i = 0; i < sectionLessons.length; i++) {
                        const lesson = sectionLessons[i];
                        try {
                            // Check if it's a new lesson (no ID) or has a temp/draft ID
                            if (
                                !lesson.lesson_id ||
                                lesson.lesson_id.startsWith('temp-') ||
                                lesson.lesson_id.includes('draft-') ||
                                lesson.lesson_id === ''
                            ) {
                                // For new lessons or lessons with temporary IDs
                                const lessonToCreate = createLessonData(
                                    {
                                        ...lesson,
                                        lesson_id: '', // Let Firebase generate the ID
                                        lesson_order: maxLessonOrder + i + 1,
                                    },
                                    section.section_id,
                                );
                                await createLessons(
                                    courseId,
                                    section.section_id,
                                    lessonToCreate,
                                );
                            } else {
                                // Only try to update if it's a real Firebase lesson
                                await updateLesson(
                                    courseId,
                                    section.section_id,
                                    lesson,
                                );
                            }
                        } catch (error) {
                            // Log but don't throw error so other lessons can still be processed
                            console.error(
                                'Error processing lesson:',
                                error,
                                lesson,
                            );
                        }
                    }
                }

                // Update course order and submit
                await handleSaveOrder();
                await handleSubmit(e, readyForPublish);
            }

            setPendingChanges({
                sections: [],
                deletedSections: [],
                lessons: [],
                deletedLessons: [],
            });

            navigate('/instructor/dashboard');
        } catch (error) {
            setError('Failed to save course draft.');
            console.error('Error saving draft:', error);
        }
    };

    // Handle save draft of course.
    const handleSaveDraft = async (e: React.FormEvent) => {
        await handleCourseAction(e, false);
    };

    // Handle save course.
    const handleCreateCourse = async (e: React.FormEvent) => {
        await handleCourseAction(e, true);
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
                                type='text'
                                value='FREE'
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 border border-gray focus:outline-none focus:ring-2 focus:ring-primary'
                                required
                                disabled
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
                                {specializationOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
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
                    isDraft={!courseId}
                    sectionsOrder={sectionsOrder}
                    setSectionsOrder={setSectionsOrder}
                    onSaveOrder={handleSaveOrder}
                    onSectionChange={onSectionChange}
                    onSectionDelete={onSectionDelete}
                    onLessonChange={onLessonChange}
                    onLessonDelete={onLessonDelete}
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
