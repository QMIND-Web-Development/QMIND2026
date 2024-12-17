"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PENCIL from "@/assets/icons/pencil.png";
import Image from "next/image";
import { useGlobalContext } from "@/Context/store";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import LOADING from "@/assets/icons/loading.png";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { set } from "react-hook-form";
function EditProject({ project }: any) {
  const {
    handleSaveProject,
    showSaveChanges,
    setShowSaveChanges,
    isEditing,
    setIsEditing,
    setProjectMembers,
    setProjectImages
  } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams, setIsEditing]);

  const handleEditState = async (e: any) => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsLoading(true);
    await handleSaveProject(project);
    router.push('/projects');
    router.refresh();
    setProjectMembers([]);
    setProjectImages([]);
    setIsLoading(false);
  };

  return (
    <div className="absolute right-[32px] top-[20px] z-[1]">
      <Button
        variant={"outline"}
        disabled={isLoading}
        className={cn(
          'w-[50px] py-[5px] px-[30px] bg-[#1e1e1e] rounded-[6px] shadow-lg border-[2px] border-[#4E4E4E] z-[2]',
          { "border-[#4E4E4E]": !isEditing },
          { "border-white": isEditing }

        )}
        onClick={(e) => {
          handleEditState(e);
        }}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <span className="text-white/80 font-semibold text-base">
            {isEditing ? "SAVE" : "EDIT"}
          </span>
        )}
      </Button>
    </div>
  );
}

export default EditProject;
