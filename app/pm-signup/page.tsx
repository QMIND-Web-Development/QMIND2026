"use client";
import { Label } from "@/components/ui/label";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useGlobalContext } from "@/Context/store";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { checkPin } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<String | null>();
  const [email, setEmail] = useState<String | null>();
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const { user } = useGlobalContext();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = searchParams.get('access_token');

  useEffect(() => {
    const exchangeTokenForSession = async () => {
      if (accessToken) {
        const { data, error } = await supabase.auth.verifyOtp({ token_hash: accessToken, type: 'email' });

        if (error) {
          console.error("Error during session exchange:", error.message);
          setErrorMsg(error.message);
        } else {
          setAuthorized(true);
          setEmail(data.user!.email);
        }
      } else {
        setErrorMsg("are you in the right place?")
      }
      setLoading(false);
    }
    exchangeTokenForSession();
  }, [])

  useEffect(() => {
    if (user) {
      setAuthorized(true);
      setEmail(user.email);
    }
  }, [user])

  const handleSignup = async () => {
    setLoading(true);
  
    if (password !== passwordCheck) {
      setError(true);
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    } else if (password.length < 8) {
      setError(true);
      setErrorMsg("Make sure password is at least 8 characters long");
      setLoading(false);
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(true);
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user!.identities!.length) {
        setLoading(false);
        setIsOpen(true);
      } else {
        setError(true);
        setErrorMsg("This email has already been used to create an account.")
      }

      router.push('/');
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setError(true);
      setErrorMsg("something went wrong, please try again later");
      setLoading(false);
    }
  };
  

  return (
    <>
    { authorized ?
        <Container className="flex justify-center items-center pb-[70px]">
      <Card className="border-transparent md:border-white border-none p-0 m-0">
        <CardHeader>
          <div className="flex gap-[20px] items-center">
          {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                  hideCloseButton={true}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={(e) => router.push('/')}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="w-[auto] min-w-[300px] rounded-[.5rem]"
                >
                  <DialogHeader>
                    <DialogTitle className="text-3xl text-left">
                      Please Verify Your Email
                    </DialogTitle>
                    <DialogDescription className="text-xl text-left">
                      Verify your email before signing in!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-[100%] flex justify-center mt-[10px]">
                    <Button
                      className="px-[20px] w-full"
                      onClick={() => router.push('/')}
                    >
                      Go to Home
                    </Button>
                  </div>
                </DialogContent>
              </Dialog> */}
            <Image
              src={"/icons/qmind_logo.png"}
              height={34}
              width={20}
              alt="logo"
            />

            <CardTitle className="text-4xl">Project Manager Sign Up.</CardTitle>
          </div>
        </CardHeader>
          <CardContent>
            <div className="flex flex-col max-w-[500px] w-[80vw] items-center gap-[15px]">
              {/* <div className="w-full">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  defaultValue={email}
                  onChange={(e) => {
                    setError(false);
                    setEmail(e.target.value);
                  }}
                  required
                  className="w-[100%] min-h-[58px] text-lg"
                />
              </div> */}
              <div className="w-full">Set a password for <i>{email}</i></div>
              <div className="w-[100%]">
                <label htmlFor="password">Password:</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setError(false);
                    setPassword(e.target.value);
                  }}
                  required
                  className="w-[100%] min-h-[58px] text-lg"
                />
              </div>
              <div className="w-[100%]">
                <label htmlFor="confirm_password">Confirm Password:</label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="w-[100%] min-h-[58px] text-lg"
                  onChange={(e) => {
                    setError(false);
                    setPasswordCheck(e.target.value);
                  }}
                  value={passwordCheck}
                />
              </div>
              {error && (
                <p className="text-fail">
                  Error Registering Account.
                  <br />
                  {errorMsg}
                </p>
              )}
              <Button
                disabled={loading}
                onClick={() => handleSignup()}
                variant="outline"
                className="mt-[15px] w-fit px-[20px] text-lg py-[25px]"
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
      </Card>
      </Container>
      :
      <>
      { loading ? <></> : 
        <div className="flex flex-col h-[400px] justify-center items-center gap-[15px]">
          <h3>YOU ARE NOT AUTHORIZED!</h3>
          <h4>{errorMsg}</h4>
        </div>
      }
      </>
    }
    </>
  );
}
//76463