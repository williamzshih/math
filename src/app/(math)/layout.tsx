"use client";

import * as math from "mathjs";
import { useState, createContext, useContext } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import Settings from "@/components/Settings";
import { COLORS, CONFIG } from "@/constants";

export interface FunctionConfig {
  id: string;
  expression: math.MathNode;
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
  opacity: number;
  gridVisible: boolean;
}

const MathContext = createContext<{
  functions: FunctionConfig[];
  config: GraphConfig;
  expression: string;
  setExpression: (expression: string) => void;
  addFunction: () => void;
  toggleFunction: (id: string) => void;
  removeFunction: (id: string) => void;
  setOpacity: (opacity: number) => void;
  setGridVisible: (gridVisible: boolean) => void;
} | null>(null);

export const useMath = () => {
  const context = useContext(MathContext);
  if (!context)
    throw new Error("useMath must be used within MathContext.Provider");
  return context;
};

export default function MathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expression, setExpression] = useState("");
  const [functions, setFunctions] = useState<FunctionConfig[]>([]);
  const [config, setConfig] = useState<GraphConfig>(CONFIG);

  const addFunction = () => {
    if (!expression.trim()) return;

    setFunctions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        expression: math.parse(expression),
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

  const setOpacity = (opacity: number) =>
    setConfig((prev) => ({ ...prev, opacity }));

  const setGridVisible = (gridVisible: boolean) =>
    setConfig((prev) => ({ ...prev, gridVisible }));

  const value = {
    functions,
    config,
    expression,
    setExpression,
    addFunction,
    toggleFunction,
    removeFunction,
    setOpacity,
    setGridVisible,
  };

  return (
    <MathContext.Provider value={value}>
      <AppSidebar />
      <Settings />
      <main>{children}</main>
    </MathContext.Provider>
  );
}
