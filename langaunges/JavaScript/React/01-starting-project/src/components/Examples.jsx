import { useState } from 'react';

import TabContent from "./Tab/TabContent";
import TabButton from './Tab/TabButton.jsx';
import Section from './Section.jsx';

export default function Examples({ topics }) {
    // selectedTopic
    let [selectedTopic, setSelectedTopic] = useState('');
    function handleSelect(selectedButton) {
        setSelectedTopic(selectedButton);
    }

    // tab content
    let tabContent = <p>Please select a topic.</p>;
    if (selectedTopic) {
        tabContent = <TabContent selectedTopic={selectedTopic} />;
    }
    
    return (
        <Section title="Examples" id="examples" className="examples">
            <menu>
                {
                    topics.map((topic, index) => {
                        let lowerTopic = topic.toLowerCase();
                        return <TabButton key={index} isSelected={selectedTopic == lowerTopic} onClick={() => handleSelect(lowerTopic)}>{topic}</TabButton>
                    })
                }
            </menu>
            <div id="tab-content">
                {tabContent}
            </div>
        </Section>
    )
}