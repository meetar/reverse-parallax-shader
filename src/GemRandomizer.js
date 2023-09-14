import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import { useTexture, Plane } from '@react-three/drei'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Center } from '@react-three/drei'
import * as _ from 'lodash'
import ParallaxMesh from './ParallaxMesh'
import { DiamondMaterial } from './DiamondMaterial'
import CrystalMaterial from './CrystalMaterial'
import DeepMat from './DeepMat'
import SSSMesh from './SSSMesh'
import { Rock } from './Rock'
import { getMaterial } from './getMaterial'
import { models, combomodels } from './models'
import { getModel } from './getModel'
import { getColor, shuffleArray } from './utils';
import { randomColor } from 'randomcolor';
import { randomDepth, randomNormal } from './textureUtils'


export function GemRandomizer({ config, trigger }) {
  console.log('>> GemRandomizer <<');
  // const [material, setMaterial] = useState([getMaterial(config), Math.random()]);
  // const [mode, setMode] = useState(false);
  const [mode, setMode] = useState();
  const [color, setColor] = useState();
  // const [mode, setMode] = useState('deep');
  // TODO figure out why GemRandomizer is rendering 12 times - something to do with useState(getModel)
  const [model, setModel] = useState()
  const [normalMap, setNormalMap] = useState()
  const [depthMap, setDepthMap] = useState()
  // const [normaltrigger, setNormalTrigger] = useState(null)
  // const [model, setModel] = useState(getModel)
  // const [normalMap, setNormalMap] = useState(getNormal)
  // const [depthMap, setDepthMap] = useState(getNormal)
  // const [normaltrigger, setNormalTrigger] = useState(null)

  // let normaltrigger = null;
  // useEffect(() => {
  //   console.log('normaltrigger effect');
  //   async function fetchNormal() {
  //     const res = await getNormal()
  //     console.log('loaded normal map');
  //     setNormalMap(res)
  //   }
  //   fetchNormal()
  // }, [normaltrigger])

  async function getNormal() {
    console.warn('getNormal:');
    const normalurl = randomNormal();
    console.log('normal:', normalurl);
    const map = await new THREE.TextureLoader().loadAsync(normalurl);
    console.log('got map:', map);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes
    console.log('>> returning');
    return map;
  }

  async function getDepth() {
    const url = randomDepth();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // Adjust the scale along U and V axes
    return map;
  }

  function resetAll() {
    setModel(null)
    setNormalMap(null)
    setDepthMap(null)
    setMode(null)
  }

  function getColor() {
    config.color = randomColor()
  }

  function readyAll() {
    console.log(model)
    console.log( normalMap);
    console.log( depthMap);
    console.log( mode);
    console.log('Ready all?', (model && normalMap && depthMap && mode) ? true : false);
    console.log(normalMap);
    return  (model && normalMap && depthMap && mode) ? true : false;
  }

  async function randomizeAll() {
    console.log('RANDOMZIE ZLL');
    try {

    // resetAll()
    // setModel(getModel)
    let model = await getModel()
    let normal = await getNormal()
    let depth = await getDepth()
    setModel(model)
    setNormalMap(normal)
    setDepthMap(depth)

    // setNormalMap(getNormal)

    // normaltrigger = Math.random();
    // setNormalTrigger(Math.random())

    let mode = _.sample(['gem', 'crystal', 'deep', 'sss'])
    // console.log('normalMap2?', normalMap);
      setMode(mode)
      if (model) setColor(getColor)
      // setReady(true)
      // debugger
      console.log('  >> DONE <<');
    } catch(e) {
      console.error('nope', e);
    }
  }

  // watch for triggers from app
  useEffect(() => {
    console.log('>> useeffect trigger', trigger)
    // console.log('mode:', mode);
    if (trigger) {
      trigger = trigger[0];
      if (trigger == 'shape') {
        const n = async function () {
          const model = await getModel();
          setModel(model)
        }()
      }
      else if (trigger == 'depth') {
        // console.log('trigger: depth');
        // setDepthMap(getDepth)
        const n = async function () {
          const depth = await getDepth();
          setDepthMap(depth)
        }()
      }
      else if (trigger == 'normal') {
        console.log('trigger: normal');
        const n = async function () {
          const normal = await getNormal();
          setNormalMap(normal)
        }()
        // normaltrigger = Math.random();
        // setNormalTrigger(Math.random())

      }
      else if (trigger == 'randomize') {
        // console.log('trigger: normal');
        randomizeAll()
      }
      else {
        setMode(trigger)
      }
      trigger = null;
    } else {
      console.log('no trigger, initializing with new randomize');
      randomizeAll()
    }
  }, [trigger])

  // useEffect(() => {
  //   console.log('>> useeffect config');
  //   if (material && material[0]) {
  //     console.log('updating material');
      
  //     Object.assign(material[0], config)
  //     material[0].needsUpdate = true;
  //   }

  // }, [config])

  // useEffect(() => {
  //   console.log('>> useeffect material');
  //   if (trigger && trigger[0] == 'material') return // don't re-set the material if the materialtrigger has just been tripped
  //   if (material && material[0]) {
  //     material[0].needsUpdate = true;
  //     setMaterial(material[0])
  //   }
  // }, [material])

  console.log('gem mode', mode);
  if (!model) {
    return null;
  }


// return ( ready &&
return ( mode &&
    <>
      {/* <Center top position={[0, 0, 0]}> */}



          { mode == 'parallax' ? (
            <ParallaxMesh geometry={model} config={config} castShadow />
          ) : mode == 'gem' ? (
            <DiamondMaterial config={config} normalMap={normalMap} geometry={model} castShadow />
          ) : mode == 'crystal' ? (
            <mesh geometry={model} castShadow >
              <CrystalMaterial normalMap={normalMap} geometry={model} config={config} />
            </mesh>
          ) : mode == 'sss' ? (
          // <mesh geometry={model} castShadow >
            <SSSMesh geometry={model} normalMap={normalMap} depthMap={depthMap} config={config} castShadow />
          // </mesh>
          ) : mode == 'deep' ? (
            <DeepMat geometry={model} normalMap={normalMap} depthMap={depthMap} config={config} castShadow />
          ) : mode == 'material' ? (
            <mesh geometry={model} material={material[0]} castShadow />
          ) : (
            <mesh geometry={model} castShadow>
              <meshStandardMaterial {...config} />
            </mesh>
          )}

      {/* </Center> */}
      <directionalLight position={[0, .5, 0]} intensity={1} penumbra={1} distance={2} color={config.color} />
    </>
  )
}
