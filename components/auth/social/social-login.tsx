"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle, FaApple } from "react-icons/fa";
import { SOCIAL_LOGIN_PROVIDERS } from "../utils/constants";

export function SocialLogin() {
  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("Google")}
          className="w-full"
        >
          <FaGoogle className="w-5 h-5 mr-2" />
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("Apple")}
          className="w-full"
        >
          <FaApple className="w-5 h-5 mr-2" />
          Apple
        </Button>
      </div>
    </div>
  );
}
