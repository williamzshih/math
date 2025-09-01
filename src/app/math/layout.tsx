"use client";

import React, { useState, createContext, useContext } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const COLORS = ["#ff0000", "#00ff00", "#0000ff"];

export interface FunctionConfig {
  id: string;
  expression: string;
  color: string;
  hidden?: boolean;
}

export interface GraphConfig {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
  gridSize: number;
}

const MathContext = createContext<{
  functions: FunctionConfig[];
  config: GraphConfig;
  expression: string;
  setExpression: (expression: string) => void;
  addFunction: () => void;
  toggleFunction: (id: string) => void;
  removeFunction: (id: string) => void;
  setGridSize: (gridSize: number) => void;
} | null>(null);

export function useMath() {
  const context = useContext(MathContext);
  if (!context)
    throw new Error("useMath must be used within MathContext.Provider");
  return context;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expression, setExpression] = useState("");
  const [functions, setFunctions] = useState<FunctionConfig[]>([
    { id: crypto.randomUUID(), expression: "x*y", color: COLORS[0] },
  ]);
  const [config, setConfig] = useState<GraphConfig>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    zMin: -10,
    zMax: 10,
    gridSize: 1,
  });

  const addFunction = () => {
    if (!expression.trim()) return;

    setFunctions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        expression,
        color: COLORS[functions.length % COLORS.length],
      },
    ]);

    setExpression("");
  };

  const toggleFunction = (id: string) =>
    setFunctions((prev) =>
      prev.map((func) =>
        func.id === id ? { ...func, hidden: !func.hidden } : func,
      ),
    );

  const removeFunction = (id: string) =>
    setFunctions((prev) => prev.filter((func) => func.id !== id));

  const setGridSize = (gridSize: number) =>
    setConfig((prev) => ({ ...prev, gridSize }));

  const value = {
    functions,
    config,
    expression,
    setExpression,
    addFunction,
    toggleFunction,
    removeFunction,
    setGridSize,
  };

  return (
    <MathContext.Provider value={value}>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </MathContext.Provider>
  );
}
