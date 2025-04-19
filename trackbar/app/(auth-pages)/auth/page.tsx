import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "./auth-form";
import type { Message } from "@/components/form-message";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Message;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${user.user_metadata.username}`);
  }

  return (
    <div className="min-h-screen bg-quokka-darker text-quokka-light flex items-center justify-center">
      {/* Simple decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-quokka-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-quokka-cyan/5 rounded-full blur-3xl"></div>
      
      {/* Auth form container */}
      <div className="flex items-center justify-center w-full">
        <AuthForm searchParams={searchParams} />
      </div>
    </div>
  );
}
