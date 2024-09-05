import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sofia_sans } from "@/font";
function Members() {
  const leadership = [
    {
      title: "Managing Directors",
      cards: [
        {
          name: "Rabab Azeem",
          title: "Managing Director, Design",
          img: "/headshots/Rabab_Azeem.png",
          class: "leadershipCardDesign",
          social: "https://www.linkedin.com/in/rabab-azeem/",
        },
        {
          name: "Rodrigo Del Aguila",
          title: "Managing Director, Development",
          img: "/headshots/Rodrigo_Aguila.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/rodrigo-delaguila/",
        },
        {
          name: "Daniel Wang",
          title: "Managing Director, Operations",
          img: "/headshots/Daniel_Wang.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/itsdanielwang/",
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
          name: "Sara Laker",
          title: "Director of Internal Affairs",
          img: "/headshots/Sara_Laker.png",
          class: "leadershipCardDevelopment",
          social: "https://www.linkedin.com/in/sara-laker/",
        },
        {
          name: "Danne Mohammed",
          title: "Director of QMIND Tech Review",
          img: "/headshots/Danne_Mohammed.png",
          class: "leadershipCardDevelopment",
          social: "",
        },
      ],
    },
    {
      title: "Web Developers",
      cards: [
        {
          name: "Kayne Lee",
          title: "Web Developer",
          img: "/headshots/Kayne_Lee.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/kaynelee/",
        },
        {
          name: "Adwait Srivastava",
          title: "Web Developer",
          img: "/headshots/Adwait_Srivastava.png",
          class: "leadershipCardOperations",
          social: "https://www.linkedin.com/in/adwait-srivastava/",
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

export default Members;
