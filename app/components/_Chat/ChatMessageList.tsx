"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types/chat";
import ChatMessageItem from "./ChatMessageItem";

interface ChatMessageListProps {
    messages: ChatMessage[];
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
