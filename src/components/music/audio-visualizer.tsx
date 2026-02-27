"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "./music-context";

type AudioVisualizerProps = {
  barCount?: number;
  className?: string;
};

export function AudioVisualizer({ barCount = 32, className = "" }: AudioVisualizerProps) {
  const { analyserNode, isPlaying } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const dataArray = analyserNode
      ? new Uint8Array(analyserNode.frequencyBinCount)
      : null;

    function draw() {
      animRef.current = requestAnimationFrame(draw);
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      if (analyserNode && dataArray && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      }

      const gap = 2;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      const maxBarHeight = height * 0.85;

      for (let i = 0; i < barCount; i++) {
        let value: number;
        if (dataArray && isPlaying) {
          const dataIndex = Math.floor((i / barCount) * (dataArray.length * 0.7));
          value = dataArray[dataIndex] / 255;
        } else {
          value = 0.08 + Math.sin(Date.now() / 1200 + i * 0.4) * 0.04;
        }

        const barHeight = Math.max(2, value * maxBarHeight);
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        const hue = 142 + (i / barCount) * 40;
        const saturation = 60 + value * 30;
        const lightness = isPlaying ? 35 + value * 25 : 20;
        const alpha = isPlaying ? 0.5 + value * 0.5 : 0.2;

        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

        const radius = Math.min(barWidth / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barHeight - radius);
        ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight);
        ctx.lineTo(x + radius, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
      }
    }

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [analyserNode, isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
