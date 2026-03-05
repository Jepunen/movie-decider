
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ChatMessage } from "@/types/chat";


function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ChatMessageItem({ message }: { message: ChatMessage }) {
    const { isOwn, senderName, text, timestamp } = message;

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}
        >
            {/* Sender label */}
            {!isOwn && (
                <span className="text-[0.65rem] text-muted-foreground pl-1 font-medium">
                    {senderName}
                </span>
            )}

            {/* Bubble */}
            <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug break-words whitespace-pre-wrap ${isOwn
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm border border-white/5"
                    }`}
            >
                {text}
            </div>

            {/* Timestamp */}
            <span className="text-[0.6rem] text-muted-foreground px-1">
                {formatTime(timestamp)}
            </span>
        </motion.div>
    );
}