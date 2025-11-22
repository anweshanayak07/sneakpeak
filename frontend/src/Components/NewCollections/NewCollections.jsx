import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {

  const [new_collection,setNew_collection] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/newcollection`)
    .then((response) => response.json())
    .then((data)=>setNew_collection(data));
  },[])


  return (
    <section className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="new-collections-item">
        {new_collection.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </section>
  );
}

export default NewCollections;
