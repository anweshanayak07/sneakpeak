import React, { useEffect, useState } from "react";
import Item from "../Item/Item";

const NewCollections = () => {
  const [collection, setCollection] = useState([]);

  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiURL}/newcollection`)
      .then((res) => res.json())
      .then((data) => setCollection(data))
      .catch((err) => console.error("❌ Error fetching new collection:", err));
  }, [apiURL]);

  return (
    <div className="new-collections">
      {collection.map((item) => (
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

export default NewCollections;
