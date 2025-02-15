import { Center, Line, Text3D, useFont } from "@react-three/drei/native";
import { Canvas, ThreeEvent, useLoader, Vector3 } from "@react-three/fiber/native";
import React, { useEffect, useMemo, useState } from "react";
const THREE = require('three');

const Fonts = {
    helvetiker: require('../assets/helvetiker_regular.typeface.json')
};

const chars = "ABCDEFGHIJKLMNO";
const points: any[][] = [];
for (let i = 0; i < 5; i++) {
    points.push([[Math.random() * 10 - 5, Math.random() * 10 + 5, -20], chars[i]]);
}

export default function Screen2() {
    const [selected, setSelected] = useState<number | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [destPosition, setDestPosition] = useState<Vector3 | null>(null);

    return (
        <Canvas style={{ backgroundColor: "black" }} camera={{ position: [0, 10, 0], rotation: [0, 0, 0] }}>
            <ambientLight intensity={0.5} />
            <mesh position={[0, 10, -20]} rotation={[Math.PI / 5, Math.PI / 4, 0]} >
                <torusGeometry args={[4, 0.1, 10, 64]} />
                <meshStandardMaterial color={'red'} />
            </mesh>
            {points.map((_, index) => (
                <CircleWithText key={index} position={points[index][0]} text={points[index][1]} selected={selected === index}
                    onClick={(_: ThreeEvent<MouseEvent>) => {
                        setSelected(index);
                        setDrawing(true);
                        const p = points[index][0];
                        // convert local position to world position
                        const pOnWorld = new THREE.Vector3(p[0], p[1], p[2]);
                        console.log('ToWorld: ' + JSON.stringify(pOnWorld));
                        setDestPosition(pOnWorld);
                    }} />
            ))}
            {drawing && selected !== null && destPosition !== null && <AnimatedLine position={destPosition} onDone={() => {
                //setDrawing(false)
            }} />}
             
        </Canvas>
    );
};

type CircleWithTextProps = {
    position: any;
    text: any;
    selected?: boolean;
    onClick?: (event: ThreeEvent<MouseEvent>) => void;
};

const CircleWithText = ({ position, text, selected = false, onClick }: CircleWithTextProps) => {
    return (
        <mesh position={position} onClick={onClick}>
            {
                selected && <mesh>
                    <ringGeometry args={[.7, .9, 64, 64]} />
                    <meshStandardMaterial color={'white'} />
                </mesh>
            }
            <mesh>
                <circleGeometry args={[.7, 64, 64]} />
                <meshStandardMaterial color={'pink'} />
                <CenteredText text={text} />
            </mesh>
        </mesh>
    );
}

const CenteredText = ({ text }: { text: string }) => {
    const font = useFont(Fonts.helvetiker);
    return (
        <mesh>
            <Center>
                <Text3D font={font.data} size={.3}>{text}</Text3D>
            </Center>
        </mesh>
    );
};

type AnimatedLineProps = {
    position: Vector3;
    onDone?: () => void;
};
const AnimatedLine = ({ position, onDone }: AnimatedLineProps) => {
    console.log('AnimatedLine: ' + JSON.stringify(position));
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        setProgress(0);
    }, [position]);

    useEffect(() => {
        console.log('useEffect')
        const animation = () => {
            setProgress((prevProgress) => {
                console.log('Draw line ' + prevProgress);
                if (prevProgress >= 1) {
                    if (onDone) {
                        onDone();
                    }
                    return 1;
                }
                return prevProgress + 0.01;
            });
        };
        const interval = setInterval(animation, 20);
        return () => clearInterval(interval);
    }, []);

    const interpolatedPosition = useMemo(() => {
        const p = new THREE.Vector3().copy(position).multiplyScalar(progress);
        console.log('interpolatedPosition: ' + JSON.stringify(p));
        return p;
    }, [progress, position]);

    return (
        <Line points={[[0, 0, 0], ...interpolatedPosition]} color="hotpink" lineWidth={3} /> 
    );
};

