import reactImg from '../../assets/react-core-concepts.png';
import './Header.css';

// start: header의 내용을 동적으로 수정하기 위함
const reactDescriptions = ["Fundamental", "Crucial", "Core"];

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}
// end

export default function Header() {
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