"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Card } from "../ui/card";
import PLUS from "@/assets/icons/add-image.png";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import CLOSE from "@/assets/icons/Close.png";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/Context/store";

import './PhotoGallery.css'

function PhotoGallary({ project, images }: any) {
  const {
    projectImages,
    setProjectImages,
  } = useGlobalContext();
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [uploadImagesUrl, setUploadImagesUrl] = useState<any>([]);
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setProjectImages(images);
  }, [])

  const {isEditing} = useGlobalContext();
  const handleAddPhotos = (e: any) => {
    const curErrorMessages = [];
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpeg"];
    // @ts-ignore
    let curImages = files.filter((file) => allowedTypes.includes(file?.type));

    // Show error message if any invalid files are selected
    if (files.length !== curImages.length) {
      curErrorMessages.push("Only PNG and JPG files are allowed.");
    }

    // Remaining number of images allowed to be uploaded
    const remainingUploads =
      6 - projectImages.length - curImages.length;

    // Check if adding more files exceeds the limit of 6
    if (remainingUploads < 0) {
      curImages = curImages.filter(
        (_, i: any) =>
          i < 6 - projectImages.length - curImages.length
      );
      curErrorMessages.push(
        `You can only upload 6 images TOTAL to your project.`
      );
    }

    setErrorMessages(curErrorMessages);

    for (const image of curImages as any) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setUploadImages((prevImages:any) => [...prevImages, {"file":image, "publicUrl": e.target?.result}]);
      }
      reader.readAsDataURL(image);
    }
  };

  const removeUploadedImage = (imageIdx: any) => {
    setUploadImages((prevImages: any) =>
      prevImages.filter((image: any, i: any) => i !== imageIdx)
    );
  };

  const handleUploadImage = async () => {
    console.log("stupid function")
    setErrorMessages([]);
    setLoading(true);

    console.log(uploadImages)

    // Checks for spaces in file name
    for (let image of uploadImages) {
      if (image.file.name.includes(" ")) {
        alert("Can't have spaces in file name.");
        setLoading(false);
        return;
      }
      
      setProjectImages((images: any) => {
        return [
          ...images,
          image
        ]
      })
    }

    setShowUploadImage(false);
    setUploadImages([]);
    setLoading(false);
  };

  const handleDeleteImage = async (index: string) => {
    setLoading(true);

    if (projectImages[index].publicUrl.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`)) {
      const fileName = projectImages[index].publicUrl.split('projects/')[1];

      const newImages = projectImages.map((image: any) => {
        if (image != projectImages[index]) {
          return image.publicUrl.split('projects/')[1];
        }
        return false;
      });

      // Removing from the pathname from sql table
      const fileDeleteFromList = await supabase
        .from("projects")
        .update({
          projectImages: newImages,
        })
        .eq("id", project.id);

      if (fileDeleteFromList.error) {
        alert(`Error removing image name: ${fileDeleteFromList.error.message}`);
      }

      // Remove from bucket
      const fileDelete = await supabase.storage
        .from("projects")
        .remove([fileName]);

      if (fileDelete.error) {
        alert(`Error deleting image file: ${fileDelete.error.message}`);
      }
    }

    projectImages.splice(index, 1);
    setLoading(false);
  };

  const uploadRef = useRef(null);
  return (
    <div className="w-full">
      <div className="users-img-title">PHOTO & VIDEO GALLERY</div>
      <div className="users-img min-h-[256px]">
        {/* Add Project Image */}
        {isEditing && images.length <= 6 && (
          <Dialog open={showUploadImage} onOpenChange={setShowUploadImage}>
            <DialogTrigger>
              <Card className="min-w-[338px] min-h-[256px] xxs:w-[150px] rounded-[12px] border-[1.5px] border-[#4E4E4E] flex justify-center items-center cursor-pointer hover:scale-[1.01]">
                <Image src={PLUS} alt="add" height={30} width={30} />
              </Card>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload project Photos</DialogTitle>
              </DialogHeader>
              <Label htmlFor="image">Select images:</Label>
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
                  multiple
                  className="absolute invisible"
                  onChange={handleAddPhotos}
                  ref={uploadRef}
                />
                Upload Images
              </Button>

              {/* Uploaded Images List */}
              <div className="flex flex-col gap-[15px]">
                {uploadImages.map((image: any, key: any) => (
                  <div
                    className="flex gap-[10px] items-center justify-between "
                    key={key}
                  >
                    <Label>{image.file.name}</Label>
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

              {/* Error Message */}
              {errorMessages.map((errorMessage: any, key: any) => (
                <Label key={key} className="text-fail">
                  {errorMessage}
                </Label>
              ))}

              <Button
                disabled={uploadImages.length <= 0 || loading}
                onClick={handleUploadImage}
                className="yippediedoodlepoodle"
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

        {/* Project Images */}
        {projectImages.map((image: any, index: any) => (
          <>
            <div className="min-w-[338px] h-[256px] xxs:w-[150px] relative">
              <Image
                className=" rounded-[12px] border-[1.5px] border-[#4E4E4E] object-cover"
                src={image.publicUrl}
                alt="Project Image"
                fill
                unoptimized
              />
              {isEditing ? 
                <Button
                  variant={"destructive"}
                  className="absolute top-[-4px] right-[-4px] h-auto w-auto p-1"
                  onClick={() => handleDeleteImage(index)}
                >
                  <Image src={CLOSE} height={8} width={8} alt="delete" />
                </Button>
                :
                <></>
              }              
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallary;
