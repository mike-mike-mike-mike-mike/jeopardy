const files = {
  'right': '/jeopardy/assets/jeopardy-right.mp3',
  'wrong': '/jeopardy/assets/jeopardy-wrong.mp3',
  'board-fill': '/jeopardy/assets/jeopardy-board-fill.mp3',
  'outro': '/jeopardy/assets/jeopardy-outro.mp3',
}

function simplifyText(text) {
  text = text.replace(/&/g, 'and');
  return text;
}

export default function SoundBoard(speechSynthesisModule) {
  let soundBoard = {};
  let audios = {};

  Object.keys(files).forEach(soundName => {
    audios[soundName] = new Audio(files[soundName]);
  });

  soundBoard.playSound = (soundName) => {
    audios[soundName].currentTime = 0;
    audios[soundName].play();
  }

  soundBoard.playSpeech = (text) => {
    console.log(text);
    console.log(simplifyText(text));
    fetch(`https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9?optimize_streaming_latency=3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'xi-api-key': '55b5a150bed2630a646cad5d016eb841',
      },
      body: JSON.stringify({ 
        text: simplifyText(text),
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    })
    .then(res => res.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
    }).catch(err => console.log(err));
  }

  return soundBoard;
}
