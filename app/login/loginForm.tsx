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
  const [errorMsg, setErrorMsg] = useState("Invalid username or password")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(true);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
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

            <CardTitle className="text-4xl">Welcome Back.</CardTitle>
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
            <div className="w-[100%]">
              <label htmlFor="password">Password:</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-[100%] min-h-[58px] text-lg"
              />
            </div>
            {error && (
              <p className="text-fail">{errorMsg}</p>
            )}
            <Link
              // href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
              href="/forgotpassword"
              rel="noreferrer"
              className="text-[#387BFF] underline pt-[10px] lg:pt-[0] text-[20px] cursor-pointer hover:opacity-60"
            >
              Forgot Password?
            </Link>
            <Button
              disabled={loading}
              onClick={() => handleSignup()}
              variant="outline"
              className="mt-[15px] w-fit text-lg py-[20px] px-[20px]"
            >
              LOGIN
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
