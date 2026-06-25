'use client';
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./RotatingText.css";

export default function RotatingText({
  texts,
  transition = { type: "spring", damping: 30, stiffness: 400 },
  initial = { y: "100%", opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: "-120%", opacity: 0 },
  animatePresenceMode = "wait",
  rotationInterval = 2000,
  staggerFrom = "first",
  staggerDuration = 0.025,
  splitBy = "characters",
  auto = true,
  loop = true,
  mainClassName = "",
  splitLevelClassName = "",
  elementLevelClassName = "",
  onNext,
  ...rest
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = useCallback(() => {
    setAnimating(true);
    setCurrentTextIndex((prev) =>
      loop ? (prev + 1) % texts.length : Math.min(prev + 1, texts.length - 1)
    );
    if (onNext) onNext();
  }, [texts.length, loop, onNext]);

  useEffect(() => {
    if (!auto) return;
    const interval = setInterval(next, rotationInterval);
    return () => clearInterval(interval);
  }, [auto, rotationInterval, next]);

  const splitIntoCharacters = (text) => {
    if (splitBy === "characters") return text.split("");
    if (splitBy === "words") return text.split(" ");
    if (splitBy === "lines") return text.split("\n");
    return text.split("");
  };

  const getStaggerDelay = (index, totalChars) => {
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
    if (staggerFrom === "center") {
      const center = Math.floor(totalChars / 2);
      return Math.abs(center - index) * staggerDuration;
    }
    if (staggerFrom === "random") return Math.random() * staggerDuration * totalChars;
    return index * staggerDuration;
  };

  const currentText = texts[currentTextIndex];
  const characters = splitIntoCharacters(currentText);

  return (
    <span className={`text-rotate ${mainClassName}`} {...rest}>
      <span className="text-rotate-sr-only">{currentText}</span>

      {!animating ? (
        <span className={`text-rotate-split ${splitLevelClassName}`} aria-hidden="true">
          {characters.map((char, index) => (
            <span
              key={index}
              className={`text-rotate-element ${elementLevelClassName}`}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      ) : (
        <AnimatePresence mode={animatePresenceMode} initial={false}>
          <motion.span
            key={currentTextIndex}
            className={`text-rotate-split ${splitLevelClassName}`}
            initial="initial"
            animate="animate"
            exit="exit"
            aria-hidden="true"
          >
            {characters.map((char, index) => (
              <motion.span
                key={`${currentTextIndex}-${index}`}
                className={`text-rotate-element ${elementLevelClassName}`}
                variants={{
                  initial,
                  animate: {
                    ...animate,
                    transition: {
                      ...transition,
                      delay: getStaggerDelay(index, characters.length),
                    },
                  },
                  exit: {
                    ...exit,
                    transition: {
                      ...transition,
                      delay: getStaggerDelay(index, characters.length),
                    },
                  },
                }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
}
