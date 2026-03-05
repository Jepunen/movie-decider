"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/context/ChatContext";

function ChatIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

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
