import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

// const initialState = {
//   message: initialMessage,
//   email: initialEmail,
//   index: initialIndex,
//   steps: initialSteps,
// }

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
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
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = (index) => {
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return {x , y};
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    const {x, y} = this.getXY(this.state.initialState);
    return `Coordinates (${x, y})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({
      currentIndex: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      email: initialEmail
    });
    // document.getElementById("email-form").reset();
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction, currentIndex) => {
    switch(direction){
      case 'left':
        if (currentIndex % 3 === 0) {
          return currentIndex
        }
      return currentIndex - 1
      case 'up':
        if (currentIndex < 3 ){
          return currentIndex
        }
      return currentIndex - 3
      case 'right':
        if ((currentIndex + 1) % 3 === 0 ){
          return currentIndex
        }
      return currentIndex + 1
      case 'down':
        if (currentIndex > 5) {
          return currentIndex
        }
      return currentIndex + 3
      default:
        return currentIndex 
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (direction) => {
    const nextIndex = this.getNextIndex(direction, this.state.currentIndex);
    if( nextIndex !== this.state.currentIndex){
      this.setState({
        currentIndex:nextIndex,
        steps: this.state.steps + 1
      })
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    this.setState({
      email: evt.target.value
    });
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const email = evt.target.email.value;
    const { x, y } = this.getXY(this.state.currentIndex);
    const stepss = this.state.steps;
  
    if (x < 1 || x > 3 || y < 1 || y > 3 || stepss < 1 || !email.includes("@")) {
      this.setState({
        message: "Invalid input"
      });
      return;
    }
    const payload = { 'x':x, 'y':y, 'steps':stepss, 'email':email };
    
    axios
      .post(this.URL, payload)
      .then((res) => {
        this.setState({
          message: res.data.message,
          steps: initialSteps,
          email: initialEmail,
          currentIndex: initialIndex
        });
        document.getElementById("email-form").reset();
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          message: err.message
        });
      });
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
                {idx === 4 ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move("left")}>LEFT</button>
          <button id="up" onClick={() => this.move("up")}>UP</button>
          <button id="right" onClick={() => this.move("right")}>RIGHT</button>
          <button id="down" onClick={() => this.move("down")}>DOWN</button>
          <button id="reset" onClick={() => this.move("reset")}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
