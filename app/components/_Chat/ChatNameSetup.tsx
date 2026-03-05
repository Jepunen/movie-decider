"use client";

import React, { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useChat } from "@/app/context/ChatContext";

function ChatNameSetup() {
    const { setChatName } = useChat();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) {
            setError("Please enter a name.");
            return;
        }
        if (trimmed.length > 20) {
            setError("Name must be 20 characters or fewer.");
            return;
        }
        setChatName(trimmed);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full px-6 gap-6 text-center"
        >
            {/* Chat bubble illustration */}
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-primary"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            <div>
                <h2 className="text-lg font-bold text-foreground">Join the chat</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Choose a display name visible to others in the chat room.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="Your name…"
                        maxLength={20}
                        autoFocus
                        className="w-full rounded-xl bg-muted border border-white/10 px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/60 transition"
                    />
                    {error && (
                        <p className="text-xs text-accent text-left pl-1">{error}</p>
                    )}
                </div>

                <motion.button
                    type="submit"
                    className="w-full rounded-xl bg-linear-to-r from-primary via-purple-500 to-pink-500 text-white font-bold py-3 text-sm shadow-lg shadow-primary/25 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Enter chat
                </motion.button>
            </form>
        </motion.div>
    );
}

export default ChatNameSetup;
