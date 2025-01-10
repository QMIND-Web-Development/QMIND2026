"use client";

import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

interface ContextProps {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  projects: any[];
  setProjects: Dispatch<SetStateAction<any>>;
  navOn: Boolean;
  setNavOn: Dispatch<SetStateAction<any>>;
  loading: Boolean;
  setLoading: Dispatch<SetStateAction<any>>;
  isEditing: Boolean;
  setIsEditing: Dispatch<SetStateAction<any>>;
  githubUrl: string;
  setGithubUrl: Dispatch<SetStateAction<any>>;
}

const GlobalContext = createContext<any>({
  user: {},
  setUser: () => {},
  projects: [],
  setProjects: () => {},
  navOn: false,
  setNavOn: () => {},
  loading: false,
  setLoading: () => {},
  isEditing: false,
  setIsEditing: () => {},
  githubUrl: "",
  setGithubUrl: () => {},
  tags: [],
  setTags: () => {},
  tagName: "",
  setTagNames: () => {},
  showUpdateTag: -1,
  setShowUpdateTag: () => {},
  showAddTag: false,
  setShowAddTag: () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [user, setUser] = useState();
  const [projects, setProjects] = useState([]);
  const [navOn, setNavOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [tags, setTags] = useState();
  const [tagName, setTagName] = useState("");
  const [showUpdateTag, setShowUpdateTag] = useState(-1);
  const [showAddTag, setShowAddTag] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [impactDescription, setImpactDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [showSaveChanges, setShowSaveChanges] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [memberErrorMessages, setMemberErrorMessages] = useState([]);
  const [category, setCategory] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);
  const [projectImages, setProjectImages] = useState([]);
  const [published, setPublished] = useState(false);
  const [navLoading, setNavLoading] = useState(true);
  const [errors, setErrors] = useState({
    projectTitle: false,
    category: false,
    tags: false,
    shortDescription: false,
    impactDescription: false,
    fullDescription: false,
  });

  const supabase = createClient();

  const handleSaveProject = async (project:any) => {
    
    const newErrors = {
      projectTitle: projectTitle.replaceAll(" ", "") === "",
      category: category.replaceAll(" ", "") === "",
      tags: !tags,
      shortDescription: shortDescription.replaceAll(" ", "") === "",
      impactDescription: impactDescription.replaceAll(" ", "") === "",
      fullDescription: fullDescription.replaceAll(" ", "") === "",
      githubUrl: githubUrl.replaceAll(" ", "") === "" || !githubUrl.startsWith("https://github.com/"),
    };
  
    setErrors(newErrors);
  
    if (Object.values(newErrors).some((error) => error)) {
      return false;
    }

    const { data, error } = await supabase
      .from("projects")
      .upsert({
        ...project,
        projectTitle,
        category,
        tags,
        githubUrl,
        shortDescription,
        impactDescription,
        fullDescription,
        published,
        setPublished,
      })
      .select();

    for (const member of projectMembers as any) {
      if (!member.memberId) {
        const userUpload = await supabase.from("teams").upsert({
          "memberName": member.memberName,
          "memberPosition": member.memberPosition,
          "memberImage": member.memberImage.name,
          "memberSocial": member.memberSocial,
          "projectId": member.projectId,
        });
  
        if (userUpload.error) {
          alert(`Member Add failed: ${userUpload.error.message}`);
          setLoading(false);
          return false;
        }
  
        const fileUpload = await supabase.storage
        .from("teams")
        .upload(member.memberImage.name, member.memberImage);

        if (fileUpload.error) {
          alert(`Error saving image to storage ${fileUpload.error.message}`);
          setLoading(false);
          return false;
        }
      }
    }

    console.log(projectImages)

    for (let image of projectImages as any) {
      if (!image.publicUrl.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`)) {
        const fileUpload = await supabase.storage
          .from("projects")
          .upload(`project_images/${image.file.name}`, image.file);

        if (fileUpload.error) {
          // @ts-ignore
          if (fileUpload?.error?.statusCode !== "409") {
            alert("Error Uploading " + image.name);
            return false;
          } else {
            console.log("duplicated image, using existing version")
          }
        }
      }
    }

    let filteredImages = projectImages.map((image: any) => {
      if (image.publicUrl.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`)) {
        return image.publicUrl.split('/projects/')[1];
      } else {
        return `project_images/${image.file.name}`;
      }
    });

    const projectUpload = await supabase
      .from("projects")
      .update({ projectImages: filteredImages })
      .eq("id", project.id);

    if (projectUpload.error) {
      alert(`Error Uploading Image File, ${projectUpload.error.message}`);
      return false;
    }

    setIsEditing(false);
    return true;
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        projects,
        setProjects,
        navOn,
        setNavOn,
        loading,
        setLoading,
        isEditing,
        setIsEditing,
        githubUrl,
        setGithubUrl,
        tags,
        setTags,
        tagName,
        setTagName,
        showUpdateTag,
        setShowUpdateTag,
        showAddTag,
        setShowAddTag,
        shortDescription,
        setShortDescription,
        impactDescription,
        setImpactDescription,
        fullDescription,
        setFullDescription,
        showSaveChanges,
        setShowSaveChanges,
        handleSaveProject,
        projectTitle,
        setProjectTitle,
        category,
        setCategory,
        memberErrorMessages,
        setMemberErrorMessages,
        projectMembers,
        setProjectMembers,
        projectImages,
        setProjectImages,
        published,
        setPublished,
        navLoading,
        setNavLoading,
        errors,
        setErrors,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
