import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TracePage = () => {
  const { hash } = useParams();
  const [traces, setTraces] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/blockchain/trace/${hash}`)
      .then(r => r.json())
      .then(data => setTraces(data.traces));
  }, []);

  return (
    <div>
      <h1>Product Trace</h1>

      {traces.map((t, i) => (
        <div key={i}>
          <p>Actor: {t.actor}</p>
          <p>Quantity: {t.quantity}</p>
          <p>Price: {t.pricePerUnit}</p>
          <p>Time: {new Date(Number(t.timestamp) * 1000).toLocaleString()}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TracePage;
