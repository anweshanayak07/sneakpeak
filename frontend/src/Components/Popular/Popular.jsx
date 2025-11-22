import React, { useEffect, useState } from "react";

const Popular = () => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/popularinmen`)
      .then((res) => res.json())
      .then((data) => setPopular(data))
      .catch((err) => console.error("❌ Error:", err));
  }, []);

  return (
    <div>
      {popular.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default Popular;
