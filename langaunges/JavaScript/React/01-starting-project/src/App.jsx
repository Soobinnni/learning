import { useState } from 'react';

import Header from './components/Header/Header.jsx';
import CoreConcept from './components/CoreConcept/CoreConcept.jsx'
import TabButton from './components/Tab/TabButton.jsx'
import TabContent from './components/Tab/TabContent.jsx'

function App() {
  // topic list
  let topics = ['Components', 'JSX', 'Props', 'State'];

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
              topics.map((_, index) => (
                <CoreConcept key={index} index={index}/>
              ))
            }
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            {
              topics.map((topic, index)=>{
                let lowerTopic = topic.toLowerCase();
                return <TabButton key={index} isSelected={selectedTopic==lowerTopic} onSelect={() => handleSelect(lowerTopic)}>{topic}</TabButton>
              })
            }
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