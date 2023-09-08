import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { Leva, useControls, button } from 'leva'
import { diamondcontrols } from './diamondcontrols'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { PerformanceMonitor } from '@react-three/drei';

export function DiamondMaterial({config, geometry, texture, ...props}) {
  // console.log('Diamond Mat, color:', config.color);
  // const { ...diamondconfig } = useControls(diamondcontrols)
  // const [{ ...diamondconfig }, setDiamondControls] = useControls('Diamond', () => (diamondcontrols))
  
  const [test, setTest] = useState(null)
  
  
  // TODO: determine how to both tweak the controls and pass in color from outside
  const [{ ...diamondconfig }, setDiamondControls] = useControls('Diamond', () => (diamondcontrols))
  const [dconfig, setDConfig] = useState(diamondconfig)


  useEffect(() => {
    // console.log('diamondconfig changed');
    // if (material && material[0]) {
    //   console.log('updating material');
      
    //   Object.assign(material[0], config)
    //   material[0].needsUpdate = true;
    // }
    setDConfig(diamondconfig)
    // setDiamondControls({...diamondconfig})

  }, [diamondconfig])


  // const { ...diamondconfig } = dconfig;


  // const { ...dconfig } = useState(useControls('Diamond', diamondcontrols))


  // TODO later
  // useEffect(() => {
  //     console.log('performance test', test);
  //     if (!test) return;
  //     let bounces = Math.ceil(5 - 60/test.fps);
  //     console.log('bounces:', bounces);
  //     diamondconfig.bounces = bounces;
  //     setConfig(useControls(diamondcontrols))
  //     console.log('now:', config.bounces);
  // }, [test])


  texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  texture.mapping = EquirectangularReflectionMapping; 

  // console.log('diamond mat, #faces:', geometry.attributes.normal.array.length / 3 / 3);

  geometry = BufferGeometryUtils.mergeVertices(geometry, 0); // this forces vertex indexing which fixes the 'BufferGeometry is already non-indexed' warning
  // console.log('bounces:', config.bounces);

  return (
    <>
     <PerformanceMonitor bounds={(fps) => [40, 60]} onIncline={(fps) => setTest(fps)} onDecline={(fps) => setTest(fps)} ></PerformanceMonitor>
      <group scale={0.999}>

      <mesh geometry={geometry} {...config} {...dconfig} castShadow>
        {/* don't set transparent to true here! I will crash */}
        <MeshRefractionMaterial  {...dconfig} {...config} envMap={texture} 
        ior={dconfig.iorInner}
        visible={dconfig.GemVisible}
         />
      </mesh>

      </group>

      <mesh geometry={geometry} visible={true}>
        <MeshTransmissionMaterial  {...dconfig} {...config}  transparent={true}
          envMap={texture}
          ior={dconfig.iorOuter}
          visible={dconfig.InnerVisible}
        />
      </mesh>

    </>
  )
}
