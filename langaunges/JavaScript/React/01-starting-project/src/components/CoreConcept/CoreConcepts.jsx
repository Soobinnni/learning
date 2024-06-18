import CoreConcept from './CoreConcept.jsx';
import Section from '../Section.jsx';
export default function CoreConcepts({topics}){
    return (
        <Section title="Core Concepts" id='core-concepts'>
            <ul>
                {
                    topics.map((_, index) => (
                        <CoreConcept key={index} index={index} />
                    ))
                }
            </ul>
        </Section>
    )
}