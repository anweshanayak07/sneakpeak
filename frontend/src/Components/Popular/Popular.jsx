import React, { useEffect, useState } from "react";

const Popular = () => {
  const [popular, setPopular] = useState([]);


  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiURL}/popularinmen`)
      .then((res) => res.json())
      .then((data) => setPopular(data))
      .catch((err) =>
        console.error("❌ Error fetching popular items:", err)
      );
  }, [apiURL]);

  return (
    <div>
      {popular.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default Popular;
