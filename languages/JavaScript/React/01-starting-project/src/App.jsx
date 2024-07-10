import Header from './components/Header/Header.jsx';
import CoreConcepts from './components/CoreConcept/CoreConcepts.jsx'
import Examples from './components/Examples.jsx'

function App() {
  // topic list
  let topics = ['Components', 'JSX', 'Props', 'State'];
  return (
    <div>
      <Header />
      <main>
        <CoreConcepts topics={topics}/>
        <Examples topics = {topics}/>
      </main>
    </div>
  )
}
export default App;