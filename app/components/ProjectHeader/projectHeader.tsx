"use client";
import React, { useEffect } from "react";
import { kontrapunkt } from "../../font";
import { useGlobalContext } from "@/Context/store";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
function ProjectHeader({ project }: any) {
  const {
    isEditing,
    projectTitle,
    setProjectTitle,
    category,
    setCategory,
    published,
    setPublished,
    year,
    setYear,
    errors,
  } = useGlobalContext();

  useEffect(() => {
    setProjectTitle(project.projectTitle);
    setCategory(project.category);
    setPublished(project.published);
    setYear(project.year || "");
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
              className={cn(
                "!text-xl md:!text-4xl",
                errors.projectTitle && "border-red-500"
              )}
              style={errors.projectTitle ? { boxShadow: "0 0 5px red" } : {}}
              placeholder="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              maxLength={56}
            />
            {errors.projectTitle && (
              <p className="text-red-500 text-sm">Project title is required</p>
            )}
          </div>
        )}

        <div className="flex gap-2 items-start">
          {!isEditing ? (
            <div className="flex gap-2">
              <p className="min-w-fit self-start relative top-[5px]">{category}</p>
              <p className="min-w-fit self-start relative top-[5px]">{year}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline" className={errors.category ? "border-red-500" : ""} style={errors.category ? { boxShadow: "0 0 5px red" } : {}}>
                      {category || "Node Type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background opacity-[100%]">
                    <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                      <DropdownMenuRadioItem value="Innovation">Innovation</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Consulting">Consulting</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="DAIR">DAIR</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Disruptive Tech">Disruptive Tech</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="AI Ethics">AI Ethics</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.category && (
                  <p className="text-red-500 text-sm">Category is required</p>
                )}
              </div>
              
              <div className="w-[100px]">
                <Input
                  type="number"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min={2000}
                  max={new Date().getFullYear()}
                  className={cn(
                    "h-10 text-[16px]",
                    errors.year && "border-red-500"
                  )}
                  style={errors.year ? { boxShadow: "0 0 5px red" } : {}}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm">Valid year required</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectHeader;
