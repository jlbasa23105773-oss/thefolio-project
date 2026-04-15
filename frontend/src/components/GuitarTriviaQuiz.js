import React, { useState } from 'react';

// The quiz data moved from your script.js
const quizData = [
    { question: "Who inspired the author's fascination with the guitar?", options: ["Jimi Hendrix", "Eric Clapton", "B.B. King", "Stevie Ray Vaughan"], answer: 2 },
    { question: "In what year did the author start learning basic open and barre chords?", options: ["2014", "2015", "2016", "2024"], answer: 1 },
    { question: "According to the portfolio, the guitar is a tool for what?", options: ["Making money", "Storytelling", "Noise", "Relaxation"], answer: 1 },
    { question: "What did the author successfully learn in 2016?", options: ["Solos", "Jazz chords", "Major scales", "Music theory"], answer: 2 },
    { question: "When did the author start recording and posting guitar covers online?", options: ["2020", "2022", "2023", "2024"], answer: 3 },
    { question: "Which famous composer is quoted in the 'About' section?", options: ["Mozart", "Bach", "Ludwig van Beethoven", "Chopin"], answer: 2 },
    { question: "How many key milestones are listed in the author's Learning Timeline?", options: ["2", "3", "4", "5"], answer: 1 },
    { question: "What type of electric guitar is shown in the 'Gear Gallery'?", options: ["Stratocaster", "Les Paul", "Telecaster", "SG"], answer: 0 },
    { question: "According to the footer, what year is this portfolio for?", options: ["2024", "2025", "2026", "2027"], answer: 2 },
    { question: "What is the main header title of the About page?", options: ["MY JOURNEY", "MY STORY", "MY MUSIC", "MY LIFE"], answer: 1 }
];

const GuitarTriviaQuiz = () => {
   
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const currentData = quizData[currentQuestionIndex];

   
    const handleOptionSelect = (index) => {
        
        if (!isAnswerSubmitted) {
            setSelectedOptionIndex(index);
        }
    };

   
    const handleSubmit = () => {
        if (isQuizFinished) {
          
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedOptionIndex(null);
            setIsAnswerSubmitted(false);
            setIsQuizFinished(false);
            return;
        }
       setIsAnswerSubmitted(true);
        if (selectedOptionIndex === currentData.answer) {
            setScore((prevScore) => prevScore + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex + 1 < quizData.length) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setSelectedOptionIndex(null);
                setIsAnswerSubmitted(false);
            } else {
                setIsQuizFinished(true);
            }
        }, 2000);
    };

    return (
        <section className="card quiz-card">
            <div className="quiz-header">
                <h2>Guitar Trivia Quiz</h2>
                <p>Test your knowledge about the world of strings!</p>
            </div>

            <div id="quiz-box">
                {isQuizFinished ? (
                    <>
                        <h3>Quiz Complete!</h3>
                        <div id="options">
                            <p style={{ fontSize: '1.5rem', color: '#c5a059' }}>
                                Score: {score} / {quizData.length}
                            </p>
                        </div>
                    </>
                ) : (
                
                    <>
                        <h3 id="question">
                            {currentQuestionIndex + 1}. {currentData.question}
                        </h3>
                        
                        <div className="options" id="options">
                            {currentData.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`option ${selectedOptionIndex === index ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(index)}
                                    style={{ pointerEvents: isAnswerSubmitted ? 'none' : 'auto' }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                        {isAnswerSubmitted && (
                            <div id="result" style={{ textAlign: 'center', marginTop: '15px' }}>
                                {selectedOptionIndex === currentData.answer ? (
                                    <strong style={{ color: 'green' }}>Correct!</strong>
                                ) : (
                                    <>
                                        <strong style={{ color: 'red' }}>Wrong!</strong>
                                        <br />
                                        <span className="answer-hint" style={{ color: 'red' }}>
                                            Correct: {currentData.options[currentData.answer]}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}

                <button
                    id="submitBtn"
                    className="quiz-btn"
                    onClick={handleSubmit}
                    disabled={selectedOptionIndex === null && !isQuizFinished}
                >
                    {isQuizFinished ? "Restart Quiz" : "Submit Answer"}
                </button>
            </div>
        </section>
    );
};

export default GuitarTriviaQuiz;