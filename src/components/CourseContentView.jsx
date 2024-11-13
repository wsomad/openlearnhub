import CourseLesson from './CourseLesson';

const CourseContentView = ({
    userType,
    courseSections,
    setCourseSections,
    onDeleteSection,
    onEditSectionTitle,
}) => {
    const updateLesson = (sectionId, updatedLesson) => {
        setCourseSections((prevSections) => {
            return prevSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map((lesson) =>
                            lesson.title === updatedLesson.oldTitle
                                ? {...lesson, ...updatedLesson.newData}
                                : lesson,
                        ),
                    };
                }
                return section;
            });
        });
    };

    const addLesson = (sectionId, newLesson) => {
        setCourseSections((prevSections) => {
            return prevSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: [...section.lessons, newLesson],
                    };
                }
                return section;
            });
        });
    };

    const deleteLesson = (sectionId, lessonTitle) => {
        setCourseSections((prevSections) => {
            return prevSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.filter(
                            (lesson) => lesson.title !== lessonTitle,
                        ),
                    };
                }
                return section;
            });
        });
    };

    return (
        <div className='font-abhaya w-full bg-white mt-4'>
            {courseSections.map((section, index) => {
                const lessonCount = section.lessons.length;
                const totalDuration = section.lessons.reduce(
                    (acc, lesson) => acc + lesson.duration,
                    0,
                );

                return (
                    <CourseLesson
                        key={section.id}
                        section={section}
                        index={index + 1}
                        lessonCount={lessonCount}
                        totalDuration={totalDuration}
                        userType={userType}
                        updateLesson={updateLesson}
                        addLesson={addLesson}
                        deleteLesson={deleteLesson}
                        onDeleteSection={onDeleteSection}
                        onEditSectionTitle={onEditSectionTitle}
                    />
                );
            })}
        </div>
    );
};

export default CourseContentView;
