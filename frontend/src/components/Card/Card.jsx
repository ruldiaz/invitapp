import React from 'react'
import './dummyProducts';
import { products } from './dummyProducts';
import './Card.css';

export const Card = () => {
   console.log(JSON.stringify(products, null, 2));
   
  return (
    <div className='card-component'>
    
      {products.map((e)=>(
         <li key={e.id}>
            <p>{e.designName}</p>
            <p>{e.price}</p>
            <img src={e.image} width={150} height={150} alt={e.designName} />
         </li>
      ))}
    
    </div>
  )
}
