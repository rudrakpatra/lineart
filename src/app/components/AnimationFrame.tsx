import React from "react";

export const useTimer = (
  callback: { (deltaTime: number): void },
  wait: number
) => {
  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(0);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (deltaTime > wait) {
        callback(deltaTime);
        previousTimeRef.current = time;
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  });
};

export const useDelta = (
  callback: { (deltaTime: number): void },
  play: boolean
) => {
  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(0);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    if (play) {
      console.log("frame");
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [play]);
};
