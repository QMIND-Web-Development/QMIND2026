'use client'
import Link from "next/link";
import React from "react";
import PILLARS from "@/assets/colourful-pillar.png";
import Container from "./Container";
import Image from "next/image";

function Footer() {
  return (
    <div className="pb-[4rem]">
      <Container className="flex !flex-row justify-between gap-[30px] md:gap-[75px] lg:gap-[50px]">
        <div className="flex flex-col self-start">
          <h2 className="font-bold text-[20px] pb-[30px]">Menu</h2>
          <div className="flex flex-col opacity-[70%] gap-[15px]">
            <Link href="/">Home</Link>
            <Link href="/leadership">Leadership</Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.queensu.ca/alumni/supporting-queens/stories-of-impact/qmind"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="hidden md:block self-end relative top-[50px] h-[210px] overflow-y-hidden">
          <Image
            className="object-contain relative bottom-[-5px]"
            src={PILLARS}
            alt="Colourful pillars"
          />
        </div>
<div className="flex flex-col text-right">
          <h2 className="font-bold text-[20px] pb-[30px]">
            Find Us In More Places
          </h2>
          <div className="flex flex-col opacity-[70%] gap-[15px]">
            <a target="_blank" rel="noreferrer" href="https://www.instagram.com/qmind.ai/?hl=en">
              Instagram
            </a>
            <a target="_blank" rel="noreferrer" href="https://ca.linkedin.com/school/qmindai/">
              LinkedIn
            </a>
            <a target="_blank" rel="noreferrer" href="https://medium.com/qmind-ai">
              QMIND Tech Review
            </a>
            <a target="_blank" rel="noreferrer" href="https://discord.gg/Hj6SMEZHBp">
              Community Discord
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Footer;