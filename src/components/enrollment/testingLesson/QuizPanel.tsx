// QuizPanel.tsx
import { useEffect, useState } from 'react';

import { Quiz } from '../../../types/quiz';

interface QuizPanelProps {
    quizData: Quiz;
    lessonId: string;
}

type QuizState = 'start' | 'in_progress' | 'completed';

const QuizPanel: React.FC<QuizPanelProps> = ({quizData, lessonId}) => {
    const [quizState, setQuizState] = useState<QuizState>('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: number]: number;
    }>({});
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        setQuizState('start');
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setScore(0);
    }, [lessonId]);

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
            <div className='h-[525px] flex items-center justify-center bg-white'>
                <div className='text-center max-w-lg mx-auto p-8 border border-gray'>
                    <h2 className='text-3xl font-bold mb-6'>
                        {quizData.quiz_title}
                    </h2>
                    <div className='bg-gray/10 p-6 mb-8'>
                        <p className='text-xl'>
                            Number of questions:{' '}
                            {quizData.quiz_number_of_questions}
                        </p>
                    </div>
                    <button
                        onClick={handleStartQuiz}
                        className='w-full py-4 bg-primary text-white text-lg font-semibold hover:bg-primary/90 transition-colors'
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        );
    }

    if (quizState === 'completed') {
        return (
            <div className='h-[525px] overflow-y-auto bg-white p-8'>
                <div className='max-w-3xl mx-auto'>
                    <h2 className='text-3xl font-bold mb-4'>Quiz Completed!</h2>
                    <div
                        className={`text-2xl font-semibold mb-8 p-6 ${
                            score >= 70
                                ? 'bg-primary/10 text-primary'
                                : 'bg-delete/10 text-delete'
                        }`}
                    >
                        Your score: {score.toFixed(1)}%
                    </div>

                    <div className='space-y-6'>
                        {quizData.questions.map((question, index) => {
                            const isCorrect =
                                selectedAnswers[index] ===
                                question.question_correct_answer_index;
                            return (
                                <div
                                    key={index}
                                    className='p-6 border bg-gray/5'
                                >
                                    <p className='text-lg font-medium mb-4'>
                                        {question.question_text}
                                    </p>

                                    <div className='space-y-3'>
                                        <div className='flex items-center space-x-2'>
                                            <span className='text-primary font-medium'>
                                                Correct answer:
                                            </span>
                                            <span className='text-primary'>
                                                {
                                                    question.question_options[
                                                        question
                                                            .question_correct_answer_index
                                                    ]
                                                }
                                            </span>
                                        </div>

                                        {!isCorrect && (
                                            <div className='flex items-center space-x-2'>
                                                <span className='text-delete font-medium'>
                                                    Your answer:
                                                </span>
                                                <span className='text-delete'>
                                                    {
                                                        question
                                                            .question_options[
                                                            selectedAnswers[
                                                                index
                                                            ]
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <p className='mt-4 p-4 bg-secondary text-white'>
                                        {question.question_answer_explanation}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleStartQuiz}
                        className='mt-8 w-full py-4 bg-primary text-white text-lg font-semibold hover:bg-primary/90 transition-colors'
                    >
                        Retry Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='h-[530px] bg-white p-8 flex flex-col'>
            <div className='max-w-3xl mx-auto w-full'>
                <div className='mb-8'>
                    <h3 className='text-2xl font-bold mb-2'>
                        Question {currentQuestion + 1} of{' '}
                        {quizData.questions.length}
                    </h3>
                    <div className='w-full bg-gray/20 h-2 rounded-full'>
                        <div
                            className='bg-primary h-full rounded-full transition-all duration-300'
                            style={{
                                width: `${
                                    ((currentQuestion + 1) /
                                        quizData.questions.length) *
                                    100
                                }%`,
                            }}
                        />
                    </div>
                </div>

                <div className='space-y-6'>
                    <p className='text-xl font-medium'>
                        {quizData.questions[currentQuestion].question_text}
                    </p>

                    <div className='space-y-4'>
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
                                className={`w-full p-4 text-left border transition-all
                                    ${
                                        selectedAnswers[currentQuestion] ===
                                        index
                                            ? 'bg-primary text-white border-primary'
                                            : 'hover:bg-gray/5 border-gray'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='mt-auto pt-8 flex justify-between'>
                    <button
                        onClick={() =>
                            setCurrentQuestion((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentQuestion === 0}
                        className='px-6 py-3 border border-gray disabled:opacity-50 disabled:cursor-not-allowed'
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
                        className='px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors'
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

export default QuizPanel;
