"use client";

/**
 * ChatOverlay
 *
 * Rendered at the root layout level. Reads `roomCode` from SessionContext and
 * only mounts the chat UI when the user is inside a room.
 *
 * Layout:
 *   ChatButton — fixed, top-right corner (z-40, below dialogs at z-50)
 *   ChatPanel  — opens as an overlay when the button is clicked
 */

import React from "react";
import { useSession } from "@/app/context/SessionContext";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";

function ChatOverlay() {
    const { roomCode } = useSession();

    if (!roomCode) return null;

    return (
        <>
            {/* Fixed floating button — top-right corner */}
            <div className="fixed top-4 right-4 z-40">
                <ChatButton />
            </div>

            {/* Slide-in chat panel */}
            <ChatPanel roomCode={roomCode} />
        </>
    );
}

export default ChatOverlay;
