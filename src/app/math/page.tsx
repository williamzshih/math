"use client";

import { OrbitControls, Text, Line } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  useMath,
  type FunctionConfig,
  type GraphConfig,
} from "@/app/math/layout";

const STEPS = 200;

function Grid({ config }: { config: GraphConfig }) {
  const lines: THREE.Vector3[][] = [];

  for (
    let x = Math.ceil(config.xMin);
    x <= Math.floor(config.xMax);
    x += config.gridSize
  ) {
    lines.push([
      new THREE.Vector3(x, config.yMin, 0),
      new THREE.Vector3(x, config.yMax, 0),
    ]);
    lines.push([
      new THREE.Vector3(x, 0, config.zMin),
      new THREE.Vector3(x, 0, config.zMax),
    ]);
  }

  for (
    let y = Math.ceil(config.yMin);
    y <= Math.floor(config.yMax);
    y += config.gridSize
  ) {
    lines.push([
      new THREE.Vector3(config.xMin, y, 0),
      new THREE.Vector3(config.xMax, y, 0),
    ]);
    lines.push([
      new THREE.Vector3(0, y, config.zMin),
      new THREE.Vector3(0, y, config.zMax),
    ]);
  }

  for (
    let z = Math.ceil(config.zMin);
    z <= Math.floor(config.zMax);
    z += config.gridSize
  ) {
    lines.push([
      new THREE.Vector3(config.xMin, 0, z),
      new THREE.Vector3(config.xMax, 0, z),
    ]);
    lines.push([
      new THREE.Vector3(0, config.yMin, z),
      new THREE.Vector3(0, config.yMax, z),
    ]);
  }

  return (
    <>
      {lines.map((points, i) => (
        <Line key={i} points={points} />
      ))}
    </>
  );
}

function Axes({ config }: { config: GraphConfig }) {
  return (
    <>
      <Line
        points={[
          new THREE.Vector3(config.xMin, 0, 0),
          new THREE.Vector3(config.xMax, 0, 0),
        ]}
        color="#ff0000"
      />
      <Line
        points={[
          new THREE.Vector3(0, config.yMin, 0),
          new THREE.Vector3(0, config.yMax, 0),
        ]}
        color="#00ff00"
      />
      <Line
        points={[
          new THREE.Vector3(0, 0, config.zMin),
          new THREE.Vector3(0, 0, config.zMax),
        ]}
        color="#0000ff"
      />
    </>
  );
}

function AxisLabels({ config }: { config: GraphConfig }) {
  const xLabels = Array.from(
    { length: Math.floor(config.xMax) - Math.ceil(config.xMin) + 1 },
    (_, i) => i + Math.ceil(config.xMin),
  );

  const yLabels = Array.from(
    { length: Math.floor(config.yMax) - Math.ceil(config.yMin) + 1 },
    (_, i) => i + Math.ceil(config.yMin),
  );

  const zLabels = Array.from(
    { length: Math.floor(config.zMax) - Math.ceil(config.zMin) + 1 },
    (_, i) => i + Math.ceil(config.zMin),
  );

  return (
    <>
      {xLabels.map((label) => (
        <Text
          key={label}
          position={[label, 0, 0]}
          fontSize={0.25}
          color="#808080"
        >
          {label}
        </Text>
      ))}
      {yLabels.map((label) => (
        <Text
          key={label}
          position={[0, label, 0]}
          fontSize={0.25}
          color="#808080"
        >
          {label}
        </Text>
      ))}
      {zLabels.map((label) => (
        <Text
          key={label}
          position={[0, 0, label]}
          fontSize={0.25}
          color="#808080"
        >
          {label}
        </Text>
      ))}
    </>
  );
}

function FunctionGraph({
  func,
  config,
}: {
  func: FunctionConfig;
  config: GraphConfig;
}) {
  const points = [];
  const xStep = (config.xMax - config.xMin) / STEPS;
  const yStep = (config.yMax - config.yMin) / STEPS;

  for (let x = config.xMin; x <= config.xMax; x += xStep) {
    for (let y = config.yMin; y <= config.yMax; y += yStep)
      points.push(new THREE.Vector3(x, y, x * y)); // placeholder for now
  }

  return <Line points={points} color={func.color} />;
}

export default function MathPage() {
  const { functions, config } = useMath();

  return (
    <div className="h-screen w-screen">
      <Canvas>
        <Grid config={config} />
        <Axes config={config} />
        <AxisLabels config={config} />
        {functions.map(
          (func) =>
            !func.hidden && (
              <FunctionGraph key={func.id} func={func} config={config} />
            ),
        )}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
