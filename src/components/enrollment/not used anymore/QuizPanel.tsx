import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoCloseOutline, IoTrashOutline } from 'react-icons/io5';

import { Question } from '../../../types/question';
import { Quiz } from '../../../types/quiz';

interface QuizPanelProps {
    quiz: Quiz;
    setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
}

const QuizPanel: React.FC<QuizPanelProps> = ({quiz, setQuiz}) => {
    const handleAddQuestion = () => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            quiz_number_of_questions: prevQuiz.quiz_number_of_questions + 1,
            questions: [
                ...prevQuiz.questions,
                {
                    question_id: `question-${
                        prevQuiz.quiz_number_of_questions + 1
                    }`,
                    question_order: prevQuiz.quiz_number_of_questions + 1,
                    question_text: '',
                    question_options: ['', '', '', ''],
                    question_correct_answer_index: 0,
                    question_answer_explanation: '',
                },
            ],
        }));
    };

    const handleQuestionTextChange = (
        questionIndex: number,
        newText: string,
    ) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: prevQuiz.questions.map((question, index) =>
                index === questionIndex
                    ? {...question, question_text: newText}
                    : question,
            ),
        }));
    };

    const handleOptionChange = (
        questionIndex: number,
        optionIndex: number,
        newOption: string,
    ) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: prevQuiz.questions.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          question_options: question.question_options.map(
                              (option, i) =>
                                  i === optionIndex ? newOption : option,
                          ),
                      }
                    : question,
            ),
        }));
    };

    const handleCorrectAnswerChange = (
        questionIndex: number,
        newCorrectAnswerIndex: number,
    ) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: prevQuiz.questions.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          question_correct_answer_index: newCorrectAnswerIndex,
                      }
                    : question,
            ),
        }));
    };

    const handleQuestionExplanationChange = (
        questionIndex: number,
        newExplanation: string,
    ) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: prevQuiz.questions.map((question, index) =>
                index === questionIndex
                    ? {...question, question_answer_explanation: newExplanation}
                    : question,
            ),
        }));
    };

    const handleRemoveQuestion = (questionIndex: number) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            quiz_number_of_questions: prevQuiz.quiz_number_of_questions - 1,
            questions: prevQuiz.questions.filter(
                (_, index) => index !== questionIndex,
            ),
        }));
    };

    return (
        <div className='h-full'>
            <h3 className='font-abhaya text-lg font-medium mb-2'>
                Quiz Preview
            </h3>
            <div className='bg-white rounded-xl overflow-hidden h-[500px] relative'>
                <div className='h-full overflow-y-auto pr-4'>
                    {quiz.quiz_title && (
                        <div className='p-6 bg-gray-50 rounded-xl text-center'>
                            <h4 className='text-gray-600 font-medium mb-2'>
                                {quiz.quiz_title}
                            </h4>
                            <p className='text-gray-400 text-sm'>
                                {quiz.quiz_number_of_questions} questions
                            </p>
                        </div>
                    )}
                    <div className='mt-8 flex justify-end'>
                        <button
                            type='button'
                            className='bg-primary text-white px-4 py-2 flex items-center space-x-2 hover:bg-secondary-dark transition-colors'
                            onClick={handleAddQuestion}
                        >
                            <FaPlus className='w-3 h-3' />
                            <span>Add Question</span>
                        </button>
                    </div>
                    {quiz.questions.map((question, index) => (
                        <div
                            key={question.question_id}
                            className='mt-4 p-4 bg-white shadow-md border border-gray-200'
                        >
                            <div className='flex items-center justify-between'>
                                <h5 className='font-medium'>
                                    Question {question.question_order}
                                </h5>
                                <button
                                    type='button'
                                    className='text-red-500'
                                    onClick={() => handleRemoveQuestion(index)}
                                >
                                    <IoTrashOutline />
                                </button>
                            </div>
                            <input
                                type='text'
                                className='w-full border border-gray p-2 bg-transparent font-abhaya focus:ring-primary mt-2'
                                value={question.question_text}
                                onChange={(e) =>
                                    handleQuestionTextChange(
                                        index,
                                        e.target.value,
                                    )
                                }
                                placeholder='Enter question text'
                            />
                            <div className='mt-4 space-y-2'>
                                {question.question_options.map(
                                    (option, optionIndex) => (
                                        <div
                                            key={optionIndex}
                                            className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md'
                                        >
                                            <input
                                                type='radio'
                                                checked={
                                                    optionIndex ===
                                                    question.question_correct_answer_index
                                                }
                                                onChange={() =>
                                                    handleCorrectAnswerChange(
                                                        index,
                                                        optionIndex,
                                                    )
                                                }
                                                className='w-4 h-4 text-primary focus:ring-primary'
                                            />
                                            <input
                                                type='text'
                                                className='flex-1 border-none bg-transparent font-abhaya focus:ring-0'
                                                value={option}
                                                onChange={(e) =>
                                                    handleOptionChange(
                                                        index,
                                                        optionIndex,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`Option ${
                                                    optionIndex + 1
                                                }`}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                            <div className='mt-4'>
                                <label className='font-abhaya text-lg font-medium mb-1 block'>
                                    Answer Explanation
                                </label>
                                <textarea
                                    className='w-full border border-gray p-2 bg-transparent font-abhaya focus:ring-primary'
                                    value={
                                        question.question_answer_explanation ||
                                        ''
                                    }
                                    onChange={(e) =>
                                        handleQuestionExplanationChange(
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    placeholder='Enter answer explanation (optional)'
                                ></textarea>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizPanel;
