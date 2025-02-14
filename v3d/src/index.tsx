import { Canvas } from '@react-three/fiber/native';

export { default as V3dView } from './V3dViewNativeComponent';
export * from './V3dViewNativeComponent';

export function V3DGolf() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </Canvas>
  );
}
