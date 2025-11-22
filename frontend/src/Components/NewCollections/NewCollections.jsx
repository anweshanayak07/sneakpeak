import React, { useEffect, useState } from "react";

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
    <div>
      {collection.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default NewCollections;
