import { useState } from 'react';

import Header from './components/Header/Header.jsx';
import CoreConcept from './components/CoreConcept/CoreConcept.jsx'
import TabButton from './components/Tab/TabButton.jsx'
import TabContent from './components/Tab/TabContent.jsx'

import { CORE_CONCEPTS } from './data.js';

function App() {
  // selectedTopic
  let [selectedTopic, setSelectedTopic] = useState('');
  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
  }
  return (
    <div>
      <Header />
      <main>
        <section id='core-concepts'>
          <h2>Core Concepts</h2>
          <ul>
            {
              CORE_CONCEPTS.map((data, index) => (
                <CoreConcept key={index} {...data} />
              ))
            }
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            {/* 
              onSelect은 정의된 클릭이벤트가 아니고, 사용자 정의 
              () => {}는, 전개하면
               function () => 표현의 익명함수
            */}
            <TabButton onSelect={() => handleSelect('components')}>Components</TabButton>
            <TabButton onSelect={() => handleSelect('jsx')}>JSX</TabButton>
            <TabButton onSelect={() => handleSelect('props')}>Props</TabButton>
            <TabButton onSelect={() => handleSelect('state')}>State</TabButton>
          </menu>
          <div id="tab-content">
            {
              !selectedTopic ? <p>Please select a topic.</p> :
                <TabContent selectedTopic={selectedTopic} />
            }
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
