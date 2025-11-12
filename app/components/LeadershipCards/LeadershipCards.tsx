import Image from "next/image";
import Link from "next/link";
import React from "react";

import { sofia_sans } from "@/font";

import './LeadershipCards.css'

function LeadershipCards() {
  const leadership = [
    {
      title: "Managing Directors",
      cards: [
        {
          name: "Mitchell Sabbadini",
          title: "Managing Director, Design",
          img: "/headshots/Mitchell_Sabbadini.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/mitchell-sabbadini/",
        },
        {
          name: "Lauren Lidhar",
          title: "Managing Director, Development",
          img: "/headshots/Lauren_Lidhar.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/lauren-lidhar/",
        },
        {
          name: "Paul Wu",
          title: "Managing Director, Operations",
          img: "/headshots/Paul_Wu.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/paul-wu-on/",
        },
      ],
    },
    {
      title: "Design",
      cards: [
        {
          name: "Josh Albom",
          title: "Director of Design",
          img: "/headshots/Josh_Albom.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/josh-albom/",
        },
        {
          name: "Josh Wagman",
          title: "Director of Design",
          img: "/headshots/Josh_Wagman.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/josh-wagman-81099b252/",
        },
        {
          name: "Shrika Vejandla",
          title: "Director of Design",
          img: "/headshots/Shrika_Vejandla.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/shrikavejandla/",
        },
        {
          name: "Zain Parihar",
          title: "Director of Design",
          img: "/headshots/Zain_Parihar.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/zain-parihar/",
        },
        {
          name: "Caitlin Roach",
          title: "Director of Design",
          img: "/headshots/Caitlin_Roach.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/caitlin-roach/",
        },
        {
          name: "Jake Feldman",
          title: "Director of Design",
          img: "/headshots/Jake_Feldman.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/jake-feldman-starosta-a43857296/",
        },
        {
          name: "Michael Cronin",
          title: "Director of Design, Consulting",
          img: "/headshots/Michael_Cronin.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/michael-cronin-20mjc8/",
        },
        {
          name: "Colin Gould",
          title: "Director of Design, Consulting",
          img: "/headshots/Colin_Gould.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/colin-gould15/",
        },
      ],
    },
    {
      title: "Operations",
      cards: [
        {
          name: "Sandy Mourad",
          title: "Director of Marketing",
          img: "/headshots/Sandy_Mourad.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/sandy-mourad/",
        },
        {
          name: "Rowan McDonald",
          title: "Director of Finance",
          img: "/headshots/Rowan_McDonald.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/rowan-m/",
        },
        {
          name: "Adwait Srivastava",
          title: "Director of Web Development",
          img: "/headshots/Adwait_Srivastava.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/adwait-srivastava/",
        },
      ],
    },
    {
      title: "Development",
      cards: [
        {
          name: "Elisa Galli",
          title: "Director of Internal Affairs",
          img: "/headshots/Elisa_Galli.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/elisa-galli1/",
        },
        {
          name: "Ishaan Khanna",
          title: "Director of External Affairs",
          img: "/headshots/Ishaan_Khanna.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/ishaan-khanna18/",
        },
        {
          name: "Sarah Nassar",
          title: "Director of Tech Review",
          img: "/headshots/Sarah_Nassar.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/sarah-n-661b84213/",
        },
      ],
    },
    {
      title: "Web Developers",
      cards: [
        {
          name:  "Nihal Kodukula",
          title: "Web Developer",
          img: "/headshots/Nihal_Kodukula.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/satyanihal/",
        },

        {
          name: "Bree Garey",
          title: "Web Developer",
          img: "/headshots/Gabrielle_Garey.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/ggarey05/",
        },

        {
          name: "Ananya Kollipara",
          title: "Web Developer",
          img: "/headshots/Ananya_Kollipara.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/ananya-kollipara-b74518295/",
        },

      ],
    },
  ];

  return (
    <>
      {leadership.map((section, index) => {
        return (
          <div key={index} className="flex flex-col gap-4 items-center">
            <h1 className="font-gothic font-bold text-[30px] md:text-[40px]">
              {section.title}
            </h1>
            <div className="flex flex-row flex-wrap justify-center gap-4 md:gap-8 w-[100%] leading-none">
              {section.cards.map((card, index) => {
                return (
                  <Link
                    href={card.social}
                    key={index}
                    target="_blank"
                    rel="noreferrer"
                    className={`${card.class} w-[150px] md:w-[225px] lg:w-[275px] text-center flex flex-col gap-5 justify-center items-center rounded-[16px] p-[12px] md:p-[20px] md:rounded-[24px]  bg-[#2E2E2E]`}
                  >
                    <div className={`${card.class}-img rounded-[5px] md:rounded-[10px] w-full`}>
                    
                    <div className="relative w-full aspect-square overflow-hidden rounded-[5px] md:rounded-[8px]">
                      <Image
                        src={card.img}
                        alt="QMIND Member"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 235px"
                      />
                    </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p
                        className={`${sofia_sans.className} font-semibold font-gothic tracking-tight text-[16px] md:text-[20px]`}
                      >
                        {card.name}
                      </p>

                      <p
                        className={`${sofia_sans.className} font-light font-gothic text-[12px] xl:text-[16px]`}
                      >
                        {card.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default LeadershipCards;
