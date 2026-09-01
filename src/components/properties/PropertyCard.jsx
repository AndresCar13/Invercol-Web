import './PropertyCard.css';

function PropertyCard({ image, type, title, location, price, operation }) {
  return (
    <article className="property-card">
      <div className="property-image">
        <img src={image} alt={title} />

        <span className="property-operation">{operation}</span>
      </div>

      <div className="property-content">
        <span className="property-type">{type}</span>

        <h3>{title}</h3>

        <p className="property-location">{location}</p>

        <strong className="property-price">{price}</strong>
      </div>
    </article>
  );
}

export default PropertyCard;
