// src/components/Scene.js
import React from 'react';

const Scene = ({ image, isVisible, onClick }) => {
    return (
        <div 
            className={`scene ${isVisible ? 'visible' : ''}`} 
            style={{ backgroundImage: `url(${image})` }} 
            onClick={onClick}
        >
            {/* Scene content can go here */}
        </div>
    );
};

export default Scene;
