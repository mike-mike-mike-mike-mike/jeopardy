const files = {
  'intro': '/assets/jeopardy-intro.mp3',
  'right': '/assets/jeopardy-right.mp3',
  'wrong': '/assets/jeopardy-wrong.mp3',
  'board-fill': '/assets/jeopardy-board-fill.mp3',
  'outro': '/assets/jeopardy-outro.mp3',
}

export default function SoundBoard(speechSynthesisModule) {
  const speechSynthesis = speechSynthesisModule;
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
    const voiceOptions = speechSynthesis.getVoices();
    const preferredVoice = voiceOptions.find(voice => voice.name === "Microsoft Clara Online (Natural) - English (Canada)");

    let msg = new SpeechSynthesisUtterance(text);
    msg.voice = preferredVoice;
    window.speechSynthesis.speak(msg);
  }

  return soundBoard;
}
