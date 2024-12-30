import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { DocumentLesson, QuizLesson, VideoLesson } from '@/types/lesson';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { store } from '../../store/store';

// Test data for the course creation
const mockCourseData = {
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development',
    type: 'Web Development',
    requirements: [
        'Basic programming knowledge',
        'Computer with internet access',
    ],
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    sections: [
        {
            section_id: 'section-1',
            title: 'Getting Started with Web Development',
            lessons: [
                {
                    lesson_id: 'doc-lesson-1',
                    section_id: 'section-1',
                    lesson_title: 'Introduction to HTML',
                    lesson_order: 1,
                    lesson_type: 'document' as const,
                    document_url:
                        'https://docs.google.com/document/d/test-html',
                } satisfies DocumentLesson,
                {
                    lesson_id: 'video-lesson-1',
                    section_id: 'section-1',
                    lesson_title: 'CSS Basics Tutorial',
                    lesson_order: 2,
                    lesson_type: 'video' as const,
                    video_url: 'https://youtube.com/watch?v=test-css',
                    video_duration: 300,
                } satisfies VideoLesson,
            ],
        },
        {
            section_id: 'section-2',
            title: 'Basic Concepts Quiz',
            lessons: [
                {
                    lesson_id: 'quiz-lesson-1',
                    section_id: 'section-2',
                    lesson_title: 'HTML & CSS Quiz',
                    lesson_order: 1,
                    lesson_type: 'quiz' as const,
                    quiz: {
                        quiz_id: 'quiz-1',
                        quiz_title: 'HTML & CSS Quiz',
                        quiz_number_of_questions: 1,
                        questions: [
                            {
                                question_id: 'q1',
                                question_order: 1,
                                question_text: 'What does HTML stand for?',
                                question_options: [
                                    'Hyper Text Markup Language',
                                    'High Tech Modern Language',
                                    'Hyper Transfer Markup Logic',
                                    'Home Tool Markup Language',
                                ],
                                question_correct_answer_index: 0,
                                question_answer_explanation:
                                    'HTML is the standard markup language for creating web pages.',
                            },
                        ],
                    },
                } satisfies QuizLesson,
            ],
        },
    ],
};

describe('Course Creation Flow', () => {
    jest.setTimeout(30000);
    jest.spyOn(console, 'log');

    const navigate = jest.fn((path) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate', {state: {}}));
    });

    beforeAll(() => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => navigate,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        window.history.pushState({}, '', '/auth');
        navigate.mockClear();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>,
        );
    });

    test('Navigate to course creation page', async () => {
        const user = userEvent.setup();

        // === Authentication Flow ===
        // Sign in with test credentials
        const emailInput = screen.getByPlaceholderText('Email@example.com');
        const passwordInput = screen.getByPlaceholderText('Password');
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', {name: /sign in/i});
        await user.click(submitButton);

        // Wait for successful login message
        await waitFor(
            () => {
                expect(
                    screen.getByText('Successfully logged in!'),
                ).toBeInTheDocument();
            },
            {timeout: 5000},
        );

        // Manually navigate to home page
        navigate('/home');

        // Wait for HomePage elements
        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText(
                'Search for any course...',
            );
            expect(searchInput).toBeInTheDocument();
        });

        // Verify course cards are rendered
        await waitFor(() => {
            expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
            expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        });

        // Look for and click the user menu
        const userMenuButton = screen.getByTestId('user-menu-button');
        expect(userMenuButton).toBeInTheDocument();
        await user.click(userMenuButton);

        // Click Switch to Instructor
        const switchButton = await screen.findByText('Switch to Instructor');
        await user.click(switchButton);

        // Verify navigation to instructor dashboard
        await waitFor(() => {
            expect(window.location.pathname).toBe('/instructor/dashboard');
        });

        // Wait for dashboard elements and find the New Course link
        await waitFor(() => {
            expect(
                screen.getByText('Instructor Dashboard'),
            ).toBeInTheDocument();
        });

        const newCourseLink = screen.getByRole('link', {name: /new course/i});
        await user.click(newCourseLink);

        // Verify navigation to course creation page
        await waitFor(() => {
            expect(window.location.pathname).toBe(
                '/instructor/dashboard/course/create',
            );
            expect(screen.getByText('Create A New Course')).toBeInTheDocument();
        });

        // === Course Basic Info Creation ===
        // Fill in required course details (title, description, type, requirements)
        // Fill Course Title
        const titleInput = screen.getByLabelText(/Course Title/i);
        await user.type(titleInput, mockCourseData.title);
        expect(titleInput).toHaveValue(mockCourseData.title);

        // Fill Course Description
        const descriptionInput = screen.getByLabelText(/Course Description/i);
        await user.type(descriptionInput, mockCourseData.description);
        expect(descriptionInput).toHaveValue(mockCourseData.description);

        // Select Course Type
        const typeSelect = screen.getByLabelText(/Course Type/i);
        await user.selectOptions(typeSelect, mockCourseData.type);
        expect(typeSelect).toHaveValue(mockCourseData.type);

        // Add Course Requirements
        for (const requirement of mockCourseData.requirements) {
            const addRequirementButton = screen.getByRole('button', {
                name: /Add Requirement/i,
            });
            await user.click(addRequirementButton);

            // Get the last requirement input field
            const requirementInputs =
                screen.getAllByPlaceholderText(/Enter requirement/i);
            const lastInput = requirementInputs[requirementInputs.length - 1];
            await user.type(lastInput, requirement);
            expect(lastInput).toHaveValue(requirement);
        }

        // Add Thumbnail URL
        const thumbnailInput = screen.getByLabelText(/Thumbnail URL/i);
        await user.type(thumbnailInput, mockCourseData.thumbnailUrl);
        expect(thumbnailInput).toHaveValue(mockCourseData.thumbnailUrl);

        // Verify all required fields are filled
        expect(screen.getByLabelText(/Course Title/i)).toHaveValue(
            mockCourseData.title,
        );
        expect(screen.getByLabelText(/Course Description/i)).toHaveValue(
            mockCourseData.description,
        );
        expect(screen.getByLabelText(/Course Type/i)).toHaveValue(
            mockCourseData.type,
        );
        expect(screen.getByLabelText(/Thumbnail URL/i)).toHaveValue(
            mockCourseData.thumbnailUrl,
        );

        // Verify all requirements are present
        mockCourseData.requirements.forEach((requirement) => {
            expect(screen.getByDisplayValue(requirement)).toBeInTheDocument();
        });

        // === First Section Creation ===
        // === "Getting Started with Web Development" ===
        await waitFor(() => {
            const courseContentDiv = screen.getByTestId('course-content-list');
            expect(courseContentDiv).toBeInTheDocument();
        });

        // Look for the New Section button and click it
        const newSectionButton = screen.getByTestId('new-section-button');
        expect(newSectionButton).toBeInTheDocument();
        await user.click(newSectionButton);

        // Verify the modal appears
        await waitFor(() => {
            const modalHeading = screen.getByText('Create New Section');
            expect(modalHeading).toBeInTheDocument();
        });

        // Fill in the section title
        const sectionTitleInput = screen.getByLabelText(/Section Title/i);
        await user.type(sectionTitleInput, mockCourseData.sections[0].title);

        // Click Create Section button
        const createSectionButton = screen.getByRole('button', {
            name: /Create Section$/i,
        });
        await user.click(createSectionButton);

        // Add a longer delay for state updates
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Then verify the section was created
        await waitFor(
            () => {
                // Find all elements that start with 'section-title-'
                const sectionTitles = screen.getAllByTestId(/^section-title-/);

                // Check if any of them contain our text
                const hasSection = sectionTitles.some((element) =>
                    element.textContent?.includes(
                        'Getting Started with Web Development',
                    ),
                );

                expect(hasSection).toBe(true);
            },
            {timeout: 5000},
        );

        // Also add a delay after modal closes
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Click to expand the section (since lessons are in a collapsible panel)
        const sectionHeader = screen.getByText(
            /1\. Getting Started with Web Development/,
        );
        await user.click(sectionHeader);

        // Wait for section to expand and verify empty state
        await waitFor(() => {
            const noLessonsText = screen.getByText(
                'No lessons available in this section',
            );
            expect(noLessonsText).toBeInTheDocument();
        });

        // Add document lesson to first section
        const addLessonButton = screen.getByTestId('add-lesson-button');
        await user.click(addLessonButton);

        // Wait for lesson modal to appear
        await waitFor(
            () => {
                const modalTitle = screen.getByText('Add New Lesson');
                expect(modalTitle).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // After the modal appears, fill in the lesson details
        const lessonTitleInput =
            screen.getByPlaceholderText('Enter lesson title');
        const firstLesson = mockCourseData.sections[0].lessons[0];
        await user.type(lessonTitleInput, firstLesson.lesson_title);

        // Verify document type is selected by default
        const lessonTypeSelect = screen.getByRole('combobox', {
            name: /Lesson Type/i,
        });
        expect(lessonTypeSelect).toHaveValue('document');

        // Fill in document URL
        const documentUrlInput =
            screen.getByPlaceholderText('Enter document URL');
        if (firstLesson.lesson_type === 'document') {
            await user.type(documentUrlInput, firstLesson.document_url);
        }

        // Click the Add Lesson button in the modal
        const submitLessonButton = screen.getByTestId('submit-lesson-button');
        await user.click(submitLessonButton);

        // Wait for the lesson to appear in the section
        await waitFor(
            () => {
                // Look for the lesson title in the section
                const lessonTitle = screen.getByText(
                    `1. ${firstLesson.lesson_title}`,
                );
                expect(lessonTitle).toBeInTheDocument();

                // Verify lesson type is shown
                const lessonTypeText = screen.getByText(/document/i, {
                    exact: false,
                });
                expect(lessonTypeText).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // Add video lesson to first section
        await user.click(addLessonButton);

        // Wait for lesson modal to appear
        await waitFor(
            () => {
                const modalTitle = screen.getByText('Add New Lesson');
                expect(modalTitle).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // Fill in lesson details
        const videoLesson = mockCourseData.sections[0].lessons[1];
        // Get the input element again as it's a new modal instance
        const videoLessonTitleInput =
            screen.getByPlaceholderText('Enter lesson title');
        await user.type(videoLessonTitleInput, videoLesson.lesson_title);

        // Select video type
        const videoLessonTypeSelect = screen.getByRole('combobox', {
            name: /Lesson Type/i,
        });
        await user.selectOptions(videoLessonTypeSelect, 'video');
        expect(videoLessonTypeSelect).toHaveValue('video');

        // Fill in video URL and submit
        const videoUrlInput = screen.getByPlaceholderText('Enter YouTube URL');
        if (videoLesson.lesson_type === 'video') {
            await user.type(videoUrlInput, videoLesson.video_url);
        }

        // Get the submit button from the new modal
        const videoSubmitButton = screen.getByTestId('submit-lesson-button');
        await user.click(videoSubmitButton);

        // Add verification for video lesson first (this was missing)
        await waitFor(
            () => {
                // Look for the lesson title in the section
                const lessonTitle = screen.getByText(
                    `2. ${videoLesson.lesson_title}`,
                );
                expect(lessonTitle).toBeInTheDocument();

                // Verify lesson type is shown
                const lessonTypeText = screen.getByText(/video/i, {
                    exact: false,
                });
                expect(lessonTypeText).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // === Second Section Creation : "Basic Concepts Quiz" ===
        // Create section for quiz
        await user.click(newSectionButton);

        // Wait for section modal to appear
        await waitFor(() => {
            const modalHeading = screen.getByText('Create New Section');
            expect(modalHeading).toBeInTheDocument();
        });

        // Fill in the section title
        const quizSectionTitleInput = screen.getByLabelText(/Section Title/i);
        await user.type(
            quizSectionTitleInput,
            mockCourseData.sections[1].title,
        );

        // Get and click the new Create Section button since it's a new modal instance
        const quizCreateSectionButton = screen.getByRole('button', {
            name: /Create Section$/i,
        });
        await user.click(quizCreateSectionButton);

        // Add a delay then verify section creation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add a longer delay for state updates
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verify the quiz section was created with more detailed error handling
        await waitFor(
            () => {
                const sectionTitles = screen.getAllByTestId(/^section-title-/);
                const hasSection = sectionTitles.some((element) =>
                    element.textContent?.includes('Basic Concepts Quiz'),
                );
                expect(hasSection).toBe(true);
            },
            {
                timeout: 5000,
                onTimeout: (error) => {
                    return error;
                },
            },
        );

        // Add another delay after verification
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Click to expand the quiz section
        const quizSectionHeader = screen.getByText(/2\. Basic Concepts Quiz/);
        await user.click(quizSectionHeader);

        // Wait for section to expand
        await waitFor(() => {
            const noLessonsText = screen.getByText(
                'No lessons available in this section',
            );
            expect(noLessonsText).toBeInTheDocument();
        });

        // Add quiz lesson with question and options
        const quizLessonButton = within(
            screen
                .getByText(/2\. Basic Concepts Quiz/)
                .closest('div[data-testid^="section-"]')!,
        ).getByTestId('add-lesson-button');

        // Click the quiz section's add lesson button
        await user.click(quizLessonButton);

        // Wait for lesson modal
        await waitFor(
            () => {
                const modalTitle = screen.getByText('Add New Lesson');
                expect(modalTitle).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // Add Quiz Lesson section
        const quizLesson = mockCourseData.sections[1].lessons[0] as QuizLesson;
        const quizLessonTitleInput =
            screen.getByPlaceholderText('Enter lesson title');
        await user.type(quizLessonTitleInput, quizLesson.lesson_title);

        // Select quiz type
        const quizLessonTypeSelect = screen.getByRole('combobox', {
            name: /Lesson Type/i,
        });
        await user.selectOptions(quizLessonTypeSelect, 'quiz');
        expect(quizLessonTypeSelect).toHaveValue('quiz');

        // First wait for the quiz form to initialize
        await waitFor(
            () => {
                // First verify quiz type is selected
                const quizTitleInput =
                    screen.queryByPlaceholderText('Enter quiz title');
                expect(quizTitleInput).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // Add a small delay to allow state updates
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Then check for question-specific elements
        await waitFor(
            () => {
                // Try to find any quiz-related elements
                const addQuestionButton = screen.queryByRole('button', {
                    name: /Add New Question/i,
                });
                expect(addQuestionButton).toBeInTheDocument();
            },
            {timeout: 2000},
        );

        // Fill in quiz title (using the same title as the lesson)
        const quizTitleInput = screen.getByPlaceholderText('Enter quiz title');
        await user.type(quizTitleInput, quizLesson.quiz.quiz_title);

        // Fill in first question
        const questionInput = screen.getByPlaceholderText(
            'Enter your question',
        );
        await user.type(
            questionInput,
            quizLesson.quiz.questions[0].question_text,
        );

        // Fill in options for first question - find all option inputs
        const optionInputs = screen.getAllByPlaceholderText(/Option \d/);
        expect(optionInputs.length).toBe(4); // Should have 4 options

        // Fill in each option
        for (
            let i = 0;
            i < quizLesson.quiz.questions[0].question_options.length;
            i++
        ) {
            await user.type(
                optionInputs[i],
                quizLesson.quiz.questions[0].question_options[i],
            );
        }

        // Select correct answer
        const correctAnswerSelect = screen.getByLabelText('Correct Answer');
        await user.selectOptions(
            correctAnswerSelect,
            String(quizLesson.quiz.questions[0].question_correct_answer_index),
        );

        // Add explanation
        const explanationInput = screen.getByPlaceholderText(
            /Why is this the correct answer?/i,
        );
        await user.type(
            explanationInput,
            quizLesson.quiz.questions[0].question_answer_explanation || '',
        );

        // Submit the quiz lesson
        const quizSubmitButton = screen.getByTestId('submit-lesson-button');
        await user.click(quizSubmitButton);

        // Verify the quiz lesson was created
        await waitFor(
            () => {
                // Get all quiz sections by test id pattern
                const sections = screen.getAllByTestId(/^section-title-/);
                const secondSection = sections[1]; // Get the second section
                expect(secondSection).toHaveTextContent(
                    '2. Basic Concepts Quiz',
                );

                // Get all lesson titles in the document
                const lessonTitles = screen.getAllByText(/HTML & CSS Quiz/i);
                // We should find the quiz lesson in one of them
                expect(lessonTitles.length).toBeGreaterThan(0);

                // Find the specific paragraph with type 'quiz'
                const lessonTypes = screen.getAllByText('quiz', {exact: false});
                // Should be at least one element with type 'quiz'
                expect(lessonTypes.length).toBeGreaterThan(0);
            },
            {timeout: 3000},
        );

        // Clicking Save Draft button
        const saveDraftButton = screen.getByRole('button', {
            name: /Save Draft/i,
        });
        await user.click(saveDraftButton);

        // Verify the console log
        await waitFor(
            () => {
                expect(console.log).toHaveBeenCalledWith(
                    'Course created successfully:',
                    expect.objectContaining({
                        course_title: mockCourseData.title,
                        ready_for_publish: false,
                    }),
                );
            },
            {timeout: 2000},
        );
    }, 50000);
});
