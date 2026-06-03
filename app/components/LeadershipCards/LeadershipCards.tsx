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
          name: "Dolev Klein Harari",
          title: "Managing Director, Design",
          img: "/headshots/Dolev_Klein_Harari.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/dolevkharari/",
        },
        {
          name: "Colin McLaughlin",
          title: "Managing Director, Development",
          img: "/headshots/colin.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/colinwmclaughlin/",
        },
        {
          name: "Cait Roach",
          title: "Managing Director, Operations",
          img: "/headshots/Caitlin_Roach.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/caitlin-roach/",
        },
      ],
    },
    {
      title: "Design Supervisors",
      cards: [
        {
          name: "Rosie Wang",
          title: "Supervisor, Consulting",
          img: "/headshots/rosie_wang.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/rosiewang37/",
        },
        {
          name: "Saleh Abdelrahman",
          title: "Supervisor, Research",
          img: "/headshots/saleh_abdelrahman.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/saleh-abdelrahman-79a6ba18b/",
        },
        
      ],
    },
    /*
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
    */
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
