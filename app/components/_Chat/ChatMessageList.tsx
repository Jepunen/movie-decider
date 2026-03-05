"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageListProps {
    messages: ChatMessage[];
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
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
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug ${isOwn
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

function ChatMessageList({ messages }: ChatMessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever a new message arrives
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center px-4">
                    No messages yet. Say hello! 👋
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth">
            <AnimatePresence initial={false}>
                {messages.map((msg) => (
                    <ChatMessageItem key={msg.id} message={msg} />
                ))}
            </AnimatePresence>
            <div ref={bottomRef} />
        </div>
    );
}

export default ChatMessageList;
