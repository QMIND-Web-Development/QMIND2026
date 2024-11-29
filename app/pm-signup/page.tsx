"use client";
import { Label } from "@/components/ui/label";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useGlobalContext } from "@/Context/store";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { checkPin } from "./actions";

export default function LoginPage({ searchParams }: any) {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const { user } =useGlobalContext();
  const supabase = createClient();
  const router = useRouter();


  useEffect(() => {
    
    if (user) {
      router.push('/'); 
    }
  }, [user, router]);

  const handleAuthorization = async () => {
    const check = await checkPin(pin);
    if (!check) {
      setError(true);
    } else if (check) {
      setAuthorized(true);
      setError(false);
    }
  }

  const handleSignup = async () => {
    setLoading(true);

    if (password !== passwordCheck) {
      alert("passwords incorrect");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `https://qmind.ca/verified`
      }
    });

    if (error) {
      setError(true);
      setLoading(false);
      console.log(error)
      return;
    }

    setLoading(false);
    setIsOpen(true);
    
  };

  return (
    <Container className="flex justify-center items-center pb-[70px]">
      <Card className="border-transparent md:border-white border-none p-0 m-0">
        <CardHeader>
          <div className="flex gap-[20px] items-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              </Dialog>
            <Image
              src={"/icons/qmind_logo.png"}
              height={34}
              width={20}
              alt="logo"
            />

            <CardTitle className="text-4xl">Project Manager Sign Up.</CardTitle>
          </div>
        </CardHeader>
        { authorized ?
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
                  onChange={(e) => {
                    setError(false);
                    setEmail(e.target.value);
                  }}
                  required
                  className="w-[100%] min-h-[58px] text-lg"
                />
              </div>
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
                <p className="text-destructive">
                  Error Registering Account.
                  <br />
                  Make sure password is at least 6 characters long
                </p>
              )}
              <Button
                disabled={loading}
                onClick={() => handleSignup()}
                className="mt-[15px] w-[100%] text-lg py-[25px]"
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
          :
          <CardContent>
            <div className="flex flex-col max-w-[500px] w-[80vw] items-center gap-[15px]">
            <>YOU ARE NOT AUTHORIZED!</>
              <div className="w-full">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter PM Pin"
                  defaultValue={pin}
                  onChange={(e) => {
                    setError(false);
                    setPin(e.target.value);
                  }}
                  required
                  className="w-[100%] min-h-[58px] text-lg"
                />
              </div>
              
              
              {error && (
                <p className="text-destructive">
                  wrong pin! are you sure you are a PM?
                </p>
              )}
              <Button
                disabled={loading}
                onClick={() => handleAuthorization()}
                className="mt-[15px] w-[100%] text-lg py-[25px]"
              >
                Gain Access
              </Button>
            </div>
        </CardContent>
        }
      </Card>
    </Container>
  );
}
//76463