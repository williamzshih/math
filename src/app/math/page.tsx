"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function Math() {
  const [size, setSize] = useState(0.5);

  return (
    <div className="h-screen w-screen">
      <Card className="absolute top-4 left-4 z-10 w-sm">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            value={[size]}
            onValueChange={(size) => setSize(size[0])}
            max={1}
            step={0.01}
          />
        </CardContent>
      </Card>
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <axesHelper args={[5]} />
        <mesh>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
