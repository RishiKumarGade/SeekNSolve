import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';

const LockControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [isLocked, setIsLocked] = useState(false);

  const togglePointerLock = () => {
    if (isLocked) {
      controlsRef.current.unlock();
    } else {
      controlsRef.current.lock();
    }
    setIsLocked(!isLocked);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'F1') {
        event.preventDefault(); // Prevent the default F1 behavior
        togglePointerLock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked]);

  useEffect(() => {
    const handlePointerLockChange = () => {
      const element = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
      if (!element && isLocked) {
        setIsLocked(false);  // Ensure state is synchronized if pointer lock is exited externally
      }
    };

    const handleClick = (event) => {
      event.preventDefault(); // Prevent any click from initiating pointer lock
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mozpointerlockchange', handlePointerLockChange);
    document.addEventListener('webkitpointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mozpointerlockchange', handlePointerLockChange);
      document.removeEventListener('webkitpointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [gl.domElement, isLocked]);

  return <PointerLockControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

export default LockControls