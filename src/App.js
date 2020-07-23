import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function getClue() {
  return fetch('http://jservice.io/api/random');
}

function App() {
  const [clue, setClue] = useState({
    question: "something",
    answer: "what is something?",
    category: "Potent Potables"
  })

  const nextClue = () => {
    getClue().then((clue) => {
      console.log(clue);
      clue.json().then((response) => {
        console.log(response[0]);
        const generatedClue = response[0];
        debugger;
        setClue({
          question: generatedClue.question,
          answer: generatedClue.answer,
          category: generatedClue.category.title
        })
      });
    });
  }
  return (
    <div className="App">
      <div>
        Jeopardy
      </div>
      <div>
        Category: {clue.category}
      </div>
      <div>
        Answer: {clue.question}
      </div>
      <div>
        What is?: {clue.answer}
      </div>
      <button onClick={nextClue}>Get Clue</button>
    </div>
  );
}

export default App;
