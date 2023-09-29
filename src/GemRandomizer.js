
import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import { EquirectangularReflectionMapping } from 'three';
import * as _ from 'lodash'
import DeepMat from './mats/DeepMat'
import { getModel } from './getModel'
import { randomBetween } from './utils';
import { randomColor } from 'randomcolor';
import { randomDepth, randomNormal, randomEnv } from './textureUtils'

// flip a coin with a n * 100 percent chance of success
export function roll(chance = .5) {
  return Math.random() < chance;
}

export function GemRandomizer({ gpuTier, config, trigger, gemDone }) {
  const [mode, setMode] = useState('gem');
  const [statecolor, setColor] = useState('#000000');
  const [model, setModel] = useState()
  const [normalMap, setNormalMap] = useState()
  const [depthMap, setDepthMap] = useState()
  const [envMap, setEnvMap] = useState(useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr'))
  // this sends a trigger to update and reload a material
  const [mattrigger, setMattrigger] = useState()

  // leva color control - this setup both sets state and reflects state even if set by setColor elsewhere
  const [{uicolor}, setUIColor] = useControls(() => ({
    color: {
      value: statecolor,
      label: 'Color',
      onChange: async (v) => {
        setColor(v)
      }
    },
  }));
  // console.log('gem mode', mode);
  useEffect(() => {
    setUIColor({color: statecolor});
  }, [statecolor])

  async function newMode() {
    let mode = await getMode();
    // console.log('mode?', mode);
    setMode(mode)
  }

  async function getNormal() {
    const url = randomNormal();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    const scale = randomBetween(1, 10)
    map.repeat.set(scale, scale); // adjust the scale along U and V axes
    return map;
  }

  async function getDepth() {
    const url = randomDepth();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // adjust the scale along U and V axes (this is further adjusted in the shader)
    return map;
  }

  function getEnv() {
    // too many async errors, giving up
    // const url = randomEnv();
    // const map = await useLoader(RGBELoader, url)
    const map = useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr')

    map.mapping = EquirectangularReflectionMapping;

    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // adjust the scale along U and V axes
    return map;
  }

  async function getColor() {
    return randomColor()
  }

  async function getMode() {
    if (gpuTier.tier == 0) {
      return 'basic'
    }
    if (gpuTier.tier == 1) {
      return _.sample(['crystal', 'deep', 'deep'])
    }
    return _.sample(['gem', 'crystal', 'deep', 'deep'])
  }

  async function randomizeAll(mode = null, oldmodel = null) {
    // use Promise.all so we don't set any state before we have all the info at once –
    // this prevents the model from being drawn multiple times with incomplete data every time one of the state values updates
    let model, normal, depth;
    const newcolor = randomColor();
    [model, normal, depth, mode] = await Promise.all([getModel(), getNormal(), getDepth(), getMode()]);
    setModel(model)
    // console.log('mode:', mode);
    setNormalMap(normal)
    setDepthMap(depth)
    // setEnvMap(env) // not worth the trouble
    setMode(mode)
    setColor(newcolor)
    // trigger material to reload if there's already a mode set
    setMattrigger(Math.random())
    gemDone()
  }

    // watch for triggers from app
  useEffect(() => {
    if (trigger) {
      trigger = trigger[0];
      if (trigger == 'shape') {
        (async function () {
          const model = await getModel();
          setModel(model)
        })()
      }
      else if (trigger == 'depth') {
        (async function () {
          const depth = await getDepth();
          setDepthMap(depth)
        })()
      }
      else if (trigger == 'normal') {
        (async function () {
          const normal = await getNormal();
          setNormalMap(normal)
        })()
      }
      // else if (trigger == 'env') {
      //   (function () {
      //     const env = getEnv();
      //     // const env = await getEnv();
      //     // giving up on dynamic hdr imports for now - unstable and heisenbuggy
      //     // might have something to do with the requirement for PMREMGenerator ¯\_(ツ)_/¯
      //     // const env = useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr')
      //     setEnvMap(env)
      //   })()
      // }
      else if (trigger == 'color') {
        // debugger
        try {

        (async function () {
          const color = await getColor();
          setColor(color)
          })()
        } catch (e) {
          console.log(e);
        }

      }
      else if (trigger == 'randomize') {
        randomizeAll()
      }
      else {
        // this randomizes everything except the mode, passed as the trigger // unused
        randomizeAll(trigger, model)
      }
    } else {
      // console.log('no trigger, initializing with new randomize'); // unused
      // randomizeAll(mode)
    }
  }, [trigger])

  if (!model) {
    // the async functions haven't returned yet, don't render anything
    return null;
  }

return ( mode &&
    <>

      <directionalLight position={[0, .5, 0]} intensity={1} penumbra={1} distance={2} color={'white'} />
      <DeepMat trigger={mattrigger} geometry={model} color={statecolor} normalMap={normalMap} depthMap={depthMap} envMap={envMap} config={config} castShadow />

    </>
  )
}
