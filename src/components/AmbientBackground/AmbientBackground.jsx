"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function generateWavePath(width, height, amplitude, frequency, yOffset) {
  let d = `M 0 ${yOffset}`;
  const step = 10;
  for (let x = 0; x <= width; x += step) {
    const y = yOffset + Math.sin((x / width) * Math.PI * 2 * frequency) * amplitude;
    d += ` L ${x} ${y}`;
  }
  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}

export default function AmbientBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);

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

      gsap.to(wave1Ref.current, {
        x: "-50%",
        duration: 20,
        repeat: -1,
        ease: "none",
      });
      gsap.to(wave2Ref.current, {
        x: "-50%",
        duration: 25,
        repeat: -1,
        ease: "none",
      });
      gsap.to(wave3Ref.current, {
        x: "-50%",
        duration: 18,
        repeat: -1,
        ease: "none",
      });
    }

    const handleResize = () => { resize(); initOrbs(); };
    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", handleResize);
    };
  }, { scope: containerRef });

  const svgWidth = 2400;
  const viewHeight = 200;

  const wave1Path = generateWavePath(svgWidth, viewHeight, 30, 2, 80);
  const wave2Path = generateWavePath(svgWidth, viewHeight, 20, 3, 100);
  const wave3Path = generateWavePath(svgWidth, viewHeight, 25, 1.5, 90);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="w-full h-full" />

      <div className="absolute inset-0 overflow-hidden">
        <svg
          ref={wave1Ref}
          className="absolute bottom-[15%] left-0"
          width="200%"
          height="200"
          viewBox={`0 0 ${svgWidth} ${viewHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={wave1Path} fill="rgba(61, 139, 255, 0.06)" />
        </svg>

        <svg
          ref={wave2Ref}
          className="absolute bottom-[40%] left-0"
          width="200%"
          height="180"
          viewBox={`0 0 ${svgWidth} ${viewHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={wave2Path} fill="rgba(61, 139, 255, 0.04)" />
        </svg>

        <svg
          ref={wave3Ref}
          className="absolute bottom-[65%] left-0"
          width="200%"
          height="160"
          viewBox={`0 0 ${svgWidth} ${viewHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={wave3Path} fill="rgba(61, 139, 255, 0.05)" />
        </svg>
      </div>
    </div>
  );
}
