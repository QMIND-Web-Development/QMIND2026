"use client";
import Image from "next/image";
import Link from "next/link";
import EXTERNAL_LINK from "@/assets/icons/external_link.png";
import { useGlobalContext } from "@/Context/store";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import './SocialLinks.css'

function SocialLinks({ project }: any) {
  const { isEditing, githubUrl, setGithubUrl, errors } = useGlobalContext();

  useEffect(() => {
    setGithubUrl(project.githubUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <div>
      <div className="item-social2 !pl-0 min-w-[50%] lg:min-w-fit text-left">
        <div className="info text-center md:text-left">GITHUB REPOSITORY</div>
        {!isEditing ? (
          <Link
            href={githubUrl}
            target="_blank"
            className="hover:text-[skyblue] text-center md:text-left w-[100%] flex gap-[5px] items-center md:justify-start justify-center"
          >
          {githubUrl.length > 30
            ? `${githubUrl.slice(0, 19)}...`
            : githubUrl}
        </Link>
        ) : (
          <div>
            <Input
              placeholder="https://github.com/"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              maxLength={100}
              className={cn(errors.githubUrl && "border-red-500")}
            />
            { errors.githubUrl && <p className="text-sm text-fail">Invalid Github URL</p> }
          </div>
        )}
        <div className="info text-center md:text-left">CONTACT QMIND</div>

        <p className="text-center md:text-left">partnerships@qmind.ca</p>
        <div className="info text-center md:text-left ">
          LEARN MORE ABOUT QMIND
        </div>
        <div className="flex flex-col ">
          <Link
            href="https://www.instagram.com/qmind.ai"
            target="_blank"
            className="hover:text-[skyblue] text-center md:text-left flex gap-[5px] items-center md:justify-start justify-center"
          >
            <span>Instagram</span>
            <Image
              src={EXTERNAL_LINK}
              alt="external link"
              height={20}
              width={20}
            />
          </Link>
          <Link
            rel="icon"
            href="https://www.linkedin.com/school/qmindai/"
            target="_blank"
            className="hover:text-[skyblue] text-center md:text-left flex gap-[5px] items-center md:justify-start justify-center"
          >
            Linkedin
            <Image
              src={EXTERNAL_LINK}
              alt="external link"
              height={20}
              width={20}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SocialLinks;
