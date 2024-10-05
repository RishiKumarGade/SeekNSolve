import React, { useState, useEffect } from 'react';
import './GenieStudentScene.css'; // Import the custom CSS file for styling
import Genie from "./genie.png"
import Student from "./student.png"
import scene1 from "./scene1.png"
import scene2 from "./scene2.png"
import scene3 from "./scene3.png"
import scene4 from "./scene4.png"
import scene5 from "./scene5.png"


const scenes = [
  {
    id: 1,
    background: scene1,
    dialogue: ["No matter how hard I try, I just can't get it. Nothing makes sense anymore..."],
    character: 'student'
  },
  {
    id: 2,
    background: scene2,
    dialogue: ["Maybe I'm just not cut out for this. No matter how much I study, it feels like I'm going in circles..."],
    character: 'student'
  },
  {
    id: 3,
    background: scene3,
    dialogue: ["W-Where am I? What just happened?"],
    character: 'student'
  },
  {
    id: 4,
    background: scene4,
    dialogue: [
      "GENIE: Welcome, young traveler! You've fallen into the Cave of Knowledge. But worry not, for I am here to guide you.",
      "STUDENT: A genie...? What is this place?",
      "GENIE: Indeed! I am a genie, but not the kind that grants wishes for riches or fame. I grant something far more valuable—knowledge."
    ],
    character: 'both'
  },
  {
    id: 5,
    background: scene4,
    dialogue: [
      "GENIE: You are at a crossroads in your journey. There are three paths before you, each representing a different challenge in your quest for mastery.",
      "STUDENT: Which path should I take?",
      "GENIE: The first path is Aptitude and Reasoning. Follow this road, and you will learn to think logically, solve puzzles, and master the art of reasoning.",
      "GENIE: The second path is Java. Here, you will learn how to program and build your skills to unlock the power of code.",
      "GENIE: The third path is DBMS and SQL. Here, you will delve into the world of databases, learning how to manage and query data to uncover its hidden secrets."
    ],
    character: 'both'
  },
  {
    id: 6,
    background: scene5,
    dialogue: [
      "GENIE: But beware, young one. Each path is filled with challenges. However, I will guide you along the way.",
      "GENIE: So, what will it be? Will you master Aptitude and Reasoning, conquer Java, or unlock the secrets of DBMS and SQL first? The choice is yours."
    ],
    character: 'genie'
  }
];

const GenieStudentScene = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState(''); // Current dialogue being typed
  const [dialogueIndex, setDialogueIndex] = useState(0); // Track the dialogue index for each scene
  const [isTyping, setIsTyping] = useState(false); // To track if the text is still typing
  const [showButtons, setShowButtons] = useState(false); // Control visibility of buttons after the last scene

  useEffect(() => {
    if (!isTyping) {
      startTypingEffect();
    }
  }, [dialogueIndex, currentScene]);

  const startTypingEffect = () => {
    const dialogues = scenes[currentScene].dialogue;
    const fullText = dialogues[dialogueIndex]; // Get the current dialogue line
    let index = 0;
    setCurrentDialogue('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setCurrentDialogue((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if ( currentScene === scenes.length - 1) {
            if(document.getElementById("geni"))
            document.getElementById("geni").hidden = true;
            if(document.getElementById("gen"))
            document.getElementById("gen").hidden = true;

          setShowButtons(true); // Show buttons when the last dialogue of the last scene is complete
        }
      }
    }, 50); // Adjust the typing speed here
  };

  const handleNextDialogue = () => {
    if (!isTyping && dialogueIndex < scenes[currentScene].dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    }
  };

  const handleNextScene = () => {
    if (!isTyping && currentScene < scenes.length - 1) {
      setDialogueIndex(0); // Reset dialogue index for the new scene
      setCurrentScene(currentScene + 1);
    }
  };

  const handlePreviousScene = () => {
    if (currentScene > 0) {
      setDialogueIndex(0); // Reset dialogue index for the previous scene
      setCurrentScene(currentScene - 1);
      setShowButtons(false)
    }
  };

  const { background, character } = scenes[currentScene];

  return (
    <div
      className="scene-container"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="button-container">
        <button onClick={handlePreviousScene} disabled={currentScene === 0}>
          Previous
        </button>
        <button onClick={handleNextScene} disabled={currentScene === scenes.length - 1}>
          Next
        </button>
      </div>

      <div className={`character-container slide-in`}>
        {character == 'genie' && (
          <img src={Genie} alt="Genie" id="geni" className="genie" />
        )}
        {character == 'student' && (
          <img src={Student} alt="Student" className="student" />
        )}
        {character == 'both' && (
            <>
        <img src={Student} alt="Student" className="student" />
        <img src={Genie} alt="Genie" id="gen" className="genie" />
            </>
        )}
      </div>

      <div className="dialogue-container" onClick={handleNextDialogue}>
        <p className="dialogue">{currentDialogue}</p>
      </div>

      {showButtons && (
        <div className="choice-buttons">
          <a href="/game/AR/level1" className="game-link button-49">
            Aptitude & Reasoning
          </a>
          <a href="/J/level1" className="game-link button-49">
            Java
          </a>
          <a href="/dbms-sql" className="game-link button-49">
            DBMS & SQL
          </a>
        </div>
      )}
    </div>
  );
};

export default GenieStudentScene;
