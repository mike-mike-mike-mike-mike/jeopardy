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
    showAnswer
  } = props;

  return (
    <div>
      <div className="Jeopardy-box flex-box-column" style={{"height": "5em"}}>
        <div style={{"font-size": "2em", "text-shadow": "2px 2px 0px black", "font-weight": "bold"}}>{category.toUpperCase()}</div>
      </div>
      <div className="Jeopardy-box flex-box-column" style={{"height": "15em"}}>
        <div style={{"font-size": "2em", "padding": "0.5em"}}>{showAnswer ? answer : question}</div>
      </div>
    </div>
  )
}


function App() {
  const [clue, setClue] = useState({
    question: "...",
    answer: "...",
    category: "...",
    showAnswer: false
  })
  const [guess, setGuess] = useState('');


  const nextClue = () => {
    getClue().then((clue) => {
      clue.json().then((response) => {
        const generatedClue = response[0];
        setClue({
          question: generatedClue.question,
          answer: generatedClue.answer,
          category: generatedClue.category.title,
          showAnswer: false
        })
      });
    });
  }

  const initializeClue = () => {
    getClue().then((clue) => {
      return clue.json()
    }).then((response) => {
        const generatedClue = response[0];
        setClue({
          question: generatedClue.question,
          answer: generatedClue.answer,
          category: generatedClue.category.title,
          showAnswer: false
        })
    });
  }

  const handleGuess = () => {
    console.log(guess)
    if (guess.toLowerCase() === clue.answer.toLowerCase()) {
      alert('correct');
    } else {
      alert('wrong');
    }
  }

  if (clue.question === '...') {
    initializeClue();
  }

  const showAnswer = () => {
    setClue({...clue, showAnswer: true})
  }

  return (
    <div className="App flex-box-column" style={{"background-color": "#00003A", "minHeight": "100%"}}>
      <div className="Jeopardy-title">
        Jeopardy
      </div>
      <div>
        <JeopardyCard category={clue.category} question={clue.question} answer={clue.answer} showAnswer={clue.showAnswer}/>
      </div>
      <div className='form-group form-inline mt-4'>
        <form>
          <input className='form-control' value={guess} onChange={(event) => {setGuess(event.target.value)}} type="text" />
          <button className='btn btn-primary' onClick={handleGuess}>Guess</button>
        </form>
      </div>
      <div>
        <button onClick={showAnswer}>Show Answer</button>
        <button onClick={nextClue}>Get Clue</button>
      </div>
    </div>
  );
}

export default App;
