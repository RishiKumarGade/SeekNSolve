// src/components/Character.js
import React from 'react';

const Character = ({ isVisible, characterImage }) => {
    return (
        <div className={`character ${isVisible ? 'visible' : ''}`}>
            <img src={characterImage} alt="Character" />
        </div>
    );
};

export default Character;
