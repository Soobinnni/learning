import useHttp from "../hooks/useHttp.js"
import Error from "./Error.jsx";
import MealItem from "./MealItem.jsx";

const requestConfig = {}; 
export default function Meals() {
    const {
        data:loadedMeals, 
        isLoading, 
        error
    } = useHttp('http://localhost:3000/meals', requestConfig, []);

    if(isLoading){
        return <p className="center">Fetching meals...</p>
    }
    if(error){
        return <Error title='Failted to fetch meals...' message={error} />
    }
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