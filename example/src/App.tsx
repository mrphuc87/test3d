import { Canvas, useLoader } from "@react-three/fiber/native";
import { Sky } from '@react-three/drei/native';
import React, { useMemo, useRef } from "react";
const THREE = require('three');

const Images = {
  grass: require('../assets/grass.jpg')
};

export default function App() {
  return (
    <Canvas camera={{ position: [0, 1, 0], rotation: [0, 0, 0] }}>
      <Sky
        distance={1000} // Controls how far the sky goes
        sunPosition={[100, 100, 100]} // Sun position in 3D space
        inclination={0.5} // Angle of the sun
        azimuth={0.5} // Direction of the sun
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      <Ground hSize={10} vSize={40} />
    </Canvas>
  );
}


const Ground = ({ hSize = 10, vSize = 10 }) => {
  const groundRef = useRef(null);

  const grassTexture = useLoader(THREE.TextureLoader, Images.grass);
  // Repeat the texture to cover the ground
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(hSize, vSize); // Adjust repetition as needed

  const groundMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({ map: grassTexture });
  }, [grassTexture]);

  return (
    <mesh ref={groundRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[hSize, vSize]} />
      <primitive object={groundMaterial} />
    </mesh>
  );
};
