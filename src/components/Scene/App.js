// src/components/App.js
import React, { useState, useEffect } from 'react';
import Scene from './Scene';
import Character from './Character';
import FooterDialogue from './FooterDialogue';
import rainSound from '../assets/audio/rain_sound.wav';
import genieImage from '../assets/images/genie.png';
import scene1 from '../assets/images/scene1.jpg';
import scene2 from '../assets/images/scene2.jpg';
import scene3 from '../assets/images/scene3.jpg';

const scenes = [
    { image: scene1, dialogue: 'This is the initial dialogue text.' },
    { image: scene2, dialogue: 'You walk home through the rain...' },
    { image: scene3, dialogue: 'You come across a pitfall...' },
];

const App = () => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isCharacterVisible, setCharacterVisible] = useState(false);
    const [dialogue, setDialogue] = useState(scenes[0].dialogue);

    const nextScene = () => {
        setCharacterVisible(false);
        setCurrentSceneIndex((prevIndex) => (prevIndex + 1) % scenes.length);
    };

    useEffect(() => {
        setDialogue(scenes[currentSceneIndex].dialogue);
        if (currentSceneIndex === 1) {
            const audio = new Audio(rainSound);
            audio.play();
        }
        setCharacterVisible(true);
    }, [currentSceneIndex]);

    return (
        <div className="app">
            <Scene image={scenes[currentSceneIndex].image} isVisible={true} onClick={nextScene} />
            <Character isVisible={isCharacterVisible} characterImage={genieImage} />
            <FooterDialogue text={dialogue} />
        </div>
    );
};

export default App;
