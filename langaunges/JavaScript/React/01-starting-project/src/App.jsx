import Header from './components/Header.jsx';
import CoreConcept from './components/CoreConcept.jsx'

import { CORE_CONCEPTS } from './data.js';

function App() {
  return (
    <div>
      <Header />
      <main>
        <section id='core-concepts'>
          <h2>Core Concepts</h2>
          <ul>
            {/* 
            ====================first====================
            <CoreConcept 
              img={componentsImg} 
              title="Components"
              description="The core UI building block"  
            />
            <CoreConcept />
            <CoreConcept />
            <CoreConcept /> 

            ====================second====================
            <CoreConcept {...CORE_CONCEPTS[0]} />
            <CoreConcept {...CORE_CONCEPTS[1]} />
            <CoreConcept {...CORE_CONCEPTS[2]} />
            <CoreConcept {...CORE_CONCEPTS[3]} /> 
            */}
            {
              CORE_CONCEPTS.map((data, index) => (
                <CoreConcept key={index} {...data} />
              ))
            }
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
