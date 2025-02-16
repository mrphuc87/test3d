import { Canvas, useLoader } from "@react-three/fiber/native";
import { Sky, Sphere, useAnimations, useGLTF } from '@react-three/drei/native';
import React, { useEffect, useMemo, useRef } from "react";
import { LoopRepeat } from "three";
// import { Physics } from "@react-three/cannon";
const THREE = require('three');

const Images = {
    grass: require('../assets/grass.jpg'),
    tree: require('../assets/tree.png')
};
const Flags = {
    flag1: require('../assets/flag1.glb'),
    flag2: require('../assets/flag2.glb')
};

export default function Screen1() {
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
            <Background />
            {/* <Physics>
                <Sphere args={[0.5]} position={[0, 1, -5]} >
                    <meshStandardMaterial color={'blue'} />
                </Sphere>
            </Physics> */}
            <Flag />
        </Canvas>
    );
}


const Ground = ({ hSize = 10, vSize = 10 }) => {
    const grassTexture = useLoader(THREE.TextureLoader, Images.grass);
    // Repeat the texture to cover the ground
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(hSize, vSize); // Adjust repetition as needed

    const groundMaterial = useMemo(() => {
        return new THREE.MeshLambertMaterial({ map: grassTexture });
    }, [grassTexture]);

    return (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
            <planeGeometry args={[hSize, vSize]} />
            <primitive object={groundMaterial} />
            <shadowMaterial opacity={0.5} />
        </mesh>
    );
};

const Background = () => {
    const texture = useLoader(THREE.TextureLoader, Images.tree);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    const material = useMemo(() => {
        return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    }, [texture]);

    return (
        <mesh position={[0, 1, -16]} rotation={[0, 0, 0]}>
            <planeGeometry args={[17, 2]} />
            <primitive object={material} />
        </mesh>
    );
}

const Flag = () => {
    const { nodes, materials, animations } = useGLTF(Flags.flag1);
    const group = useRef(null)
    const { actions } = useAnimations(animations, group);
    console.log('animations names: ', actions);
    //     const { actions, names } = useAnimations(animations, group);
    //   console.log('animations names: ', names);
    //   // animations names:  ["Armature|Death", "Armature|Idle", "Armature|Jump", "Armature|Run", "Armature|Walk", "Armature|WalkSlow"]
      useEffect(() => {
        // Play the "Idle" animation
        const idleAction = actions['Armature_Flag|Wind Detailed'];
        if (idleAction) {
          idleAction
            .reset()
            .setLoop(LoopRepeat, Infinity) // Set loop mode and infinite repetitions
            .fadeIn(0.5)
            .play();
        }
        return () => {
          // Stop the "Idle" animation when the component is unmounted
          if (idleAction) idleAction.fadeOut(0.5);
        };
      }, [actions]);
    
    return (
        <group ref={group} dispose={null} scale={.75} position={[0, 2, -15]}>
            <group name="Scene">
                <group name="Armature_Flag">
                    <skinnedMesh
                        name="Flag_Rigged"
                        geometry={nodes.Flag_Rigged.geometry}
                        material={materials.Flag_Dirty}
                        skeleton={nodes.Flag_Rigged.skeleton}
                    />
                    <primitive object={nodes.Node} />
                </group>
            </group>
        </group>
    )
}