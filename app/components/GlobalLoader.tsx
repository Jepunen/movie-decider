"use client";

import { useSession } from "@/app/context/SessionContext";

export default function GlobalLoader() {
    const { isLoading } = useSession();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    );
}
