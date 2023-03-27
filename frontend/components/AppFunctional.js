import React, {useState} from 'react';
import axios from 'axios';


const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 

export default function AppFunctional(props) {

const [currentIndex, setCurrentIndex] = useState(initialIndex);
const [steps, setSteps] = useState(initialSteps);
const [message, setMessage] = useState(initialMessage);
const [email, setEmail] = useState(initialEmail);

const URL = "http://localhost:9000/api/result"

  

  function getXY(index) {
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }
  

  function getXYMessage() {
    const { x, y } = getXY(currentIndex);
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage)
    
    setSteps(initialSteps)
    setCurrentIndex(initialIndex)
    document.getElementById("email-form").reset();
  }

  function getNextIndex(direction, currentIndex) {
    switch (direction) {
      case 'left':
        if (currentIndex % 3 === 0) {
          setMessage("You can't go left")
          return currentIndex 
        }
        return currentIndex - 1 
      case 'up':
        if (currentIndex < 3) {
          setMessage("You can't go up")
          return currentIndex 
        }
        return currentIndex - 3 
      case 'right':
        if ((currentIndex + 1) % 3 === 0) {
          setMessage("You can't go right")
          return currentIndex 
        }
        return currentIndex + 1 
      case 'down':
        if (currentIndex > 5) {
          setMessage("You can't go down")
          return currentIndex 
        }
        return currentIndex + 3 
      default:
        return currentIndex 
    }
    
  }

  function move(direction) {
    const nextIndex = getNextIndex(direction, currentIndex);
    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
      setSteps(steps + 1);
    }
    
   
  }
  
  function onChange(evt) {
    setEmail(evt.target.value)
    
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const emails = email;
    const { x, y } = getXY(currentIndex);
    const stepss = steps ;
    
    if (x < 1 || x > 3 || y < 1 || y > 3 || stepss < 1 || !emails.includes("@")) {
      setMessage("Ouch: email is required");
      return;
    }
    const payload = { 'x':x, 'y':y, 'steps':stepss, 'email':emails };
    
    axios
      .post(URL, payload)
      .then((res) => {
        setMessage(res.data.message);
        document.getElementById("email-form").reset();
        // console.log(res.data.message);
      })
      .catch((err) => {
        // console.error(err);
        setMessage(err.response.data.message);
      });
  }
  
  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        {steps === 1 ? (
            <h3 id="steps">You moved {steps} time</h3> 
            ) : (
            <h3 id="steps">You moved {steps} times</h3> 
          )}
        
      </div>
      <div id="grid" >
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${currentIndex === idx ? ' active' : ''}`}>
              {currentIndex === idx ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move("left")}>LEFT</button>
        <button id="up" onClick={() => move("up")}>UP</button>
        <button id="right" onClick={() => move("right")}>RIGHT</button>
        <button id="down" onClick={() => move("down")}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={onSubmit} id="email-form">
        <input id="email" type="email" placeholder="Type email"  onChange={onChange}></input>
        <input id="submit" type="submit" value="Submit"></input>
      </form>
    </div>
  )
}
