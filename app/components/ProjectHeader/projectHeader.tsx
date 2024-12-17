"use client";
import React, { useEffect } from "react";
import { kontrapunkt } from "../../font";
import { useGlobalContext } from "@/Context/store";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

function ProjectHeader({ project }: any) {
  const {
    isEditing,
    projectTitle,
    setProjectTitle,
    category,
    setCategory,
    published,
    setPublished,
  } = useGlobalContext();

  useEffect(() => {
    setProjectTitle(project.projectTitle);
    setCategory(project.category);
    setPublished(project.published);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  return (
    <>
      {isEditing && (
        <div className="w-full flex justify-left items-center gap-[15px] pb-[40px] mb-[20]">
          <Label htmlFor="publish" className="text-lg w-[100px]">
            {published ? "Published" : "Unpublished"}
          </Label>
          <Switch
            checked={published}
            onClick={() => setPublished(!published)}
            id="publish"
            className="border-[1px] border-white"
          />
        </div>
      )}
      <div className="users-title flex flex-col lg:flex-row gap-[5px] lg:gap-[20px] mb-[20px] lg:mb-0">
        {!isEditing ? (
          <h1
            className={`${kontrapunkt.className} !text-xl md:!text-4xl self-start`}
          >
            {projectTitle}
          </h1>
        ) : (
          <div className="w-full">
            <Input
              className={`!text-xl md:!text-4xl ${kontrapunkt.className}`}
              placeholder="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              maxLength={56}
            />
          </div>
        )}

        {!isEditing ? (
          <p className="min-w-fit self-start relative top-[5px]">{category}</p>
        ) : (
          <div className="w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">{category || "Node Type"}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black">
                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                  <DropdownMenuRadioItem value="Innovation">Innovation</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Consulting">Consulting</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="DAIR">DAIR</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Disruptive Tech">Disruptive Tech</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="AI Ethics">AI Ethics</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectHeader;
