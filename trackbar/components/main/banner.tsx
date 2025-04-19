import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Loader from "../ui/loader"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

interface BannerProps {
    title?: string
    description?: string
    loginHref?: string
}

function Banner({
    title = "QUOKKA",
    description = "Level up your gaming experience! Track achievements, compete with friends, and unlock your full potential.",
    loginHref = "/auth",
}: BannerProps) {


    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />
    }

    console.log(user)

    return (
        <div className="relative h-screen w-full overflow-hidden bg-quokka-purple">
            <div className="absolute inset-0 bg-cover bg-center opacity-10"></div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="mb-8">
                    <Logo size={400} animateBorder />
                </div>
                <h1 className="mb-4 text-7xl font-bold tracking-wide text-quokka-cyan">{title}</h1>
                <p className="mb-8 max-w-2xl text-xl font-semibold text-quokka-light">{description}</p>
                <div className="space-x-4">
                    <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="bg-quokka-dark hover:bg-quokka-dark/80 text-quokka-light font-bold py-3 px-8 rounded-md"
                    >
                        <Link href={user ? `/${user?.username}` : loginHref}>
                            {user ? "My Profile" : "Login"}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Banner;
