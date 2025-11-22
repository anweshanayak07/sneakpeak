import React, { useEffect, useState } from "react";
import Item from "../Item/Item";

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
    <div className="popular">
      {popular.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image}
          new_price={item.new_price}
          old_price={item.old_price}
        />
      ))}
    </div>
  );
};

export default Popular;
