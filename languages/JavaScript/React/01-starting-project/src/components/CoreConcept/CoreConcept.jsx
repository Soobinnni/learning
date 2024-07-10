import './CoreConcept.css';
import { CORE_CONCEPTS } from '../../data.js';

export default function CoreConcept({ index }) {
    let data = CORE_CONCEPTS[index];
    return (
      <li>
        <img src={data.image} alt='' />
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </li>
    )
  }