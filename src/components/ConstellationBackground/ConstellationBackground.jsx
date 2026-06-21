"use client";
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ConstellationBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [density, setDensity] = useState("high");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setDensity(mq.matches ? "low" : "high");
    const handler = (e) => setDensity(e.matches ? "low" : "high");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    gsap.from(containerRef.current, { opacity: 0, duration: 1 });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let points = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function initPoints() {
      const count = density === "high" ? 60 : 30;
      points = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.5,
      }));
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (!reducedMotion) {
        points.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        });
      }

      const maxDist = 150;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(61, 139, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(61, 139, 255, 0.8)";
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(61, 139, 255, 0.6)";
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }

    resize();
    initPoints();

    if (reducedMotion) {
      draw();
    } else {
      gsap.ticker.add(draw);
    }

    window.addEventListener("resize", resize);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, { scope: containerRef, dependencies: [density] });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.7 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
