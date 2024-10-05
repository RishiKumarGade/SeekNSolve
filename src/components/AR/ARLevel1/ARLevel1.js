import { Canvas, useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { Html, Plane, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// Chair component to represent a seat in the puzzle
function Chair({ position, id, onSeatGuest }) {
  return (
    <mesh position={position} onClick={() => onSeatGuest(id)}>
      <boxGeometry args={[1, 1, 1]} /> {/* Box geometry for the chair */}
      <meshStandardMaterial color="#FF5841" /> {/* Brown color for the chair */}
    </mesh>
  );
}

// Guest component represents a draggable guest (A, B, C, D) with interaction
function Guest({ name, position, onDragStart, onDrop, isSelected }) {
  const [hovered, setHovered] = useState(false); // Hover state for scaling effect

  return (
    <mesh
      position={position}
      scale={hovered || isSelected ? 1.2 : 1} // Scales up on hover or if selected
      onPointerOver={() => setHovered(true)} // Mouse hover effect
      onPointerOut={() => setHovered(false)} // Mouse out effect
      onPointerDown={onDragStart} // Initiates drag on pointer down
      onPointerUp={onDrop} // Drops the guest on pointer up
    >
      <sphereGeometry args={[0.5, 32, 32]} /> {/* Guest represented as a sphere */}
      <meshStandardMaterial 
        color={isSelected ? '#FFD700' : '#4A8BDF'} // Gold for selected guest, tomato for others
        emissive={isSelected ? '#FFD700' : '#000000'} // Glow effect when selected
      />
      <Html>{name}</Html> {/* Displays guest's name above the sphere */}
    </mesh>
  );
}

// Array of clues for the puzzle
const clues = [
  "Person A must sit next to Person B.",
  "Person C cannot sit next to Person D.",
  "The treasure is hidden ",
];

// SeatingPuzzle component manages seating arrangement and guest interactions
function SeatingPuzzle({ onToggleClues, onReset, showClues, treasureFound, onLevelComplete }) {
  const [seating, setSeating] = useState({
    A: null, B: null, C: null, D: null, // Keeps track of seating positions for each guest
  });

  const [guestPositions, setGuestPositions] = useState({
    A: [-4, 0.6, 0], B: [-4, 0.6, 2], C: [-4, 0.6, 4], D: [-4, 0.6, 6], // Initial positions of the guests
  });

  const [draggingGuest, setDraggingGuest] = useState(null); // Keeps track of the guest being dragged
  const orbitControlsRef = useRef(); // Reference for controlling the orbit controls

  const chairs = [
    { id: 1, position: [-2, 0, 0] },
    { id: 2, position: [0, 0, 0] },
    { id: 3, position: [2, 0, 0] },
    { id: 4, position: [4, 0, 0] },
  ]; // Chair positions for guests

  const onDragStart = (guest) => {
    setDraggingGuest(guest); // Sets the guest being dragged
    orbitControlsRef.current.enabled = false; // Disables orbit controls during drag
  };

  const onDrop = (chairId) => {
    if (draggingGuest && !Object.values(seating).includes(chairId)) {
      setSeating((prev) => ({
        ...prev,
        [draggingGuest]: chairId, // Assigns chair to the dragged guest
      }));
      setGuestPositions((prev) => ({
        ...prev,
        [draggingGuest]: getChairPosition(chairId), // Updates guest's position to match the chair
      }));
      setDraggingGuest(null); // Reset dragging state
      orbitControlsRef.current.enabled = true; // Re-enables orbit controls
    }
  };

  const getChairPosition = (chairId) => {
    // Helper function to return the position of a given chair ID
    switch (chairId) {
      case 1:
        return [-2, 0.6, 0];
      case 2:
        return [0, 0.6, 0];
      case 3:
        return [2, 0.6, 0];
      case 4:
        return [4, 0.6, 0];
      default:
        return [-4, 0.6, 0];
    }
  };

  // Function to check the solution based on the puzzle clues
  const checkSolution = () => {
    const { A, B, C, D } = seating;

    if (A === null || B === null || C === null || D === null) return false; // Ensure all guests are seated

    const isABAdjacent = Math.abs(A - B) === 1; // Check if A and B are adjacent
    const isCDApart = Math.abs(C - D) > 1; // Check if C and D are not adjacent

    const isTreasureUnderB = B === 2 || B === 3; // Treasure is hidden under B (chair 2 or 3)

    return isABAdjacent && isCDApart && isTreasureUnderB;
  };

  const isLevelCompleted = checkSolution() && !treasureFound; // Determines if the level is completed

  if (isLevelCompleted) {
    onLevelComplete(); // Calls function to handle level completion
  }

  return (
    <>
      <ambientLight intensity={0.5} /> {/* Ambient lighting */}
      <pointLight position={[10, 10, 10]} /> {/* Point light source */}

      {/* Ground Plane */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#E9F1FA" /> {/* Ground color */}
      </Plane>

      {/* Render chairs */}
      {chairs.map((chair) => (
        <Chair key={chair.id} position={chair.position} id={chair.id} onSeatGuest={onDrop} />
      ))}

      {/* Render guests */}
      {['A', 'B', 'C', 'D'].map((guest) => (
        <Guest
          key={guest}
          name={guest}
          position={guestPositions[guest]}
          onDragStart={() => onDragStart(guest)} // Start dragging the guest
          onDrop={() => onDrop(seating[guest])} // Drop the guest on a chair
          isSelected={guest === draggingGuest} // Highlight selected guest
        />
      ))}

      {/* Orbit controls to enable 3D scene navigation */}
      <OrbitControls ref={orbitControlsRef} target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.5} />
    </>
  );
}

// Main GameLevel component manages the game state and user interface
export default function GameLevel() {
  const [showClues, setShowClues] = useState(true); // Toggle clues visibility
  const [treasureFound, setTreasureFound] = useState(false); // Tracks if treasure is found
  const [levelCompleted, setLevelCompleted] = useState(false); // Tracks level completion

  const toggleClues = (found) => {
    setShowClues((prev) => found || !prev); // Toggles clues visibility
    if (found) setTreasureFound(true); // Sets treasureFound if treasure is found
  };

  const resetGame = () => {
    setTreasureFound(false); // Resets treasure found state
    setShowClues(false); // Hides clues
    setLevelCompleted(false); // Resets level completion
  };
  
  const nextLevel = () => {
    console.log('Loading next level...');
    // Logic to load next level (e.g., route to next scene or change state)
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#F0F8FF', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <SeatingPuzzle
          onToggleClues={toggleClues}
          onReset={resetGame}
          showClues={showClues}
          treasureFound={treasureFound}
          onLevelComplete={() => setLevelCompleted(true)} // Set level completed when conditions met
        />
      </Canvas>

      {/* Level Completion Message and Next Level Button */}
      {levelCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 128, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            zIndex: 1,
            animation: 'fade-in 1s ease-in-out',
          }}
        >
          <p>You've found the treasure </p>
          <button
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
              zIndex:999
            }}
            onClick={nextLevel} // Triggers next level
          >
            Next Level
          </button>
        </div>
      )}
      
      {/* Toggle Clues Button */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          backgroundColor: '#6495ED',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          zIndex: 1,
        }}
        onClick={() => toggleClues(false)} // Toggle clues visibility
      >
        {showClues ? 'Hide Clues' : 'Show Clues'}
      </button>

      {/* Reset Game Button */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '10px',
          backgroundColor: '#FF6347',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          zIndex: 1,
        }}
        onClick={resetGame} // Reset game state
      >
        Reset Game
      </button>

      {/* Display clues if enabled */}
      {showClues && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            zIndex: 1,
          }}
        >
          <h3>Question : </h3>
          <ul>
            {clues.map((clue, index) => (
              <li key={index}>{clue}</li> // List each clue
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
