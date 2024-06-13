export default function CoreConcept({ image, title, description }) {
    // function CoreConcept(props) {
    return (
      <li>
        <img src={image} alt='' />
        <h3>{title}</h3>
        <p>{description}</p>
      </li>
    )
  }