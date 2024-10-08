"use client";

import Container from "@/components/Container";
import Image from "next/image";

export default function Verified() {

  return (
    <Container className="flex justify-center items-center pt-[100px] text-center">
      <Image
          src={"/icons/qmind_logo.png"}
          height={50}
          width={36}
          alt="logo"
        />
      <p className="h3-styles">Your account is now verified and you should be logged in. If not, please login using the Login button above.</p>
    </Container>
  );
}
//76463