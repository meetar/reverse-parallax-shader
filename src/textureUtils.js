import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three';


export const randomNormal = () => {
  console.log('randomNormal');
  let maps = [
  '6056-normal.jpg',
  '1160-normal.jpg',
  'ice-normal.jpeg',
  'normal-moon.png',
  '14009-normal.jpg',
  'normals2.jpeg',
  ];
  let map = _.sample(maps);
  console.log('fetching', './textures/'+map);
  return './textures/'+map;
}

export const randomDepth = () => {
  console.log('randomDepth');
  let maps = [
'streaks4.png',
'cracks3.png',
'cracks2.png',
'cracks.png',
'speckles.png',
'speck.png',
'streaks3.png',
'streaks.png',
'streak.png',
];
  let map = _.sample(maps);
  console.log('fetching', './textures/'+map);
  return './textures/'+map;
}
