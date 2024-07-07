import { useCallback, useState } from "react"
import QuizTimer from "./QuizTimer.jsx";
import QUESTIONS from '../questions.js'
import quizComplete from '../assets/quiz-complete.png'

export default function Quiz() {
    const [userAnswers, setUserAnswers] = useState([]);

    const activeQuestionIndex = userAnswers.length;

    const quizIsComplete = activeQuestionIndex === QUESTIONS.length; // quiz를 모두 답변했는지.

    const handleSelectAnswer = useCallback(function handleSelectAnswer(selectedAnswer) {
        setUserAnswers(preAnswer => {
            return [
                ...preAnswer, selectedAnswer
            ]
        });
    }, [])

    const handleSkipAnswer = useCallback(() => { handleSelectAnswer(null) }, [handleSelectAnswer]);

    if (quizIsComplete) {
        return (
            <div id="summary">
                <img src={quizComplete} alt="Trophy icon" />
                <h2>Quiz Completed!</h2>
            </div>
        )
    }
    // 답안의 순서를 섞기 위한 변수: if문이 먼저 있어야 함. 왜냐하면 더 이상의 배열의 요소가 없는 데 섞게 되면 문제가 발생.
    const shuffledAnswers = [...QUESTIONS[activeQuestionIndex].answers];
    shuffledAnswers.sort(() => Math.random() - 0.5);
    return (
        <div id="quiz">
            <div id="question">
                <QuizTimer 
                    timeout={10000} 
                    onTimeout={handleSkipAnswer} 
                    key = {activeQuestionIndex}    
                />
                <h2>{QUESTIONS[activeQuestionIndex].text}</h2>
                <ul id="answers">
                    {shuffledAnswers.map(answer => (
                        <li key={answer} className="answer">
                            <button onClick={() => handleSelectAnswer(answer)}>{answer}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )

}