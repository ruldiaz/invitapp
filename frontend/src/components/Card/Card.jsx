import React from 'react';
import './dummyProducts';
import { products } from './dummyProducts';
import './Card.css';

export const Card = () => {
  console.log(JSON.stringify(products, null, 2));
  
  return (
    <div className='card-component'>
      {products.map((e) => (
        <div key={e.id} className='card-item'>
          <h3>{e.designName}</h3>
          <h4>$ {e.price}</h4>
          <img src={e.image} width={150} height={150} alt={e.designName} />
        </div>
      ))}
    </div>
  );
};
