"use client";
import { Label } from "@/components/ui/label";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reset, setReset]=useState(false);
  const supabase = createClient();
  const router = useRouter();
 
  const sendResetPassword= async()=>{
    try {
      const {data: resetData, error} = await supabase
      .auth
      .resetPasswordForEmail(email,{
         redirectTo: `${window.location.origin}/reset`
      } )
      
      setSuccess(true)
    } catch (error) {
      console.log('error ', error);
    }
  }
  return (
    <Container className="flex justify-center items-center pb-[70px]">
      <Card className="border-transparent md:border-white border-none p-0 m-0">
        <CardHeader>
          <div className="flex gap-[20px] items-center">
            <Image
              src={"/icons/qmind_logo.png"}
              height={34}
              width={20}
              alt="logo"
            />

            <CardTitle className="text-4xl">Reset Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col max-w-[500px] w-[80vw] items-center gap-[15px]">
            <div className="w-full">
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-[100%] min-h-[58px] text-lg"
              />
            </div>
            
            {error && (
              <p className="text-fail">Invalid username</p>
            )}
            {success &&(
              <p className="text-success">Password reset link sent to your email!</p>
            )}
            <Button
              disabled={loading}
              onClick={sendResetPassword}
              variant="outline"
              className="mt-[15px] w-fit text-lg py-[20px] px-[20px]">
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
