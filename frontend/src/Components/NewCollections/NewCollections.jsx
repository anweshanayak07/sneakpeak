import React, { useEffect, useState } from "react";

const NewCollections = () => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/newcollection`)
      .then((res) => res.json())
      .then((data) => setCollection(data))
      .catch((err) => console.error("❌ Error:", err));
  }, []);

  return (
    <div>
      {collection.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default NewCollections;
