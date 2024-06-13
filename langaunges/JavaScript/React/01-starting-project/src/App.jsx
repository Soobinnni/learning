import reactImg from './assets/react-core-concepts.png';
import componentsImg from './assets/components.png';
import { CORE_CONCEPTS } from './data.js';

// start: header의 내용을 동적으로 수정하기 위함
const reactDescriptions = ["Fundamental", "Crucial", "Core"];

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}
// end

function Header() {
  const randomStr = reactDescriptions[getRandomInt(2)];
  return (

    <header>
      {/* 
    지양할 표현.
    <img src="src/assets/react-core-concepts.png" alt="Stylized atom" />
    */}
      <img src={reactImg} alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {randomStr} React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  )
}

function CoreConcept({ image, title, description }) {
  // function CoreConcept(props) {
  return (
    <li>
      <img src={image} alt='' />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  )
}

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
