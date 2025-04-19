"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-quokka-darker text-white p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size={120} animateBorder={true} />
        </div>

        {/* Error message */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-gray-400 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-700 hover:bg-gray-800"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
