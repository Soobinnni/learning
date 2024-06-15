import CoreConcept from './CoreConcept.jsx';
export default function CoreConcepts({topics}){
    return (
        <section id='core-concepts'>
            <h2>Core Concepts</h2>
            <ul>
                {
                    topics.map((_, index) => (
                        <CoreConcept key={index} index={index} />
                    ))
                }
            </ul>
        </section>
    )
}