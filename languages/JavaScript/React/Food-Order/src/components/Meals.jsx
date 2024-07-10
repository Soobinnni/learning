import { useEffect } from "react"
import { useState } from "react"
import MealItem from "./MealItem.jsx";

export default function Meals() {
    const [loadedMeals, setLoadedMeals] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchMeals() {
            setIsFetching(false);

            const response = await fetch('http://localhost:3000/meals');

            if (!response.ok) {
            }

            const meals = await response.json();
            setLoadedMeals(meals);
            setIsFetching(true);

        }

        fetchMeals();
    }, []);

    return (
        <ul id="meals">
            {
                loadedMeals != '' && (
                    loadedMeals.map(meal => (
                        <MealItem 
                            key={meal.id}
                            meal={meal}
                        />
                    )
                    )
                )
            }
        </ul>
    )
}