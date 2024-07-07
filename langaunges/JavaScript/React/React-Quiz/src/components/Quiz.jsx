import { useState } from "react"
import QUESTIONS from '../questions.js'

export default function Quiz() {
    const [userAnswers, setUserAnswers] = useState([]);

    const activeQuestionIndx = userAnswers.length;

    function handleSelectAnswer(selectedAnswer) {
        setUserAnswers(preAnswer => {
            return [
                ...preAnswer, selectedAnswer
            ]
        });
    }
    return (
        <div id="quiz">
            <div id="questions">
                <h2>{QUESTIONS[activeQuestionIndx].text}</h2>
                <ul id="answers">
                    {QUESTIONS[activeQuestionIndx].answers.map(answer => (
                        <li key={answer} className="answer">
                            <button onClick={() => handleSelectAnswer(answer)}>{answer}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )

}