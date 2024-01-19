import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;