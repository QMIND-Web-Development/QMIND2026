"use client";
import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useGlobalContext } from "@/Context/store";
import { cn } from "@/lib/utils";

function InfoTextArea({ project }: any) {
  const {
    isEditing,
    shortDescription,
    impactDescription,
    fullDescription,
    setShortDescription,
    setImpactDescription,
    setFullDescription,
    errors,
  } = useGlobalContext();

  useEffect(() => {
    if (!project) return;
    setShortDescription(project.shortDescription);
    setImpactDescription(project.impactDescription);
    setFullDescription(project.fullDescription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  return (
    <>
      {/* Short Project Description */}
      <div>
        <h3 className="text-white underline text-[16px] font-semibold mb-[8px]">
          SHORT PROJECT DESCRIPTION
        </h3>
        {!isEditing ? (
          <div>
            <p className="text-[#E0E0E0] text-[16px] font-semibold mb-[8px]">{shortDescription}</p>
          </div>
        ) : (
          <div className="w-full">
          <Textarea
              className={cn(
                "text-[#E0E0E0] text-[16px] font-[600] mb-[8px] bg-[#161616] border-[#4E4E4E] w-full max-h-[600px] lg:max-h-[500px]",
                errors.shortDescription && "border-red-500"
              )}
              style={errors.shortDescription ? { boxShadow: "0 0 5px red" } : {}}
              placeholder="Type description here..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={8000}
            />
            {errors.shortDescription && (
              <p className="text-red-500 text-sm">Short description is required</p>
            )}
</div>

        )}
      </div>
      {/* Short Project Description */}
      <div>
        <h3 className="text-white underline text-[16px] font-semibold mb-[8px]
">
          REAL WORLD IMPACT - What impact will this project have on the world of
          AI?
        </h3>
        {!isEditing ? (
          <div>
            <p className="text-[#E0E0E0] text-[16px] font-semibold mb-[8px]">{impactDescription}</p>
          </div>
        ) : (
          <div className="w-full">
            <Textarea
              className={cn(
                "text-[#E0E0E0] text-[16px] font-[600] mb-[8px] bg-[#161616] border-[#4E4E4E] w-full max-h-[600px] lg:max-h-[500px]",
                errors.impactDescription && "border-red-500"
              )}
              style={errors.impactDescription ? { boxShadow: "0 0 5px red" } : {}}
              placeholder="Type description here..."
              value={impactDescription}
              onChange={(e) => setImpactDescription(e.target.value)}
              maxLength={8000}
            />
            {errors.impactDescription && (
              <p className="text-red-500 text-sm">Impact description is required</p>
            )}
          </div>
        )}
      </div>

      {/* FULL PROJECT DESCRIPTION */}
      <div>
        <h3 className="text-white underline text-[16px] font-semibold mb-[8px]">
          FULL PROJECT DESCRIPTION
        </h3>
        {!isEditing ? (
          <div>
            <p className="text-[16px] leading-[20px]">{fullDescription}</p>
          </div>
        ) : (
          <div className="w-full">
            <Textarea
              className={cn(
                "text-[#E0E0E0] text-[16px] font-[600] mb-[8px] bg-[#161616] border-[#4E4E4E] w-full max-h-[600px] lg:max-h-[500px]",
                errors.fullDescription && "border-red-500"
              )}
              style={errors.fullDescription ? { boxShadow: "0 0 5px red" } : {}}
              placeholder="Type description here..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              maxLength={8000}
            />

            {errors.fullDescription && (
              <p className="text-red-500 text-sm">Full Project Description is required</p>
            )}
          </div>
          
        )}
      </div>
    </>
  );
}

export default InfoTextArea;
