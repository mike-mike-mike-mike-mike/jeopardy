import React, { useState } from 'react';
import './App.css';

function getClue() {
  return fetch('http://jservice.io/api/random');
}

function JeopardyCard(props) {
  const {
    category,
    question,
    answer,
    value,
    showAnswer
  } = props;

  return (
    <div>
      <div className="Jeopardy-box flex-box-column" style={{"height": "7em"}}>
        <div style={{"font-size": "2em", "text-shadow": "2px 2px 0px black", "font-weight": "bold"}}>{category.toUpperCase()} ({value})</div>
      </div>
      <div className="Jeopardy-box flex-box-column" style={{"height": "18em", "overflow-y": "auto"}}>
        <div style={{"font-size": "2em", "padding": "0.5em"}}>{showAnswer ? answer : question}</div>
      </div>
    </div>
  )
}


function App() {
  const START = 0;
  const QUESTION = 1;
  const GUESSED = 2;

  const [clue, setClue] = useState({
    question: "...",
    answer: "...",
    category: "...",
    value: "",
    showAnswer: false
  })
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Welcome to Jeopardy!');
  const [points, setPoints] = useState(0);
  const [gameState, setGameState] = useState(START);

  const addPoints = (amount) => {
    setPoints(points + amount);
  }

  const nextClue = () => {
    setGuess("");
    setGameState(QUESTION);
    getClue().then((clue) => {
      clue.json().then((response) => {
        const generatedClue = response[0];
        setClue({
          question: generatedClue.question,
          answer: generatedClue.answer,
          category: generatedClue.category.title,
          value: generatedClue.value,
          showAnswer: false
        })
        setMessage(`"${generatedClue.category.title}" for ${generatedClue.value}...`)
      });
    });
  }

  const initializeClue = () => {
    nextClue();
  }

  const handleGuess = () => {
    setGameState(GUESSED);
    if (isAnswerCorrect()) {
      setMessage("Right!")
      addPoints(clue.value)
    } else {
      setMessage("Wrong!")
      addPoints(clue.value * -1);
    }
  }

  const handleCorrectOverride = () => {
    if (!isAnswerCorrect()) {
      setMessage("Incorrectly marked as wrong... points added back to your score!")
      addPoints(2 * clue.value);
      setGuess(clue.answer);
    }
  }

  if (gameState === START) {
    setGameState(QUESTION);
    initializeClue();
  }

  const toggleShowAnswer = () => {
    console.log("showing answer");
    setClue({...clue, showAnswer: !clue.showAnswer})
  }

  const isAnswerCorrect = () => {
    return guess.toLowerCase() === clue.answer.toLowerCase();
  }

  return (
    <div className="App flex-box-column" style={{"background-color": "#00003A", "minHeight": "100%"}}>
      <div className="Jeopardy-title">
        Jeopardy
      </div>
      <div>
        <JeopardyCard value={clue.value} category={clue.category} question={clue.question} answer={clue.answer} showAnswer={clue.showAnswer}/>
      </div>
      <div className='form-group form-inline mt-4'>
        <form onSubmit={e => e.preventDefault()}>
          <input disabled={gameState === GUESSED} className='form-control' value={guess} onChange={(event) => {setGuess(event.target.value)}} type="text" />
          <button disabled={gameState === GUESSED} className='btn btn-primary mr-2' onClick={handleGuess}>Guess</button>
          {
            gameState === GUESSED && !isAnswerCorrect() &&
            <button onClick={handleCorrectOverride} className='btn btn-secondary' >I was right!</button>
          }
        </form>
      </div>
      <div>
        <button className='btn btn-secondary mr-2' type="button" onClick={toggleShowAnswer}>
          {
            !clue.showAnswer ? "Show Answer" : "Show Question"
          }
        </button>
        <button className='btn btn-secondary' type="button" onClick={nextClue}>
          {
            gameState === QUESTION ? "Skip Clue" : "Next Clue"
          }
        </button>
      </div>
      <div>
        <p className='mt-4 h4'>{message}</p>
      </div>
      <div>
        <p className='mt-4 h4'>You have: {points} points</p>
      </div>
    </div>
  );
}

export default App;
