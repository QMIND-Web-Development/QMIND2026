"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

function AddProject() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAddProject = async () => {
    setLoading(true);

    const userRes = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("projects")
      .insert({ 
        pmEmail: userRes?.data?.user?.email || "No_Email",
        published: true
      })
      .select();

    if (error) {
      alert("Failed to create new project");
      setLoading(false);
      return;
    }

    const newProjectId = data[0].id;
    setLoading(false);

    router.push(`/project/${newProjectId}?edit=true`);
  };

  return (
    <Button
      className="w-fit bg-[#f0b542] text-black hover:bg-[#d99a3a] hover:text-black hover:scale-105 transition-all duration-200"
      variant={"outline"}
      disabled={loading}
      onClick={() => handleAddProject()}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="black"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="black"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 1 24 24"
              width="16"
              height="16"
              style={{ marginRight: '4px' }}
            >
              <path d="M12 5v14m-7-7h14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Project
        </>
      )}
    </Button>
  );
}

export default AddProject;
