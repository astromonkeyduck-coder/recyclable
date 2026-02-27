"use client";

import { motion, AnimatePresence } from "framer-motion";

type EcoTreeProps = {
  className?: string;
  showBird?: boolean;
};

function PerchingBird() {
  return (
    <motion.g
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6, type: "spring", stiffness: 120, damping: 12 }}
    >
      <g transform="translate(138, 210)">
        {/* Whole body bob */}
        <motion.g
          animate={{ y: [0, -1.5, 0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Tail feathers */}
          <motion.g style={{ originX: "3px", originY: "2px" }}>
            <motion.path
              d="M-2 2 Q-10 -2 -13 4 Q-8 3 -2 4Z"
              fill="#5B4A2E"
              animate={{ rotate: [0, -6, 0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.path
              d="M-1 1 Q-11 -5 -14 1 Q-9 1 -1 3Z"
              fill="#6B5A3E"
              animate={{ rotate: [0, -4, 0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />
          </motion.g>

          {/* Body */}
          <ellipse cx="5" cy="2" rx="7" ry="5.5" fill="#8B6C42" />
          <ellipse cx="5" cy="1" rx="6" ry="4.5" fill="#A0804E" />

          {/* Wing (right side visible) */}
          <motion.g style={{ originX: "8px", originY: "0px" }}>
            <motion.ellipse
              cx="8"
              cy="0"
              rx="5"
              ry="4"
              fill="#7A5C36"
              animate={{
                scaleY: [1, 1, 1, 1, 0.6, 1.1, 0.7, 1, 1, 1, 1, 1],
                scaleX: [1, 1, 1, 1, 1.1, 0.95, 1.05, 1, 1, 1, 1, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </motion.g>

          {/* Belly highlight */}
          <ellipse cx="4" cy="4" rx="4" ry="3" fill="#C4A36A" opacity={0.6} />

          {/* Head group with tilt */}
          <motion.g
            style={{ originX: "6px", originY: "-5px" }}
            animate={{ rotate: [0, 5, 0, -6, -3, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            {/* Head */}
            <circle cx="10" cy="-5" r="4.5" fill="#A0804E" />
            <circle cx="10" cy="-5.5" r="4" fill="#B89060" />

            {/* Eye */}
            <circle cx="12" cy="-6" r="1.2" fill="#1A1A1A" />
            <circle cx="12.3" cy="-6.3" r="0.4" fill="#FFFFFF" />

            {/* Beak with chirp */}
            <motion.g
              style={{ originX: "14px", originY: "-5px" }}
              animate={{
                scaleY: [1, 1, 1, 1, 1.4, 0.8, 1.3, 1, 1, 1, 1, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            >
              <path d="M14 -6 L18 -5 L14 -4Z" fill="#E8A020" />
              <path d="M14 -5 L17.5 -4.5 L14 -4Z" fill="#D09018" />
            </motion.g>

            {/* Crown feather tuft */}
            <motion.path
              d="M8 -9 Q9 -13 10 -9"
              stroke="#7A5C36"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              animate={{ rotate: [0, 8, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              style={{ originX: "9px", originY: "-9px" }}
            />
          </motion.g>

          {/* Legs */}
          <line x1="3" y1="7" x2="2" y2="13" stroke="#D09018" strokeWidth="0.8" />
          <line x1="7" y1="7" x2="8" y2="13" stroke="#D09018" strokeWidth="0.8" />
          {/* Feet */}
          <path d="M0 13 L2 13 L4 12" stroke="#D09018" strokeWidth="0.7" fill="none" />
          <path d="M6 12 L8 13 L10 13" stroke="#D09018" strokeWidth="0.7" fill="none" />
        </motion.g>
      </g>
    </motion.g>
  );
}

export function EcoTree({ className = "", showBird = false }: EcoTreeProps) {
  return (
    <div className={`hidden lg:block select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 200 400"
        className="w-[200px] xl:w-[240px] 2xl:w-[280px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Whole tree sway — pivots from trunk base */}
        <motion.g
          style={{ originX: "100px", originY: "400px" }}
          animate={{ rotate: [0, 0.8, 0, -0.6, 0, 0.5, 0, -0.8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
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

          {/* Bird perched on right branch */}
          <AnimatePresence>
            {showBird && <PerchingBird />}
          </AnimatePresence>
        </motion.g>

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
