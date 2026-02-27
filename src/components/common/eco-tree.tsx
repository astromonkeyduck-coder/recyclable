"use client";

import { motion } from "framer-motion";

export function EcoTree({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden lg:block select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 200 400"
        width="160"
        height="320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Trunk */}
        <motion.path
          d="M95 400 L95 220 Q95 210 100 210 Q105 210 105 220 L105 400"
          fill="#8B6914"
          initial={{ scaleY: 0, originY: "100%" }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.path
          d="M98 400 L98 215 Q100 208 102 215 L102 400"
          fill="#A07820"
          opacity={0.5}
          initial={{ scaleY: 0, originY: "100%" }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />

        {/* Branch left */}
        <motion.path
          d="M95 280 Q70 260 55 240"
          stroke="#8B6914"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Branch right */}
        <motion.path
          d="M105 260 Q130 245 145 225"
          stroke="#8B6914"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />

        {/* Small branch left upper */}
        <motion.path
          d="M95 240 Q75 225 60 210"
          stroke="#8B6914"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />

        {/* Canopy layers (bottom to top, larger to smaller) */}
        {[
          { cx: 100, cy: 170, rx: 65, ry: 45, delay: 0.8, color: "#1B8A3A" },
          { cx: 85, cy: 150, rx: 50, ry: 40, delay: 0.9, color: "#22A34A" },
          { cx: 115, cy: 145, rx: 48, ry: 38, delay: 1.0, color: "#1E9640" },
          { cx: 100, cy: 130, rx: 55, ry: 42, delay: 1.1, color: "#26B553" },
          { cx: 90, cy: 110, rx: 42, ry: 35, delay: 1.2, color: "#2DC85E" },
          { cx: 110, cy: 105, rx: 40, ry: 32, delay: 1.3, color: "#22A34A" },
          { cx: 100, cy: 85, rx: 35, ry: 30, delay: 1.4, color: "#30D965" },
          { cx: 100, cy: 65, rx: 25, ry: 22, delay: 1.5, color: "#3CE074" },
        ].map((leaf, i) => (
          <motion.ellipse
            key={i}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill={leaf.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: leaf.delay,
              type: "spring",
              stiffness: 200,
            }}
          />
        ))}

        {/* Highlight spots on canopy */}
        {[
          { cx: 80, cy: 125, r: 8, delay: 1.6 },
          { cx: 120, cy: 100, r: 6, delay: 1.7 },
          { cx: 95, cy: 75, r: 5, delay: 1.8 },
          { cx: 110, cy: 140, r: 7, delay: 1.65 },
        ].map((spot, i) => (
          <motion.circle
            key={`h-${i}`}
            cx={spot.cx}
            cy={spot.cy}
            r={spot.r}
            fill="rgba(255,255,255,0.12)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: spot.delay, duration: 0.4 }}
          />
        ))}

        {/* Swaying leaves */}
        {[
          { x: 55, y: 155, delay: 2.0, size: 6 },
          { x: 140, y: 120, delay: 2.2, size: 5 },
          { x: 70, y: 95, delay: 2.4, size: 5 },
          { x: 125, y: 80, delay: 2.1, size: 4 },
          { x: 100, y: 55, delay: 2.3, size: 5 },
        ].map((leaf, i) => (
          <motion.ellipse
            key={`leaf-${i}`}
            cx={leaf.x}
            cy={leaf.y}
            rx={leaf.size}
            ry={leaf.size * 0.6}
            fill="#4ADE80"
            opacity={0.7}
            animate={{
              x: [0, 3, -2, 0],
              y: [0, -2, 1, 0],
              rotate: [0, 10, -5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Ground / grass */}
        <motion.ellipse
          cx="100"
          cy="398"
          rx="70"
          ry="8"
          fill="#16A34A"
          opacity={0.15}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        {/* Small grass blades */}
        {[
          { x: 50, h: 12 }, { x: 60, h: 8 }, { x: 70, h: 15 },
          { x: 130, h: 10 }, { x: 140, h: 14 }, { x: 150, h: 9 },
        ].map((g, i) => (
          <motion.line
            key={`grass-${i}`}
            x1={g.x}
            y1={398}
            x2={g.x + (i % 2 === 0 ? 3 : -2)}
            y2={398 - g.h}
            stroke="#22C55E"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.3}
            initial={{ scaleY: 0, originY: "100%" }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.8 + i * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}
