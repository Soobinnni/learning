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

  // tab content
  let tabContent = <p>Please select a topic.</p>;
  if(selectedTopic){
    tabContent=<TabContent selectedTopic={selectedTopic} />;
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
            <TabButton onSelect={() => handleSelect('components')}>Components</TabButton>
            <TabButton onSelect={() => handleSelect('jsx')}>JSX</TabButton>
            <TabButton onSelect={() => handleSelect('props')}>Props</TabButton>
            <TabButton onSelect={() => handleSelect('state')}>State</TabButton>
          </menu>
          <div id="tab-content">
            {tabContent}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
