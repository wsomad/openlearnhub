// QuizPanel.tsx
import { useState } from 'react';

import { Quiz } from '../../../types/quiz';

interface QuizPreviewProps {
    quizData: Quiz;
    lessonId: string;
}

type QuizState = 'start' | 'in_progress' | 'completed';

const QuizPreview: React.FC<QuizPreviewProps> = ({quizData, lessonId}) => {
    const [quizState, setQuizState] = useState<QuizState>('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: number]: number;
    }>({});
    const [score, setScore] = useState<number>(0);

    const handleStartQuiz = () => {
        setQuizState('in_progress');
        setCurrentQuestion(0);
        setSelectedAnswers({});
    };

    const handleSubmitQuiz = () => {
        let correctAnswers = 0;
        quizData.questions.forEach((question, index) => {
            if (
                selectedAnswers[index] ===
                question.question_correct_answer_index
            ) {
                correctAnswers++;
            }
        });
        setScore((correctAnswers / quizData.questions.length) * 100);
        setQuizState('completed');
    };

    if (quizState === 'start') {
        return (
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-2xl font-bold mb-4'>
                    {quizData.quiz_title}
                </h2>
                <p className='mb-4'>
                    Number of questions: {quizData.quiz_number_of_questions}
                </p>
                <button
                    onClick={handleStartQuiz}
                    className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
                >
                    Start Quiz
                </button>
            </div>
        );
    }

    if (quizState === 'completed') {
        return (
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-2xl font-bold mb-4'>Quiz Completed!</h2>
                <p className='text-lg mb-4'>Your score: {score.toFixed(1)}%</p>
                <div className='space-y-6'>
                    {quizData.questions.map((question, index) => (
                        <div key={index} className='p-4 border rounded-lg'>
                            <p className='font-medium mb-2'>
                                {question.question_text}
                            </p>
                            <p className='text-green-600'>
                                Correct answer:{' '}
                                {
                                    question.question_options[
                                        question.question_correct_answer_index
                                    ]
                                }
                            </p>
                            {selectedAnswers[index] !==
                                question.question_correct_answer_index && (
                                <p className='text-red-600'>
                                    Your answer:{' '}
                                    {
                                        question.question_options[
                                            selectedAnswers[index]
                                        ]
                                    }
                                </p>
                            )}
                            <p className='text-gray-600 mt-2'>
                                {question.question_answer_explanation}
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleStartQuiz}
                    className='mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
                >
                    Retry Quiz
                </button>
            </div>
        );
    }

    return (
        <div className='h-[600px] space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h3 className='text-xl font-semibold mb-4'>
                    Question {currentQuestion + 1} of{' '}
                    {quizData.questions.length}
                </h3>

                <div className='space-y-4'>
                    <p className='text-lg'>
                        {quizData.questions[currentQuestion].question_text}
                    </p>

                    <div className='space-y-3'>
                        {quizData.questions[
                            currentQuestion
                        ].question_options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    setSelectedAnswers({
                                        ...selectedAnswers,
                                        [currentQuestion]: index,
                                    })
                                }
                                className={`w-full p-3 text-left rounded-lg border transition-colors
                                    ${
                                        selectedAnswers[currentQuestion] ===
                                        index
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-50'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='mt-6 flex justify-between'>
                    <button
                        onClick={() =>
                            setCurrentQuestion((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentQuestion === 0}
                        className='px-4 py-2 border rounded-lg disabled:opacity-50'
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => {
                            if (
                                currentQuestion ===
                                quizData.questions.length - 1
                            ) {
                                handleSubmitQuiz();
                            } else {
                                setCurrentQuestion((prev) => prev + 1);
                            }
                        }}
                        className='px-4 py-2 bg-primary text-white rounded-lg'
                    >
                        {currentQuestion === quizData.questions.length - 1
                            ? 'Submit'
                            : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPreview;
