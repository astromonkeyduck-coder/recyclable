"use client";

import type { DisposalCategory } from "@/lib/providers/types";
import { CATEGORY_META } from "@/lib/utils/categories";

type ShareCardData = {
  itemName: string;
  category: DisposalCategory;
  confidence: number;
  instructions: string[];
  providerName: string;
};

const GRADIENT_COLORS: Record<DisposalCategory, [string, string]> = {
  recycle: ["#DBEAFE", "#BAE6FD"],
  trash: ["#F3F4F6", "#E2E8F0"],
  compost: ["#DCFCE7", "#D1FAE5"],
  dropoff: ["#FED7AA", "#FDE68A"],
  hazardous: ["#FECACA", "#FECDD3"],
  unknown: ["#FEF3C7", "#FDE68A"],
  donate: ["#EDE9FE", "#DDD6FE"],
  "yard-waste": ["#D1FAE5", "#A7F3D0"],
  deposit: ["#CCFBF1", "#99F6E4"],
};

const ICON_MAP: Record<DisposalCategory, string> = {
  recycle: "\u267B\uFE0F",
  trash: "\uD83D\uDDD1\uFE0F",
  compost: "\uD83C\uDF31",
  dropoff: "\uD83D\uDCCD",
  hazardous: "\u26A0\uFE0F",
  unknown: "\u2753",
  donate: "\u2764\uFE0F",
  "yard-waste": "\uD83C\uDF3F",
  deposit: "\uD83D\uDCB0",
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function generateShareImage(data: ShareCardData): Promise<Blob> {
  const W = 600;
  const H = 520;
  const PAD = 32;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const meta = CATEGORY_META[data.category];
  const [c1, c2] = GRADIENT_COLORS[data.category];
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);

  roundRect(ctx, 0, 0, W, H, 24);
  ctx.fillStyle = grad;
  ctx.fill();

  // Category icon
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.fillText(ICON_MAP[data.category], W / 2, 72);

  // Item name
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  const nameLines = wrapText(ctx, data.itemName, W - PAD * 2);
  let nameY = 108;
  for (const line of nameLines) {
    ctx.fillText(line, W / 2, nameY);
    nameY += 34;
  }

  // Category label
  ctx.font = "600 16px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = meta.color;
  ctx.fillText(meta.description, W / 2, nameY + 8);

  // Confidence bar background
  const barY = nameY + 30;
  const barW = 200;
  const barH = 8;
  const barX = (W - barW) / 2;
  roundRect(ctx, barX, barY, barW, barH, 4);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fill();

  // Confidence bar fill
  roundRect(ctx, barX, barY, barW * data.confidence, barH, 4);
  ctx.fillStyle = meta.color;
  ctx.fill();

  ctx.font = "500 12px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#6B7280";
  ctx.textAlign = "right";
  ctx.fillText(
    `${Math.round(data.confidence * 100)}% confidence`,
    barX + barW,
    barY + barH + 18
  );

  // Instructions (up to 3)
  ctx.textAlign = "left";
  let instrY = barY + barH + 48;
  const instrSlice = data.instructions.slice(0, 3);

  for (let i = 0; i < instrSlice.length; i++) {
    // Step number circle
    const circleX = PAD + 12;
    const circleY = instrY - 5;
    ctx.beginPath();
    ctx.arc(circleX, circleY, 10, 0, Math.PI * 2);
    ctx.fillStyle = meta.color;
    ctx.fill();

    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), circleX, circleY + 4);

    // Step text
    ctx.textAlign = "left";
    ctx.font = "400 14px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#374151";
    const stepLines = wrapText(ctx, instrSlice[i], W - PAD * 2 - 40);
    for (const line of stepLines) {
      ctx.fillText(line, PAD + 30, instrY);
      instrY += 20;
    }
    instrY += 8;
  }

  // Divider
  const divY = H - 56;
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, divY);
  ctx.lineTo(W - PAD, divY);
  ctx.stroke();

  // Footer
  ctx.font = "600 13px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "left";
  ctx.fillText("\u267B\uFE0F isthisrecyclable.com", PAD, H - 24);

  ctx.font = "400 11px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#9CA3AF";
  ctx.textAlign = "right";
  ctx.fillText(`Rules: ${data.providerName}`, W - PAD, H - 24);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      "image/png"
    );
  });
}
