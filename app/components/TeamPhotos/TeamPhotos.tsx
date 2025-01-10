"use client";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import PLUS from "@/assets/icons/add-image.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/Context/store";
import { Label } from "../ui/label";
import CLOSE from "@/assets/icons/Close.png";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function TeamPhotos({ project, members }: any) {
  const {
    memberErrorMessages,
    setMemberErrorMessages,
    projectMembers,
    setProjectMembers,
    isEditing,
  } = useGlobalContext();

  useEffect(() => {
    setProjectMembers(members);
  }, [])

  const [memberName, setMemberName] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberSocial, setMemberSocial] = useState("");
  const [memberSocialError, setMemberSocialError] = useState("");
  const [memberImage, setMemberImage] = useState<any>([]);
  const [memberImageUrl, setMemberImageUrl] = useState<any>([]);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAddPhoto = (e: any) => {
    const curErrorMessages = [];
    const files = Array.from(e.target.files); // Corrected to select all files
    const allowedTypes = ["image/png", "image/jpeg"];

    // Strip any spaces from file name
    // @ts-ignore
    if (files.length > 0 && files[0] && files[0].name.includes(" ")) {
      alert("Can't have spaces in file name.");
      return;
    }

    // @ts-ignore
    const curImages = files.filter((file) => allowedTypes.includes(file?.type));

    // Show error message if any invalid files are selected
    if (files.length !== curImages.length) {
      curErrorMessages.push("Only PNG and JPG files are allowed.");
    }

    if (curImages.length > 0) setMemberImage(curImages);

    const reader = new FileReader();
    reader.onload = function(e) {
      setMemberImageUrl(e.target?.result);
    }
    reader.readAsDataURL(curImages[0] as File);

    setMemberErrorMessages(curErrorMessages);
  };

  const removeUploadedImage = (imageIdx: any) => {
    setMemberImage((prevImages: any) =>
      prevImages.filter((_: any, i: any) => i !== imageIdx)
    );
  };

  const handleSubmitImage = async () => {
    setLoading(true);

    if (!memberSocial.includes("https://www.linkedin.com/") && 
        !memberSocial.includes("https://www.linkedin.com/") &&
        !memberSocial.includes("https://linkedin.com/") && 
        !memberSocial.includes("http://linkedin.com/")) {
      setMemberSocialError("Invalid LinkedIn URL");
      setLoading(false);
      return;
    }

    setMemberSocialError("");

    setProjectMembers((members: Array<any>) => {
      members.push(
        {
          "memberName": memberName,
          "memberPosition": memberPosition,
          "memberImage": memberImage[0],
          "memberImageUrl": memberImageUrl,
          "memberSocial": memberSocial,
          "projectId": project?.id,
        }
      );
      return members;
    });

    setMemberName("");
    setMemberPosition("");
    setMemberSocial("");
    setMemberImage([]);
    setIsOpenAddMember(false);
    setLoading(false);
  };

  const handleDeleteImage = async (member: any) => {
    setLoading(true);

    if (member.memberId) {
      const fileDeleteFromList = await supabase
        .from("teams")
        .delete()
        .eq("memberId", member.memberId);

      if (fileDeleteFromList.error) {
        alert(`Error removing member from team: ${fileDeleteFromList.error}`);
        setLoading(false);
      }

      const fileDeleteRes = await supabase.storage
        .from("teams")
        .remove([member.memberImage]);

      if (fileDeleteRes.error) {
        alert(`Error deleting image File: ${fileDeleteRes.error}`);
      }

      setLoading(false);
    }
    setProjectMembers((members: Array<any>) => {
      const index = members.indexOf(member);
      members.splice(index, 1);
      return members;
    })
  };

  const uploadRef = useRef(null);

  return (
    <div>
      <h4 className="text-[#6E6E6E] text-center md:text-left mb-2 font-bold">
        Contributing Team - Click to connect!
      </h4>

      {/* Project Member photos */}
      <div className="flex flex-wrap justify-start gap-[10px] min-h-[100px]">
        {isEditing && (
          <Dialog open={isOpenAddMember} onOpenChange={setIsOpenAddMember}>
            <DialogTrigger className="self-start">
              <Card className="min-h-[100px] w-[100px] max-w-[100px] rounded-[12px] border-[1.5px] border-[#4E4E4E] flex justify-center items-center cursor-pointer hover:scale-[1.01]">
                <Image src={PLUS} alt="add" height={30} width={30} />
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <Button
                variant={"outline"}
                className="relative"
                onClick={() => {
                  // @ts-ignore
                  if (uploadRef) uploadRef?.current?.click();
                }}
              >
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="absolute invisible"
                  onChange={handleAddPhoto}
                  ref={uploadRef}
                />
                Upload Image
              </Button>

              {/* Uploaded Images */}
              <div className="flex flex-col gap-[15px]">
                {memberImage &&
                  memberImage.map((image: any, key: any) => (
                    <div
                      className="flex gap-[10px] items-center justify-between "
                      key={key}
                    >
                      <Label>{image?.name}</Label>
                      <Button
                        variant={"outline"}
                        className="p-[10px] flex h-auto"
                        onClick={() => {
                          removeUploadedImage(key);
                        }}
                      >
                        <Image src={CLOSE} height={6} width={6} alt="close" />
                      </Button>
                    </div>
                  ))}
              </div>

              <Input
                placeholder="Name"
                maxLength={25}
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
              <Input
                placeholder="Position"
                maxLength={25}
                value={memberPosition}
                onChange={(e) => setMemberPosition(e.target.value)}
              />
              <Input
                placeholder="LinkedIn Url"
                maxLength={50}
                value={memberSocial}
                onChange={(e) => setMemberSocial(e.target.value)}
                className={cn(memberSocialError && "border-red-500")}
              />
              <p className="text-fail text-sm">{memberSocialError}</p>

              <Button
                onClick={() => handleSubmitImage()}
                disabled={loading || memberImage.length <= 0}
              >
                {loading ? (
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
                      stroke="#202020"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="#202020"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        )}

        {projectMembers &&
          projectMembers.map((member: any, index: any) => {
            return (
            <>
              <div className=" flex flex-col justify-center items-center min-h-[150px] min-w-[100px] relative">
                <div className="relative h-full w-full">
                  <Link
                    href={member.memberSocial || ""}
                    target="_blank"
                    key={index}
                    className={` `}
                    onClick={(e) => isEditing && e.preventDefault()}
                  >
                    <Image
                      src={member.memberImageUrl}
                      fill
                      alt="image"
                      className="object-cover rounded-[10px] shadow-lg"
                      unoptimized
                    />
                  </Link>
                </div>
                <div className="mt-[5px] text-center">
                  <p className="text-[13px] font-bold">{member.memberName}</p>
                  <p className="text-[12px] font-light">{member.memberPosition}</p>
                </div>
                {isEditing && (
                  <Button
                    variant={"destructive"}
                    className="absolute top-[-8px] right-[-8px] h-auto w-auto p-1"
                    onClick={() => {
                      handleDeleteImage(member);
                    }}
                  >
                    <Image src={CLOSE} height={8} width={8} alt="delete" />
                  </Button>
                )}
              </div>
            </>
          )})}
      </div>
    </div>
  );
}

export default TeamPhotos;
