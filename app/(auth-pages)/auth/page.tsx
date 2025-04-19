"use client";

import { AuthForm } from "./auth-form";
import { useSession } from "@/hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, isLoadingSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoadingSession) {
      router.push(`/${user.username}`);
    }
  }, [user, isLoadingSession, router]);

  // if (isLoadingSession) {
  //   return (
  //     <div className="min-h-screen bg-quokka-darker text-quokka-light flex items-center justify-center">
  //       <div className="flex flex-col items-center">
  //         <Loader2 className="w-8 h-8 animate-spin text-quokka-purple mb-4" />
  //         <p className="text-quokka-light/70">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-quokka-darker text-quokka-light flex items-center justify-center">
      {/* Simple decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-quokka-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-quokka-cyan/5 rounded-full blur-3xl"></div>

      {/* Auth form container */}
      <div className="flex items-center justify-center w-full">
        <AuthForm />
      </div>
    </div>
  );
}
