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
          name: "David Courtis",
          title: "Director of Design, Natural Language Processing",
          img: "/headshots/David_Courtis.png",
          class: "leadershipCardDesign",
          social: "",
        },
        {
          name: "Kiarash Mirkamandari",
          title: "Director of Design, Computer Vision",
          img: "/headshots/Kiarash_Mirkamandari.png",
          class: "leadershipCardDesign",
          social: "",
        },
        {
          name: "Paul Wu",
          title: "Director of AI Ethics",
          img: "/headshots/Paul_Wu.png",
          class: "leadershipCardDesign",
          social: "",
        },
        {
          name: "Ryan Su",
          title: "Director of Design, Finance, Reinforcement Learning",
          img: "/headshots/Ryan_Su.png",
          class: "leadershipCardDesign",
          social: "",
        },
        {
          name: "Sarah Nassar",
          title: "Director of Design, Healthcare",
          img: "/headshots/Sarah_Nassar.png",
          class: "leadershipCardDesign",
          social: "",
        },
        {
          name: "Seth Grief-Albert",
          title: "Director of AI Research",
          img: "/headshots/Seth_Albert.png",
          class: "leadershipCardDesign",
          social: "",
        },
      ],
    },
    {
      title: "Operations",
      cards: [
        {
          name: "Jasmine Zangeneh",
          title: "Director of Marketing",
          img: "/headshots/Jasmine_Zangeneh.png",
          class: "leadershipCardOperations",
          social: "",
        },
        {
          name: "Joseph Liao",
          title: "Director of Marketing",
          img: "/headshots/Joseph_Liao.png",
          class: "leadershipCardOperations",
          social: "",
        },
        {
          name: "Leonardo Montes Q.",
          title: "Director of External Relations",
          img: "/headshots/Leonardo_Montes.png",
          class: "leadershipCardOperations",
          social: "",
        },
        {
          name: "Rowan McDonald",
          title: "Director of Finance",
          img: "/headshots/Rowan_McDonald.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/rowan-m/",
        },
        {
          name: "Stefan Pitigoi",
          title: "Director of Web Development",
          img: "/headshots/Stefan_Pitigoi.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/stefan-pitigoi/",
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
        // {
        //   name: "Danne Mohammed",
        //   title: "Director of QMIND Tech Review",
        //   img: "/headshots/Danne_Mohammed.png",
        //   class: "leadershipCardDevelopment",
        //   social: "",
        // },
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
          name: "Ananya Kollipara",
          title: "Web Developer",
          img: "/headshots/Adwait_Srivastava.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/ananya-kollipara-b74518295/",
        },


        {
          name: "Bree Garey",
          title: "Web Developer",
          img: "/headshots/Connor_Pineault.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/ggarey05/",
        },

        {
          name: "Kuzey Bilgin",
          title: "Web Developer",
          img: "/headshots/Nicolas_Aguila.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/kuzey-bilgin-66a7b3213/",
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
                    <div
                      className={`${card.class}-img rounded-[5px] md:rounded-[10px] w-full`}
                    >
                      <Image
                        src={card.img}
                        alt="QMIND Member"
                        className={`md:rounded-[8px] aspect-square w-full rounded-[5px]`}
                        height={235}
                        width={235}
                      />
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
