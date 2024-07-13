import { json, redirect } from "react-router-dom";
import EventForm from "../components/EventForm.js";

const NewEventPage = () => {
    return <EventForm/>;
};

export default NewEventPage;

export const action = async({request, params}) => {
    const data = await request.formData();

    const eventData = {
        title: data.get('title'),
        image: data.get('image'),
        date: data.get('date'),
        description: data.get('description'),
    }

    const response = await fetch('http://localhost:8080/events',{
        method: 'POST', // method: request.method
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    });

    if(response.status === 422) { // backend 유효하지 않은 데이터 상태 반환
        return response;
    }
    
    if(!response.ok) {
        throw json({message: 'Could not save event.'},{status: 500})
    }

    return redirect('/events');
}