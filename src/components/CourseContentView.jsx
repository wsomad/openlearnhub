import CourseLesson from './CourseLesson';

const CourseContentView = ({userType}) => {
    // Dummy data of course sections with lessons
    const courseSections = [
        {
            id: 1,
            title: 'Introduction to Programming',
            lessons: [
                {title: 'Welcome Message', duration: 2},
                {title: 'What is Programming?', duration: 3},
                {title: 'Setting Up Your Environment', duration: 5},
            ],
        },
        {
            id: 2,
            title: 'Web Development Basics',
            lessons: [
                {title: 'HTML Fundamentals', duration: 4},
                {title: 'CSS Styling', duration: 6},
                {title: 'Responsive Design', duration: 5},
            ],
        },
        {
            id: 3,
            title: 'Data Structures',
            lessons: [
                {title: 'Arrays and Lists', duration: 4},
                {title: 'Stacks and Queues', duration: 5},
                {title: 'Linked Lists', duration: 6},
            ],
        },
        {
            id: 4,
            title: 'Algorithms',
            lessons: [
                {title: 'Sorting Algorithms', duration: 5},
                {title: 'Searching Algorithms', duration: 6},
                {title: 'Graph Algorithms', duration: 4},
            ],
        },
        {
            id: 5,
            title: 'Databases and SQL',
            lessons: [
                {title: 'Database Design', duration: 4},
                {title: 'SQL Queries', duration: 5},
                {title: 'Normalization', duration: 6},
            ],
        },
        {
            id: 6,
            title: 'Object-Oriented Programming',
            lessons: [
                {title: 'Classes and Objects', duration: 4},
                {title: 'Inheritance and Polymorphism', duration: 5},
                {title: 'Encapsulation', duration: 6},
            ],
        },
        {
            id: 7,
            title: 'JavaScript Fundamentals',
            lessons: [
                {title: 'Variables and Data Types', duration: 3},
                {title: 'Functions and Scope', duration: 4},
                {title: 'DOM Manipulation', duration: 6},
            ],
        },
        {
            id: 8,
            title: 'Python for Beginners',
            lessons: [
                {title: 'Python Basics', duration: 4},
                {title: 'Control Flow', duration: 5},
                {title: 'Functions and Modules', duration: 6},
            ],
        },
        {
            id: 9,
            title: 'Machine Learning',
            lessons: [
                {title: 'Introduction to ML', duration: 4},
                {title: 'Supervised Learning', duration: 5},
                {title: 'Unsupervised Learning', duration: 6},
            ],
        },
        {
            id: 10,
            title: 'Mobile App Development',
            lessons: [
                {title: 'Getting Started with React Native', duration: 5},
                {title: 'Building UI Components', duration: 6},
                {title: 'Handling State', duration: 4},
            ],
        },
        {
            id: 11,
            title: 'Cloud Computing',
            lessons: [
                {title: 'Introduction to Cloud', duration: 4},
                {title: 'Cloud Services Overview', duration: 5},
                {title: 'Deploying Applications', duration: 6},
            ],
        },
    ];

    // Function to calculate total lessons and duration for a section
    const calculateSectionSummary = (lessons) => {
        const totalDuration = lessons.reduce(
            (acc, lesson) => acc + lesson.duration,
            0,
        );
        return {
            lessonCount: lessons.length,
            totalDuration,
        };
    };

    return (
        <div className='font-abhaya w-full bg-white mt-4'>
            {courseSections.map((section, index) => {
                const {lessonCount, totalDuration} = calculateSectionSummary(
                    section.lessons,
                );
                return (
                    <CourseLesson
                        key={section.id}
                        section={section}
                        index={index + 1}
                        lessonCount={lessonCount}
                        totalDuration={totalDuration}
                        userType={userType} // Pass userType to CourseLesson for conditional rendering
                    />
                );
            })}
        </div>
    );
};

export default CourseContentView;
