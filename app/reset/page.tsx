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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ResetPasswordForm() {
  const [loadError, setLoadError] = useState<boolean | null>();
  const [loadErrorMsg, setLoadErrorMsg] = useState<String | null>();
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); // State for success message
  const searchParams = useSearchParams();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const exchangeTokenForSession = async () => {
      const accessToken = searchParams.get("access_token");

      if (accessToken) {
        const { error } = await supabase.auth.exchangeCodeForSession(accessToken);

        if (error) {
          console.error("Error during session exchange:", error.message);
        }
      }

      const error = searchParams.get("error");

      if (error) {
        const errorDesc = searchParams.get("error_description");
        setLoadErrorMsg(errorDesc);
        setLoadError(true);
      }
    };

    exchangeTokenForSession();
  }, [searchParams, supabase]);

  const confirmPasswords = async () => {
    if (password !== confirmPassword) {
      setSubmitErrorMsg("Passwords do not match");
      setSubmitError(true);
      return;
    }

    setLoading(true);
    setSubmitError(false);
    setSuccessMsg("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setSubmitErrorMsg(error.message);
      setSubmitError(true);
    } else {
      setSuccessMsg("Password updated successfully!");
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <Container className="flex justify-center items-center pb-[70px]">
      <Card className="border-transparent md:border-white border-none p-0 m-0">
        { !loadError ?
        <>
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

        
            {submitError && (
              <p className="text-fail">{submitErrorMsg}</p>
            )}

            <Button
              disabled={loading}
              onClick={confirmPasswords}
              variant="outline"
              className="mt-[15px] w-[100%] text-lg py-[25px]"
            >
              Confirm
            </Button>

            <Dialog open={success}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      {successMsg}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => router.push('/login')}>Continue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
        </CardContent>
        </>
        : 
        <>
        <CardHeader>
          <div className="flex gap-[20px] items-center">
            <Image
              src={"/icons/qmind_logo.png"}
              height={34}
              width={20}
              alt="logo"
            />
            <CardTitle className="text-4xl">{loadErrorMsg}</CardTitle>
          </div>
        </CardHeader>
        </>
        }
        
      </Card>
    </Container>
  );
}
