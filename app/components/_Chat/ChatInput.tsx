"use client";

import React, { useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useChat } from "@/app/context/ChatContext";
import { SendIcon } from "./ChatIcons";

const MAX_LENGTH = 500;

interface ChatInputProps {
    roomCode: string;
}

function ChatInput({ roomCode }: ChatInputProps) {
    const { sendMessage } = useChat();
    const [text, setText] = useState("");

    const canSend = text.trim().length > 0 && text.length <= MAX_LENGTH;

    const submit = () => {
        if (!canSend) return;
        sendMessage(text, roomCode);
        setText("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        submit();
    };

    // Send on Enter, new line on Shift+Enter
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 px-3 py-3 border-t border-white/10"
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message…"
                maxLength={MAX_LENGTH}
                rows={1}
                className="flex-1 resize-none rounded-xl bg-muted border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/60 transition max-h-28 leading-snug"
                style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <motion.button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
                whileTap={{ scale: 0.92 }}
            >
                <SendIcon />
            </motion.button>
        </form>
    );
}

export default ChatInput;
