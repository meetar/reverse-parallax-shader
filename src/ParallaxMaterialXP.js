import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const ParallaxMaterialXP = ({texture, config}) => {
  const vertexShader = useLoader(THREE.FileLoader, './vertexShader.vert');
  const fragmentShader = useLoader(THREE.FileLoader, './parallaxXP.frag');

// const fragmentShader = `

// `

  const uniforms = {
      _texture: { value: texture },
      _steps: {value: config._steps},
      _height: {value: config._height},
      _scale: {value: config._scale},
      _opacity: {value: config.opacity},
    };

    const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} depthWrite={false} side={THREE.FrontSide} depthTest={true} alphaTest={0} transparent={true} />
  )
}

export default ParallaxMaterialXP