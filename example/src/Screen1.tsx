import { Canvas, useLoader, Vector3 } from "@react-three/fiber/native";
import { Sky, Sphere, useAnimations, useGLTF } from '@react-three/drei/native';
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
const THREE = require('three');

const Images = {
    grass: require('../assets/grass.jpg'),
    tree: require('../assets/tree.png')
};
const Flags = {
    flag1: require('../assets/golf_flag.glb'),
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
            <Suspense>
                <Flag />
            </Suspense>
            <Ball />
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

// https://gltf.pmnd.rs/
const Flag = () => {
    const { nodes, materials, animations } = useGLTF(Flags.flag1);
    const group = useRef(null)
    const { actions, names } = useAnimations(animations, group);
    useEffect(() => {
        if (actions[names[0]] != null) {
            actions[names[0]]!.reset().fadeIn(0.5).play();
        }
        return () => {
            if (actions[names[0]] != null) {
                actions[names[0]]!.fadeOut(0.5);
            }
        };
    }, [actions]);

    return (
        <group ref={group} dispose={null} position={[0, 1.5, -8]}>
            <group name="Sketchfab_Scene">
                <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.284}>
                    <group name="ab6305f6efde404684e7d3380aa836ffabccleanermaterialmergergles">
                        <group name="Object_2" rotation={[Math.PI / 2, 0, 0]}>
                            <group name="Object_3">
                                <group name="Object_4" position={[1.132, -3.052, 0]}>
                                    <group name="TimeframeMainGroup">
                                        <group name="Object_6">
                                            <mesh
                                                name="Cylinder_001_6_0"
                                                castShadow
                                                receiveShadow
                                                geometry={nodes.Cylinder_001_6_0.geometry}
                                                material={materials.Cylinder_001}
                                            />
                                        </group>
                                    </group>
                                </group>
                                <group name="Object_8" rotation={[Math.PI / 2, 0, 0]}>
                                    <group name="MorphMainGroup">
                                        <mesh
                                            name="Plane"
                                            castShadow
                                            receiveShadow
                                            geometry={nodes.Plane.geometry}
                                            material={materials.Plane}
                                            morphTargetDictionary={nodes.Plane.morphTargetDictionary}
                                            morphTargetInfluences={nodes.Plane.morphTargetInfluences}
                                        />
                                    </group>
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}

type BallProps = {
    position?: any;
    velocity?: any;
    mass?: number;
    force?: any;
};

const Ball = ({ position = new THREE.Vector3(0, .125, -2), velocity = new THREE.Vector3(0, 0, 0), mass = 1, force = new THREE.Vector3(0, 0, 0) }: BallProps) => {
    const [ballPosition, setBallPosition] = useState(position);
    const [ballVelocity, setBallVelocity] = useState(velocity);
    const [forceVector, setForceVector] = useState(force);

    const gravity = new THREE.Vector3(0, -9.8, 0);
    const timeRef = useRef(0);
    

    useEffect(() => {
        const animate = (currentTime: number) => {
            if (timeRef.current === 0) {
                timeRef.current = currentTime;
                return;
            };
            const deltaTime = (currentTime - timeRef.current)/1000000;
            timeRef.current = currentTime;
            
            console.log('Time: ' + deltaTime);
            const totalForce = forceVector.clone().add(gravity.clone().multiplyScalar(mass)).multiplyScalar(deltaTime);
            console.log('TotalForce: ' + JSON.stringify(totalForce));
            const acceleration = totalForce.clone().divideScalar(mass);
            console.log('Acceleration: ' + JSON.stringify(acceleration));
            const newVelocity = ballVelocity.clone().add(acceleration);
            console.log('NewVelocity: ' + JSON.stringify(newVelocity));
            const newPosition = ballPosition.clone().add(newVelocity);
            console.log('NewPosition: ' + JSON.stringify(newPosition));
            if (newPosition.y < 0.125) {
                newPosition.y = 0.125;
                newVelocity.y = 0;
                return;
            }
            setBallPosition(newPosition);
            setBallVelocity(newVelocity);
            setForceVector(new THREE.Vector3(0, 0, 0)); // reset force after applying
        };

        const animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [ballVelocity, ballPosition, force, mass]);

    return (
        <mesh position={ballPosition} onClick={(e) => {
            // const { x, y } = e.point;
            // const forceVector = new THREE.Vector3(x, y, 0).normalize().multiplyScalar(10);
            // forceVector.z = 0;
            // console.log('ForceVector: '+ JSON.stringify(forceVector));
            const v = new THREE.Vector3(0, 16.25, -7);
            setForceVector(v);
            console.log('Force: ' + JSON.stringify(v));
        }}>
            <sphereGeometry args={[0.125, 32, 32]} />
            <meshStandardMaterial color={'hotpink'} />
        </mesh>
    );
};
