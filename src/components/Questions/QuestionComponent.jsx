import React, { useState } from 'react';
import { LongStyleButton } from '../FormElements/LongStyleButton';
import { ShortStyleButton } from '../FormElements/ShortStyleButton';

export const QuestionComponent = ({
  questions, //array of questions
  currentStep, //current step/question index
  userAnswers, //array of user answers
  setUserAnswers, //function to set user answers
  handleNextQuestion, //function to handle moving to the next question
  completed, //indicates if the form is completed
}) => {
  const [validationError, setValidationError] = useState('');

  // Function to handle user input changes for text questions
  const handleInputChange = (event) => {
    const updatedAnswer = event.target.value;
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentStep] = updatedAnswer;
      return updatedAnswers;
    });
  };

  // Function to handle moving to the next question
  const handleNextQuestionClick = () => {
    // Validate user input for the name question
    if (currentStep === 0) {
      const userName = userAnswers[0];
      if (!/^[a-zA-Z\s]+$/.test(userName)) {
        setValidationError('Not valid input, try again using only letters and spaces.');
        return; // Prevent moving to the next question
      }
    } else if (questions[currentStep].type === 'select' || questions[currentStep].type === 'radio') {
      // Check if the user has made a selection for radio and select questions
      if (!userAnswers[currentStep]) {
        setValidationError('Please select an option.');
        return; // Prevent moving to the next question
      }
    }

    // Clear validation error if it was previously set
    setValidationError('');

    // Move to the next question
    handleNextQuestion();
  };

  return (
    <div className="question-section">
      {/* Conditional rendering based on the current question and completion status */}
      {currentStep < questions.length && !completed ? (
        <form onSubmit={(event) => event.preventDefault()}>
          <p>{questions[currentStep].question}</p> {/* Display the current question */}
          {questions[currentStep].type === 'text' ? (
            /* Render input field for text type question */
            <div className="first-question-section">
              <input
                className="input-field"
                type="text"
                value={userAnswers[currentStep]}
                onChange={handleInputChange}
              />
              {currentStep === 0 ? (
                <ShortStyleButton handleNextQuestion={handleNextQuestionClick} />
              ) : (
                <LongStyleButton handleNextQuestion={handleNextQuestionClick} />
              )}
              <p className="validation-error">{validationError}</p> {/* Display validation error */}
            </div>
          ) : questions[currentStep].type === 'select' ? (
            /* Render select dropdown for select type question */
            <div>
              <select
                className="input-field"
                value={userAnswers[currentStep]}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                {questions[currentStep].answers.map((answer, answerIndex) => (
                  <option key={answerIndex} value={answer.value}>
                    {answer.text}
                  </option>
                ))}
              </select>
              {currentStep !== 0 && (
                <LongStyleButton handleNextQuestion={handleNextQuestionClick} />
              )}
              <p className="validation-error">{validationError}</p> {/* Display validation error */}
            </div>
          ) : (
             /* Render radio buttons for radio type question */
            <div className="answers-section">
              {questions[currentStep].answers.map((answer, answerIndex) => (
                <label key={answerIndex}>
                  <input
                    type="radio"
                    name={`question-${currentStep}`}
                    value={answer.value}
                    checked={userAnswers[currentStep] === answer.value}
                    onChange={handleInputChange}
                  />
                  {answer.text}
                </label>
              ))}
              {currentStep !== 0 && (
                <LongStyleButton handleNextQuestion={handleNextQuestionClick} />
              )}
              <p className="validation-error">{validationError}</p> {/* Display validation error */}
            </div>
          )}
        </form>
      ) : (
        /* Render completion message when all questions are answered */
        <div>
          <p>Thank you for completing the form.</p>
          {completed && <LongStyleButton handleNextQuestion={handleNextQuestion} />}
        </div>
      )}
    </div>
  );
};
