import React, {Component} from 'react'
import './Wedding.css';

export class Wedding extends Component {
   constructor(props){
      super(props);
      this.state = {
         novio: '',
         novia: '',
         fechaBoda: '',
         horarioBoda: ''
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
           <form>
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
           </form>
           <p>Nombre del novio: {this.state.novio}</p>
           <p>Nombre de la novia: {this.state.novia}</p>
           <p>Fecha de la boda: {this.state.fechaBoda}</p>
           <p>Horario de la boda: {this.state.horarioBoda}</p>
         </div>
       )
   }
}
