import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";

export default async function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white text-sm font-medium">
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </form>
  );
}
