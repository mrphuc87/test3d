import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Plane } from '@react-three/drei';
import { TextureLoader } from 'three';

const Images = {
  grass: require('../assets/grass.jpg')
};

export default function App() {
  const texture = new TextureLoader().load(Images.grass);
  return (
    <Canvas>
      <Sky
          distance={1000} // Controls how far the sky goes
          sunPosition={[100, 100, 100]} // Sun position in 3D space
          inclination={0.5} // Angle of the sun
          azimuth={0.5} // Direction of the sun
        />
      {/* <Ground /> */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
        <meshStandardMaterial map={texture} />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </Canvas>
  );
}

const Ground = () => {  
  const texture = new TextureLoader().load(Images.grass); // replace with the image path
  return (
    <Plane
      position={[0, -0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      args={[10, 10]}
    >
      <meshStandardMaterial map={texture} />
    </Plane>
  );
};