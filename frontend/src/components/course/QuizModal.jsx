import React, { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Award, RotateCcw } from "lucide-react";

const QuizModal = ({ quizzes, lessonTitle, onClose, httpClient }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const currentQuiz = quizzes[currentQuizIndex];
  const totalQuizzes = quizzes.length;

  useEffect(() => {
    fetchExistingAttempts();
  }, []);

  const fetchExistingAttempts = async () => {
    try {
      setLoading(true);
      const attempts = {};

      for (const quiz of quizzes) {
        try {
          // You'll need to create this endpoint to get user's attempt for a specific quiz
          const response = await httpClient.get(`/quizzes/${quiz.id}/attempt`);

          attempts[quiz.id] = response;
        } catch (error) {
          // No attempt found for this quiz - that's fine
          attempts[quiz.id] = null;
        }
      }

      setQuizAttempts(attempts);

      // If all quizzes have been attempted, show results
      const allAttempted = quizzes.every((quiz) => attempts[quiz.id] !== null);
      if (allAttempted) {
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!quizAttempts[currentQuiz.id]) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || quizAttempts[currentQuiz.id]) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await httpClient.post("/quiz-attempts", {
        quiz_id: currentQuiz.id,
        selected_answer: selectedAnswer,
      });

      // Update the attempts state
      setQuizAttempts((prev) => ({
        ...prev,
        [currentQuiz.id]: response,
      }));

      // Move to next quiz after a brief delay
      setTimeout(() => {
        if (currentQuizIndex < totalQuizzes - 1) {
          setCurrentQuizIndex((prev) => prev + 1);
          setSelectedAnswer(null);
        } else {
          setShowResults(true);
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting quiz answer:", error);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
    setQuizAttempts({});
    // Note: You might want to clear attempts from backend too if retakes are allowed
  };

  const getScorePercentage = () => {
    const totalPoints = quizzes.reduce((sum, quiz) => sum + quiz.points, 0);
    const earnedPoints = quizzes.reduce((sum, quiz) => {
      const attempt = quizAttempts[quiz.id];
      return sum + (attempt && attempt.is_correct ? quiz.points : 0);
    }, 0);

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  const getCorrectAnswersCount = () => {
    return quizzes.filter((quiz) => {
      const attempt = quizAttempts[quiz.id];
      return attempt && attempt.is_correct;
    }).length;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = getCorrectAnswersCount();
    const percentage = getScorePercentage();
    const passed = percentage >= 70; // You can adjust this threshold

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Quiz Results
                </h2>
                <p className="text-sm text-gray-600">{lessonTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="p-6">
            {/* Overall Score */}
            <div
              className={`text-center p-6 rounded-lg mb-6 ${
                passed
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  passed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  passed ? "text-green-800" : "text-red-800"
                }`}
              >
                {percentage}%
              </h3>
              <p
                className={`text-lg mb-2 ${
                  passed ? "text-green-700" : "text-red-700"
                }`}
              >
                {correctAnswers} out of {totalQuizzes} correct
              </p>
              <p
                className={`font-medium ${
                  passed ? "text-green-800" : "text-red-800"
                }`}
              >
                {passed
                  ? "Great job! You passed!"
                  : "Keep studying and try again!"}
              </p>
            </div>

            {/* Question Results */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900">Question Results:</h4>
              {quizzes.map((quiz, index) => {
                const attempt = quizAttempts[quiz.id];
                const isCorrect = attempt && attempt.is_correct;

                return (
                  <div
                    key={quiz.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {quiz.question}
                        </p>
                        <div className="space-y-1">
                          {quiz.options.map((option, optionIndex) => {
                            const isSelected =
                              attempt &&
                              attempt.selected_answer === optionIndex;
                            const isCorrectOption =
                              optionIndex === quiz.correct_answer;

                            let optionClass =
                              "px-3 py-2 rounded border text-sm ";

                            if (isCorrectOption) {
                              optionClass +=
                                "bg-green-100 border-green-300 text-green-800";
                            } else if (isSelected && !isCorrectOption) {
                              optionClass +=
                                "bg-red-100 border-red-300 text-red-800";
                            } else {
                              optionClass +=
                                "bg-gray-50 border-gray-200 text-gray-700";
                            }

                            return (
                              <div key={optionIndex} className={optionClass}>
                                <span className="font-medium mr-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                                {isCorrectOption && (
                                  <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                                )}
                                {isSelected && !isCorrectOption && (
                                  <XCircle className="w-4 h-4 text-red-600 inline ml-2" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {quiz.points} {quiz.points === 1 ? "point" : "points"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {/* Uncomment if retakes are allowed
              <button
                onClick={handleRetakeQuiz}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </button>
              */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAttempt = quizAttempts[currentQuiz.id];
  const hasAnswered = currentAttempt !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quiz</h2>
              <p className="text-sm text-gray-600">{lessonTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuizIndex + 1} of {totalQuizzes}
            </span>
            <span className="text-sm text-gray-600">
              {currentQuiz.points}{" "}
              {currentQuiz.points === 1 ? "point" : "points"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuiz.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, index) => {
              let buttonClass =
                "w-full text-left p-4 rounded-lg border-2 transition-all ";

              if (hasAnswered) {
                if (index === currentQuiz.correct_answer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (
                  index === currentAttempt.selected_answer &&
                  index !== currentQuiz.correct_answer
                ) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else if (selectedAnswer === index) {
                buttonClass += "border-purple-500 bg-purple-50 text-purple-800";
              } else {
                buttonClass +=
                  "border-gray-200 hover:border-purple-300 hover:bg-purple-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={hasAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {hasAnswered && index === currentQuiz.correct_answer && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    )}
                    {hasAnswered &&
                      index === currentAttempt.selected_answer &&
                      index !== currentQuiz.correct_answer && (
                        <XCircle className="w-5 h-5 text-red-600 ml-2" />
                      )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Feedback for answered question */}
          {hasAnswered && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                currentAttempt.is_correct
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center mb-2">
                {currentAttempt.is_correct ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span
                  className={`font-medium ${
                    currentAttempt.is_correct
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {currentAttempt.is_correct ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p
                className={`text-sm ${
                  currentAttempt.is_correct ? "text-green-700" : "text-red-700"
                }`}
              >
                {currentAttempt.is_correct
                  ? `Great job! You earned ${currentQuiz.points} ${
                      currentQuiz.points === 1 ? "point" : "points"
                    }.`
                  : `The correct answer was: ${
                      currentQuiz.options[currentQuiz.correct_answer]
                    }`}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() =>
                setCurrentQuizIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuizIndex === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {!hasAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null || isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Answer"
                  )}
                </button>
              ) : (
                <>
                  {currentQuizIndex < totalQuizzes - 1 ? (
                    <button
                      onClick={() => {
                        setCurrentQuizIndex((prev) => prev + 1);
                        setSelectedAnswer(null);
                      }}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowResults(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      View Results
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
