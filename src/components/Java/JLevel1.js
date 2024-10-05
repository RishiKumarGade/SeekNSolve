import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';

function GameLevel() {
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [selectedStrings, setSelectedStrings] = useState([]);

  const functions = {
    toUpperCase: (str1) => str1.toUpperCase(),
    toLowerCase: (str1) => str1.toLowerCase(),
    charAt: (str1) => str1.charAt(0),
    substring: (str1) => str1.substring(0, 5),
    concat: (str1, str2) => str1 + str2,
  };

  const applyFunction = () => {
    if (selectedBox && selectedFunction && selectedStrings.length === 2) {
      const boxString = selectedBox.string.toUpperCase();
      const manipulatedString = functions[selectedFunction](selectedStrings[0].toUpperCase(), selectedStrings[1]?.toUpperCase());
      console.log(manipulatedString, boxString);
      if (manipulatedString === boxString) {
        console.log('Correct! Box opens');
        selectedBox.open = true; // Mark box as open
      } else {
        console.log('Incorrect string transformation!');
      }
    }
  };

  const handleStringSelection = (str) => {
    if (selectedStrings.includes(str)) {
      setSelectedStrings(selectedStrings.filter((s) => s !== str));
    } else if (selectedStrings.length < 2) {
      setSelectedStrings([...selectedStrings, str]);
    }
  };

  return (
    <Suspense fallback={<Fallback />}>
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        {/* Physics World */}
        <Physics>
          {/* Ground */}
          <RigidBody type="fixed">
            <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          </RigidBody>

          {/* String Manipulation Functions on the left */}
          <StringManipulationObjects selectedFunction={selectedFunction} setSelectedFunction={setSelectedFunction} />

          {/* Treasure Boxes */}
          <TreasureBoxes selectedBox={selectedBox} setSelectedBox={setSelectedBox} />

          {/* Strings on the right */}
          <SelectableStrings selectedStrings={selectedStrings} handleStringSelection={handleStringSelection} />
        </Physics>

        {/* Apply button */}
        <ApplyButton applyFunction={applyFunction} />

        {/* Controls for camera movement */}
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
}

// Fallback UI during loading
function Fallback() {
  return <div>Loading 3D Scene...</div>;
}

// String Manipulation Functions as objects
function StringManipulationObjects({ selectedFunction, setSelectedFunction }) {
  const functions = [
    { name: 'toUpperCase', position: [-10, 0.5, -3] },
    { name: 'toLowerCase', position: [-10, 0.5, 0] },
    { name: 'charAt', position: [-10, 0.5, 3] },
    { name: 'substring', position: [-10, 0.5, 6] },
    { name: 'concat', position: [-10, 0.5, 9] }
  ];

  return (
    <>
      {functions.map((func, index) => (
        <InteractiveObject
          key={index}
          position={func.position}
          color={selectedFunction === func.name ? 'green' : 'blue'}
          onHover={() => setSelectedFunction(func.name)}
          onClick={() => setSelectedFunction(func.name)} // Set the function on click
          label={func.name}
        />
      ))}
    </>
  );
}

// Treasure Boxes with unique strings
function TreasureBoxes({ selectedBox, setSelectedBox }) {
  const boxes = [
    { string: 'HELLOWORLD', position: [0, 0.5, -5], open: false },
    { string: 'GOODMORNING', position: [5, 0.5, -5], open: false },
    { string: 'FOOBAZ', position: [-5, 0.5, -5], open: false },
    { string: 'FRONTENDREACT', position: [0, 0.5, -10], open: false },
    { string: 'JAVASCRIPTROCKS', position: [5, 0.5, -10], open: false },
    { string: 'HELLOTHREEJS', position: [-5, 0.5, -10], open: false }
  ];

  return (
    <>
      {boxes.map((box, index) => (
        <TreasureBox
          key={index}
          box={box}
          selectedBox={selectedBox}
          setSelectedBox={setSelectedBox}
        />
      ))}
    </>
  );
}

// Treasure Box Component with animation
function TreasureBox({ box, selectedBox, setSelectedBox }) {
  const meshRef = useRef();
  const isOpen = box.open;

  useEffect(() => {
    if (isOpen) {
      // Scale up the box when opened
      meshRef.current.scale.set(1.5, 1.5, 1.5);
      const timer = setTimeout(() => {
        // Scale back to normal after 0.5 seconds
        meshRef.current.scale.set(1, 1, 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <InteractiveObject
      ref={meshRef}
      position={box.position}
      color={selectedBox === box ? (isOpen ? 'green' : 'red') : 'gold'}
      onHover={() => setSelectedBox(box)}
      onClick={() => {
        if (!box.open) {
          box.open = true; // Mark box as open
          setSelectedBox(box); // Optionally set the selected box to the opened box
        }
      }}
      label={isOpen ? 'SUCCESS' : box.string}
    />
  );
}

// Selectable strings on the right, arranged vertically
function SelectableStrings({ selectedStrings, handleStringSelection }) {
  const strings = [
    { value: 'Hello', position: [10, 0.5, -3] },
    { value: 'World', position: [10, 0.5, 0] },
    { value: 'Good', position: [10, 0.5, 3] },
    { value: 'Morning', position: [10, 0.5, 6] },
    { value: 'Foo', position: [10, 0.5, 9] },
    { value: 'Baz', position: [10, 0.5, 12] },
    { value: 'Frontend', position: [10, 0.5, 15] },
    { value: 'React', position: [10, 0.5, 18] }
  ];

  return (
    <>
      {strings.map((str, index) => (
        <InteractiveObject
          key={index}
          position={str.position}
          color={selectedStrings.includes(str.value) ? 'green' : 'purple'}
          onHover={() => handleStringSelection(str.value)}
          onClick={() => handleStringSelection(str.value)}
          label={str.value}
        />
      ))}
    </>
  );
}

// Interactive object component with hover and selection effects
function InteractiveObject({ position, color, onHover, label, onClick, ref }) {
  const [hovered, setHovered] = useState(false);

  return (
    <RigidBody
      ref={ref}
      onPointerOver={() => {
        setHovered(true);
        onHover();
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(); // Reset hover to avoid function being set to null
      }}
      onClick={onClick}
    >
      <mesh position={position} scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'lightblue' : color} />
        <Text
          position={[0, 1.1, 0]} // Adjusted position of text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </mesh>
    </RigidBody>
  );
}

// Apply button component
function ApplyButton({ applyFunction }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={[0, 3, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={applyFunction}
    >
      <boxGeometry args={[2, 0.5, 0.5]} />
      <meshStandardMaterial color={hovered ? 'orange' : 'blue'} />
      <Text position={[0, 0.3, 0]} fontSize={0.2} color="white">
        Apply
      </Text>
    </mesh>
  );
}

export default GameLevel;
