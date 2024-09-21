import React, {Component} from 'react'
import './Wedding.css';

export class Wedding extends Component {
   constructor(props){
      super(props);
      this.state = {
         novio: '',
         novia: '',
         fechaBoda: '',
         horarioBoda: '',
         message: ''
      }
   }

   handleSubmit = async (event)=>{
      event.preventDefault();
      const {novio, novia, fechaBoda, horarioBoda} = this.state;
      const userId = localStorage.getItem('userId');
      console.log('Retrieved User ID:', userId);


      // prepare the request body
      const requestBody = {
         userId,
         designName: 'Elegant',
         price: 100,
         image: 'wedding-url',
         groomName: novio,
         brideName: novia,
         date: fechaBoda,
         time: horarioBoda
      }
      
      try {
         const response = await fetch('http://localhost:3000/weddings', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
         });

         const data = await response.json();

         if(response.ok){
            this.setState({message: 'Wedding registered succesfully!'});
         }else{
            this.setState({message: data.message || 'Failed to register wedding.'});
         }
      } catch (error) {
         this.setState({message: 'An error occurred: ' + error.message});
      }


   }

   handleInputChange = (event)=>{
      const {name, value} = event.target;
      this.setState({
         [name]: value,
      })
   }

   render() {
      return (
         <div className="wedding-component">       
           <form onSubmit={this.handleSubmit}>
               <label htmlFor="novio">Nombre del novio: </label>
               <input id="novio" 
                      type="text" 
                      name="novio" 
                      placeholder="Nombre del novio" 
                      value={this.state.novio} 
                      onChange={this.handleInputChange} />

               <label htmlFor="novia">Nombre de la novia: </label>
               <input id="novia"
                      type="text"
                      name="novia"
                      placeholder='Nombre de la novia'
                      value={this.state.novia}
                      onChange={this.handleInputChange} />

               <label htmlFor="fechaBoda">Fecha de la boda: </label>
               <input id='fechaBoda' 
                      type="date"
                      name='fechaBoda'
                      value={this.state.fechaBoda}
                      onChange={this.handleInputChange} />
               <label htmlFor="horarioBoda">Horario de la boda: </label>
               <input id='horarioBoda' 
                      type="time"
                      name='horarioBoda'
                      value={this.state.horarioBoda}
                      onChange={this.handleInputChange} />
                      <button type='submit'>Register Wedding</button>
           </form>
           <p>Nombre del novio: {this.state.novio}</p>
           <p>Nombre de la novia: {this.state.novia}</p>
           <p>Fecha de la boda: {this.state.fechaBoda}</p>
           <p>Horario de la boda: {this.state.horarioBoda}</p>
         </div>
       )
   }
}
