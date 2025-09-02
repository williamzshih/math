"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, memo } from "react";
import * as THREE from "three";
import {
  useMath,
  type GraphConfig,
  type FunctionConfig,
} from "@/app/math/layout";
import { useSidebar } from "@/components/ui/sidebar";
import { STEPS } from "@/constants";

const cache = new Map<string, THREE.BufferGeometry>();

const Grid = memo(function Grid({
  config,
  theme,
}: {
  config: GraphConfig;
  theme: string | undefined;
}) {
  const geometry = useMemo(() => {
    const cacheKey = `grid-${config.xMin}-${config.xMax}-${config.yMin}-${config.yMax}-${config.zMin}-${config.zMax}-${theme}`;

    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    const points: number[] = [];
    const colors: number[] = [];

    const color = theme === "light" ? [0.96, 0.96, 0.96] : [0.15, 0.15, 0.15];

    // x-axis
    for (let x = Math.ceil(config.xMin); x <= Math.floor(config.xMax); x += 1) {
      // xy plane
      points.push(x, config.yMin, 0, x, config.yMax, 0);
      colors.push(...color, ...color);

      // xz plane
      points.push(x, 0, config.zMin, x, 0, config.zMax);
      colors.push(...color, ...color);
    }

    // y-axis
    for (let y = Math.ceil(config.yMin); y <= Math.floor(config.yMax); y += 1) {
      // xy plane
      points.push(config.xMin, y, 0, config.xMax, y, 0);
      colors.push(...color, ...color);

      // yz plane
      points.push(0, y, config.zMin, 0, y, config.zMax);
      colors.push(...color, ...color);
    }

    // z-axis
    for (let z = Math.ceil(config.zMin); z <= Math.floor(config.zMax); z += 1) {
      // xz plane
      points.push(config.xMin, 0, z, config.xMax, 0, z);
      colors.push(...color, ...color);

      // yz plane
      points.push(0, config.yMin, z, 0, config.yMax, z);
      colors.push(...color, ...color);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    cache.set(cacheKey, geometry);
    return geometry;
  }, [
    config.xMin,
    config.xMax,
    config.yMin,
    config.yMax,
    config.zMin,
    config.zMax,
    theme,
  ]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
});

const Axes = memo(function Axes({ config }: { config: GraphConfig }) {
  const geometry = useMemo(() => {
    const cacheKey = `axes-${config.xMin}-${config.xMax}-${config.yMin}-${config.yMax}-${config.zMin}-${config.zMax}`;

    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    const points = [
      // x-axis
      config.xMin,
      0,
      0,
      config.xMax,
      0,
      0,
      // y-axis
      0,
      config.yMin,
      0,
      0,
      config.yMax,
      0,
      // z-axis
      0,
      0,
      config.zMin,
      0,
      0,
      config.zMax,
    ];

    const colors = [
      // x-axis
      1, 0, 0, 1, 0, 0,
      // y-axis
      0, 1, 0, 0, 1, 0,
      // z-axis
      0, 0, 1, 0, 0, 1,
    ];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    cache.set(cacheKey, geometry);
    return geometry;
  }, [
    config.xMin,
    config.xMax,
    config.yMin,
    config.yMax,
    config.zMin,
    config.zMax,
  ]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
});

const Graph = memo(function Graph({
  func,
  config,
}: {
  func: FunctionConfig;
  config: GraphConfig;
}) {
  const geometry = useMemo(() => {
    const cacheKey = `graph-${func.expression}-${config.xMin}-${config.xMax}-${config.yMin}-${config.yMax}`;

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (cached instanceof THREE.BufferGeometry) return cached;
    }

    const width = config.xMax - config.xMin;
    const height = config.yMax - config.yMin;

    const geometry = new THREE.PlaneGeometry(width, height, STEPS, STEPS);

    const position = geometry.getAttribute("position");
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      let z;
      try {
        z = func.expression.evaluate({ x, y });
      } catch {
        z = NaN;
      }

      if (isFinite(z)) {
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
        position.setZ(i, z);
      } else position.setZ(i, 0);
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    cache.set(cacheKey, geometry);
    return geometry;
  }, [func.expression, config.xMin, config.xMax, config.yMin, config.yMax]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={func.color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.5}
        roughness={0.25}
        clippingPlanes={[
          new THREE.Plane(new THREE.Vector3(0, 0, 1), -config.zMin),
          new THREE.Plane(new THREE.Vector3(0, 0, -1), config.zMax),
        ]}
      />
    </mesh>
  );
});

const Lighting = memo(function Lighting() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
    </>
  );
});

export default function MathPage() {
  const { functions, config } = useMath();
  const { open } = useSidebar();
  const { theme } = useTheme();

  return (
    <div
      className={`h-screen transition-all ${open ? "w-[67vw]" : "w-screen"}`}
    >
      <Canvas
        camera={{
          position: [10, -10, 10],
          near: 1,
          far: 100,
          up: [0, 0, 1],
        }}
        gl={{
          localClippingEnabled: true,
        }}
      >
        <Grid config={config} theme={theme} />
        <Axes config={config} />
        {functions.map(
          (func) =>
            !func.hidden && <Graph key={func.id} func={func} config={config} />,
        )}
        <Lighting />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
