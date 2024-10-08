"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionEstablished, setSessionEstablished] = useState(false); // New state
  const searchParams = useSearchParams();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const exchangeTokenForSession = async () => {
      const accessToken = searchParams.get("access_token"); // Use this to get the access_token query parameter

      if (accessToken) {
        const { error } = await supabase.auth.exchangeCodeForSession(accessToken);

        // if (error) {
        //   console.error("Error during session exchange:", error.message);
        // } else {
        //   setSessionEstablished(true); // Session is established
        // }
      }
    };

    exchangeTokenForSession();
  }, [searchParams, supabase]);
  const confirmPasswords = async () => {
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }


    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
      setError(true);
    } else {
      alert("Password updated successfully!");
      router.push('/');
    }
    setLoading(false);
  };

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
            <CardTitle className="text-4xl">Enter your new password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col max-w-[500px] w-[80vw] items-center gap-[15px]">
            <div className="w-full">
              <Label htmlFor="email">New Password:</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-[100%] min-h-[58px] text-lg"
              />
            </div>
            <div className="w-[100%]">
              <label htmlFor="password">Confirm New Password:</label>
              <Input
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                placeholder="Confirm Password"
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-[100%] min-h-[58px] text-lg"
              />
            </div>
            {error && (
              <p className="text-destructive">{errorMsg}</p>
            )}
            <Button
              disabled={loading}
              onClick={confirmPasswords}
              className="mt-[15px] w-[100%] text-lg py-[25px]"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
