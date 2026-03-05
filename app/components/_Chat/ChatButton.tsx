"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/context/ChatContext";
import { ChatIcon } from "./ChatIcons";

interface ChatButtonProps {
    className?: string;
}

function ChatButton({ className = "" }: ChatButtonProps) {
    const { openChat, unreadCount } = useChat();

    return (
        <motion.button
            onClick={openChat}
            aria-label={`Open chat${unreadCount > 0 ? `, ${unreadCount} unread messages` : ""}`}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors ${className}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
        >
            <ChatIcon />

            {/* Unread badge */}
            <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.span
                        key="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center rounded-full bg-accent text-white text-sm font-bold leading-none"
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

export default ChatButton;
