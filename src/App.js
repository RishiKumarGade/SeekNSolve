


import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ARLevel1 from './components/AR/ARLevel1/ARLevel1';
import Test from './components/Test';
import GamificationApp from './components/Ani/GamificationApp';


function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/game/AR/level1" element={<ARLevel1 />}/>
        <Route path="/test" element={<Test />}/>
      </Routes>
    </BrowserRouter>
    <GamificationApp/>
    </>
  );
}

export default App;
