import React from "react";
import { CTAProps } from "../../interfaces/IBtnLink";
import styles from "../../styles/cta.module.scss";
import Link from "next/link";
import { cn } from "@/lib/utils";
function BtnLink({ text, href, className, isExternalLink }: CTAProps) {
  return (
    <Link
      rel={isExternalLink ? "noreferrer" : ""}
      target={isExternalLink ? "_blank" : ""}
      className={cn(
        ` min-w-[140px] bg-[#F7F7F7] rounded-[5px] tertiary-colour h-[40px] px-[13px] md:px-[16px] lg:px-[35px] flex justify-center items-center`,
        styles.ctaHover,
        className
      )}
      href={href}
    >
      <p className="font-gothic font-bold text-[10px] md:text-[11px] lg:text-[14px] tracking-[1.6px] leading-none text-center mt-[2px]">{text}</p>
    </Link>
  );
}

export default BtnLink;
