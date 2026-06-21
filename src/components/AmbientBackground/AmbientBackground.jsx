"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AmbientBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let orbs = [];
    let time = 0;

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function initOrbs() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      orbs = [
        { x: w * 0.15, y: h * 0.2, radius: 300, vx: 0.08, vy: 0.05, phase: 0 },
        { x: w * 0.8, y: h * 0.25, radius: 340, vx: -0.06, vy: 0.04, phase: 1.5 },
        { x: w * 0.45, y: h * 0.6, radius: 310, vx: 0.05, vy: -0.06, phase: 3.0 },
        { x: w * 0.9, y: h * 0.75, radius: 260, vx: -0.07, vy: -0.04, phase: 4.5 },
        { x: w * 0.1, y: h * 0.8, radius: 280, vx: 0.06, vy: -0.05, phase: 2.2 },
      ];
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (!reducedMotion) {
        time += 0.002;
        orbs.forEach((orb) => {
          orb.x += orb.vx + Math.sin(time + orb.phase) * 0.1;
          orb.y += orb.vy + Math.cos(time + orb.phase) * 0.08;

          if (orb.x < -orb.radius) orb.x = w + orb.radius;
          if (orb.x > w + orb.radius) orb.x = -orb.radius;
          if (orb.y < -orb.radius) orb.y = h + orb.radius;
          if (orb.y > h + orb.radius) orb.y = -orb.radius;
        });
      }

      orbs.forEach((orb) => {
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, "rgba(61, 139, 255, 0.15)");
        gradient.addColorStop(0.5, "rgba(61, 139, 255, 0.07)");
        gradient.addColorStop(1, "rgba(61, 139, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    resize();
    initOrbs();

    if (reducedMotion) {
      draw();
    } else {
      gsap.ticker.add(draw);
    }

    const handleResize = () => { resize(); initOrbs(); };
    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", handleResize);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
