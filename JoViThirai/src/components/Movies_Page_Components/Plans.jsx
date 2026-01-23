const plans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Access to 1 movie / week",
      "Standard Definition",
      "Limited Support",
    ],
  },
  {
    name: "Standard",
    price: "$9.99 / mo",
    features: [
      "Access to 5 movies / week",
      "HD Quality",
      "24/7 Support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$15.99 / mo",
    features: [
      "Unlimited movies",
      "Ultra HD (4K)",
      "Offline downloads",
      "Priority Support",
    ],
  },
];

const Plans = ({ onSelectPlan }) => {
  return (
    <div style={styles.container}>
      {plans.map((plan, idx) => (
        <div
          key={idx}
          style={{
            ...styles.card,
            ...(plan.popular ? styles.popularCard : {}),
          }}
        >
          <h2>{plan.name}</h2>
          <p style={styles.price}>{plan.price}</p>
          <ul style={styles.featuresList}>
            {plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <button
            style={styles.button}
            onClick={() => onSelectPlan(plan.name)}
          >
            Select
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    width: "250px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  popularCard: {
    border: "2px solid #007bff",
    transform: "scale(1.05)",
    backgroundColor: "#f0f8ff",
  },
  price: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  featuresList: {
    textAlign: "left",
    listStyleType: "none",
    padding: 0,
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Plans;
