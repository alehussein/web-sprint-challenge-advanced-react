import React from 'react';
import axios from 'axios';


const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 



export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      message: initialMessage,
      email: initialEmail,
      currentIndex: initialIndex,
      steps: initialSteps,
    };
    this.URL="http://localhost:9000/api/result";
    this.getXY = this.getXY.bind(this);
    this.getXYMessage = this.getXYMessage.bind(this);
    this.reset = this.reset.bind(this);
    this.getNextIndex = this.getNextIndex.bind(this);
    this.move = this.move.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  

  getXY = (currentIndex) => {
    const x = currentIndex % 3 + 1;
    const y = Math.floor(currentIndex / 3) + 1;
    return {x , y};
  }
  

  getXYMessage = () => {
    const {x, y} = this.getXY(this.state.currentIndex);
    return `Coordinates (${x}, ${y})`
    
  }
  

  reset = () => {
    this.setState({
      currentIndex: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      email: initialEmail
    });
    document.getElementById("email-form").reset();
 
  }

  getNextIndex = (direction, currentIndex) => {
    switch(direction){
      case 'left':
        if (currentIndex % 3 === 0) {
          this.setState({
            message: "You can't go left"
          })
          return currentIndex
        }
      return currentIndex - 1
      case 'up':
        if (currentIndex < 3 ){
          this.setState({
            message: "You can't go up"
          })
          return currentIndex
        }
      return currentIndex - 3
      case 'right':
        if ((currentIndex + 1) % 3 === 0 ){
          this.setState({
            message: "You can't go right" 
          });
          return currentIndex
        }
      return currentIndex + 1
      case 'down':
        if (currentIndex > 5) {
          this.setState({
            message: "You can't go down"
          })
          return currentIndex
        }
      return currentIndex + 3
      default:
        return currentIndex 
    }
   
  }

  move = (direction) => {
    const nextIndex = this.getNextIndex(direction, this.state.currentIndex);
    if( nextIndex !== this.state.currentIndex){
      this.setState({
        currentIndex:nextIndex,
        steps: this.state.steps + 1
      })
    }
   
  }

  onChange = (evt) => {
    this.setState({
      email: evt.target.value
    });
    
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const email = this.state.email;
    const { x, y } = this.getXY(this.state.currentIndex);
    const stepss = this.state.steps;
  
    if (x < 1 || x > 3 || y < 1 || y > 3 || stepss < 1 || !email.includes("@")) {
      this.setState({
        message: "Ouch: email is required."
      });
      return;
    }
    const payload = { 'x':x, 'y':y, 'steps':stepss, 'email':email };
    
    axios
      .post(this.URL, payload)
      .then((res) => {
        this.setState({
          message: res.data.message,
          // steps: initialSteps,
          // email: initialEmail,
          // currentIndex: initialIndex
        });
        document.getElementById("email-form").reset();
      })
      .catch((err) => {
        // console.error(err);
        this.setState({
          message: err.response.data.message
        });
      });
  
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          { this.state.steps === 1 ? (
            <h3 id="steps">{`You moved ${this.state.steps} time`}</h3>
          ):(
            <h3 id="steps">{`You moved ${this.state.steps} times`}</h3>
          )}
          
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.currentIndex ? ' active' : ''}`}>
                {idx === this.state.currentIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move("left")}>LEFT</button>
          <button id="up" onClick={() => this.move("up")}>UP</button>
          <button id="right" onClick={() => this.move("right")}>RIGHT</button>
          <button id="down" onClick={() => this.move("down")}>DOWN</button>
          <button id="reset" onClick={() => this.reset("reset")}>reset</button>
        </div>
        <form onSubmit={this.onSubmit} id="email-form">
          <input id="email" type="email" placeholder="type email" name="email" onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
