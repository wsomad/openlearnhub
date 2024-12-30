/* eslint-disable no-undef */
import '@testing-library/jest-dom';

import React from 'react';

jest.mock('../config/FirebaseConfiguration', () => ({
    firebaseConfig: {
        apiKey: 'test-api-key',
        authDomain: 'test-auth-domain',
        projectId: 'test-project-id',
        storageBucket: 'test-storage-bucket',
        messagingSenderId: 'test-messaging-sender-id',
        appId: 'test-app-id',
    },
}));

jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(() => ({})),
    ref: jest.fn(() => ({})),
    uploadBytes: jest.fn(() => Promise.resolve()),
    getDownloadURL: jest.fn(() => Promise.resolve('https://test-url.com')),
}));

jest.mock('../services/storage/UserStorage', () => ({
    userStorage: {
        uploadProfileImage: jest.fn(() => Promise.resolve('test-url')),
    },
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
    getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(() =>
        Promise.resolve({
            user: {
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg',
            },
        }),
    ),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    getDocs: jest.fn(),
    Timestamp: {
        now: () => ({
            toDate: () => new Date(),
            seconds: 0,
            nanoseconds: 0,
        }),
        fromDate: (date: Date) => ({
            toDate: () => date,
            seconds: Math.floor(date.getTime() / 1000),
            nanoseconds: 0,
        }),
    },
}));

jest.mock('lottie-react', () => ({
    __esModule: true,
    default: jest.fn(() =>
        React.createElement('div', null, 'Lottie Animation'),
    ),
}));

// Mock custom hooks
jest.mock('../hooks/useAuth', () => ({
    useAuth: () => ({
        signUserOut: jest.fn(),
        signIn: jest.fn(() =>
            Promise.resolve({
                user: {
                    uid: 'test-uid',
                    email: 'test@example.com',
                    displayName: 'Test User',
                    photoURL: 'https://example.com/photo.jpg',
                },
            }),
        ),
        currentUser: {
            uid: 'test-uid',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://example.com/photo.jpg',
            profile_image: 'https://example.com/photo.jpg',
            username: 'Test User',
        },
    }),
}));

const mockUserState = {
    currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        username: 'Test User',
        profile_image: 'https://example.com/photo.jpg',
        instructor: {
            hasRegister: true,
        },
    },
    userRole: 'student', // Start as student
};

jest.mock('../hooks/useUser', () => ({
    useUser: () => ({
        currentUser: mockUserState.currentUser,
        userRole: mockUserState.userRole,
        toggleUserRole: jest.fn().mockImplementation(async () => {
            // Update the role when toggleUserRole is called
            mockUserState.userRole = 'instructor';
            window.history.pushState({}, '', '/instructor/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate', {state: {}}));
            return Promise.resolve();
        }),
        updateUser: jest.fn(),
        fetchUserById: jest.fn().mockImplementation(() => Promise.resolve()),
    }),
}));

// Mock course data
const mockPopularCourses = [
    {
        course_id: '1',
        course_thumbnail_url: 'https://example.com/thumbnail1.jpg',
        course_title: 'JavaScript Basics',
        course_instructor: 'John Doe',
        course_enrollment_number: 150,
    },
    {
        course_id: '2',
        course_thumbnail_url: 'https://example.com/thumbnail2.jpg',
        course_title: 'React Fundamentals',
        course_instructor: 'Jane Smith',
        course_enrollment_number: 200,
    },
];

// At the top with other mocks, add:
const mockQuestions = [
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
];

// Mock store reducer
const mockReducer = {
    questions: {
        quizQuestions: mockQuestions,
        selectedQuestion: null,
    },
};

// Mock store
jest.mock('../store/store', () => ({
    ...jest.requireActual('../store/store'),
    store: {
        getState: () => mockReducer,
        dispatch: jest.fn(),
        subscribe: jest.fn(),
    },
}));

jest.mock('../hooks/useCourses', () => ({
    useCourses: () => ({
        popularCourses: mockPopularCourses,
        allCourses: [],
        selectedCourse: null,
        loading: false,
        error: null,
        fetchAllCourses: jest.fn().mockImplementation(() => Promise.resolve()),
        createCourse: jest.fn().mockImplementation((courseData) => {
            console.log('Course created successfully:', courseData);
            return Promise.resolve();
        }),
        updateCourse: jest.fn(),
        fetchCourseById: jest.fn(),
        deleteCourse: jest.fn(),
        deleteAllCourses: jest.fn(),
        deleteSingleCourse: jest.fn(),
    }),
}));

jest.mock('../hooks/useSections', () => ({
    useSections: () => ({
        allSections: [],
        selectedSection: null,
        createSections: jest.fn(),
        updateSection: jest.fn(),
        deleteSection: jest.fn(),
        fetchAllSections: jest.fn(),
        setSelectedSection: jest.fn(),
        deleteSelectedSection: jest.fn(),
        resetSectionsState: jest.fn(),
    }),
}));

jest.mock('../hooks/useLessons', () => ({
    useLessons: () => ({
        createLessons: jest.fn(),
        updateLesson: jest.fn(),
        deleteLesson: jest.fn(),
        fetchAllLessons: jest.fn(),
        fetchLessonsForSection: jest.fn(),
        setSelectedLesson: jest.fn(),
        clearSelectedLesson: jest.fn(),
        resetLessonsState: jest
            .fn()
            .mockImplementation(() => Promise.resolve()),
    }),
}));

// Mock the questions slice
jest.mock('../store/slices/questionSlice', () => ({
    ...jest.requireActual('../store/slices/questionSlice'),
    modifyQuestionAdd: jest.fn(() => ({
        type: 'questions/modifyQuestionAdd',
        payload: mockQuestions[0],
    })),
}));

// Mock useQuestions hook
jest.mock('../hooks/useQuestions', () => ({
    useQuestions: () => ({
        quizQuestions: mockReducer.questions.quizQuestions,
        createQuestion: jest.fn(() => Promise.resolve(mockQuestions[0])),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        initializeQuizQuestions: jest.fn(),
        clearQuestionsState: jest.fn(),
    }),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({courseId: 'test-course-id'}),
}));

// Mock redux
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
    useSelector: jest.fn(),
    // Add any actions you need to mock
    clearSingleCourse: jest.fn(),
    clearSections: jest.fn(),
}));

// Mock YouTube API using window
(window as any).YT = {
    Player: jest.fn(() => ({
        getDuration: jest.fn(() => 300),
        destroy: jest.fn(),
    })),
};
