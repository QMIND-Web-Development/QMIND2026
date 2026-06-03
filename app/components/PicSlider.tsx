"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

function PicSlider({ cards, slideLeft }: any) {
  const [, setPosition] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const cardsContainer = document.getElementById("events-id");
    const cardsWidth = cardsContainer!?.clientWidth / 2 + 12;
    setPosition(cardsWidth);
    controls.start({ x: slideLeft ? -cardsWidth : cardsWidth });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-[200px] sm:min-h-[290px] md:min-h-[350px] text-left`}>
      <motion.div
        id="events-id"
        initial={{ x: 0 }}
        animate={controls}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className={`flex gap-[24px] absolute ${slideLeft ? "" : "right-0"}`}
      >
        {cards.map((card: any, i: number) => (
          <div
            key={i}
            className="w-[490px] h-[377px] rounded-[20px] shadow-xl overflow-hidden flex-shrink-0"
          >
            <img
              src={card.fullImage}
              alt={card.alt ?? ""}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default PicSlider;