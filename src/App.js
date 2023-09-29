import { getGPUTier } from 'detect-gpu';
import * as _ from 'lodash'
import { Canvas } from '@react-three/fiber'
import React, { useState, useEffect } from 'react'
import Scene from './Scene.js'
import { Leva, useControls, button } from 'leva'
import { Center, Stats } from '@react-three/drei'

export function App() {
  const [gpuTier, setGpuTier] = useState()
  const [randomizeTrigger, setTrigger] = useState()
  const [nightMode, setNightMode] = useState(false)
  const [showLeva, setshowLeva] = useState('hidden')

  useEffect(() => {
    (async () => {
      const gpu = await getGPUTier();
      setGpuTier(gpu)
    })()
  }, [])

  useEffect(() => {
    const handleKeyPress = (event) => {
      let key = event.key; // react won't act on it unless I manipulate it here
      if (key === 'u') {
        // show Leva UI
        setshowLeva(v => v == 'hidden' ? 'visible' : 'hidden')
      }
    };
    window.addEventListener('keydown', handleKeyPress);
  }, []);

  useControls({
    RANDOMIZE_ALL: button( () => {
      lowerCurtain()
    }),
  });

  function gemDone() {
    raiseCurtain()
  }

  // function to start the opacity animation
  const lowerCurtain = () => {
    setTrigger(Math.random())
  };

  const raiseCurtain = () => {
    setTimeout(() => {
      ready();
    }, 1000); // synchronize this timing with the curtain opacity transition timing
  };

  function ready() {
  }


  useEffect(() => {
    const intervalId = setInterval(() => {
      setTrigger(Math.random())
    }, 5000); // Interval set to 1000 milliseconds (1 second)

    setInterval(intervalId)

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that the effect runs once after the initial render


  return (
  <>

  <div id="levaWrapper" style={{visibility: showLeva}} >
    <Leva />
  </div>
  <div className="bottom"  >
    <a href="http://fjord.style">[[ <span className="drop">FS</span> ]]</a>
  </div>

  <div style={{height: '100%', zIndex: 0, }}>

    <Canvas camera={{ position: [5, 3, -10], target: [0, -1, 0], zoom: 5, near: 1, far: 1000 }} >

    <Center>
      {/* put everything into a component inside Canvas, to avoid the R3F Hooks warning - this provides the Canvas context */}
      <Scene {... {gpuTier, gemDone, randomizeTrigger}} />
    </Center>
      {showLeva == 'visible' && <Stats />}
    </Canvas>
    {/* <DebugStage /> */}
  </div>
  </>

)
}
