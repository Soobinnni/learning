import { useState } from 'react';

import TabContent from "./Tab/TabContent";
import TabButton from './Tab/TabButton.jsx';

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
        <section id="examples">
            <h2>Examples</h2>
            <menu>
                {
                    topics.map((topic, index) => {
                        let lowerTopic = topic.toLowerCase();
                        return <TabButton key={index} isSelected={selectedTopic == lowerTopic} onSelect={() => handleSelect(lowerTopic)}>{topic}</TabButton>
                    })
                }
            </menu>
            <div id="tab-content">
                {tabContent}
            </div>
        </section>
    )
}