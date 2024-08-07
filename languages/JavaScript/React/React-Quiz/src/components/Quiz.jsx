import { useCallback, useState } from "react"
import Question from "./Question.jsx";
import QUESTIONS from "../questions.js";
import Summary from "./Summary.jsx";

export default function Quiz() {
    const [userAnswers, setUserAnswers] = useState([]);

    const activeQuestionIndex = userAnswers.length;

    const quizIsComplete = activeQuestionIndex === QUESTIONS.length; // quiz를 모두 답변했는지.

    const handleSelectAnswer = useCallback(function handleSelectAnswer(
        selectedAnswer
    ) {
        setUserAnswers((prevUserAnswers) => {
            return [...prevUserAnswers, selectedAnswer];
        });
    },
        []);

    const handleSkipAnswer = useCallback(() => { handleSelectAnswer(null) }, [handleSelectAnswer]);

    if (quizIsComplete) {
        return <Summary
                    userAnswers={userAnswers}
                />
    }

    return (
        <div id="quiz">
            <Question
                key={activeQuestionIndex}
                questionIndex={activeQuestionIndex}
                onSkipAnswer={handleSkipAnswer}
                onSelectAnswer={handleSelectAnswer}
            />
        </div>
    )
}