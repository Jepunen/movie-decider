"use client";

/**
 * ChatContext — manages all real-time chat state for a room.
 *
 * ─── Socket contract (for the backend developer) ───────────────────────────
 *
 * CLIENT EMITS:
 *   event:   "chat-message"
 *   payload: { roomCode: string; senderName: string; text: string }
 *
 * SERVER SHOULD:
 *   1. Validate the payload (non-empty text, valid roomCode, etc.)
 *   2. Generate { id: uuid, senderId: socket.id, timestamp: Date.now() }
 *   3. Broadcast to the whole room (including the sender):
 *        io.to(roomCode).emit("chat-message", { id, senderId, senderName, text, timestamp })
 *
 * CLIENT LISTENS:
 *   event:   "chat-message"
 *   payload: { id: string; senderId: string; senderName: string; text: string; timestamp: number }
 *
 * ───────────────────────────────────────────────────────────────────────────
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { socket } from "@/app/socket";
import type { ChatMessage, ReceiveChatMessagePayload } from "@/types/chat";

const CHAT_NAME_STORAGE_KEY = "nextmovie_chat_name";

interface ChatContextType {
    /** All messages received in this session */
    messages: ChatMessage[];
    /** The display name the user chose for the chat */
    chatName: string | null;
    /** Set (and persist) the user's chat display name */
    setChatName: (name: string) => void;
    /** Whether the chat panel is currently open */
    isOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    /** Number of messages received while the panel was closed */
    unreadCount: number;
    /**
     * Send a message to the room.
     * Requires `roomCode` to be provided (the calling component reads it from SessionContext).
     */
    sendMessage: (text: string, roomCode: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // Lazy initializer reads localStorage once — no effect needed
    const [chatName, setChatNameState] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(CHAT_NAME_STORAGE_KEY) ?? null;
    });
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Track isOpen inside a ref so the socket handler always has the latest value
    // without needing to re-register.
    const isOpenRef = useRef(isOpen);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Register the socket listener once
    useEffect(() => {
        function onChatMessage(payload: ReceiveChatMessagePayload) {
            const message: ChatMessage = {
                ...payload,
                isOwn: payload.senderId === socket.id,
            };
            setMessages((prev) => [...prev, message]);
            if (!isOpenRef.current) {
                setUnreadCount((n) => n + 1);
            }
        }

        socket.on("chat-message", onChatMessage);
        return () => {
            socket.off("chat-message", onChatMessage);
        };
    }, []);

    const setChatName = useCallback((name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setChatNameState(trimmed);
        if (typeof window !== "undefined") {
            localStorage.setItem(CHAT_NAME_STORAGE_KEY, trimmed);
        }
    }, []);

    const openChat = useCallback(() => {
        setIsOpen(true);
        setUnreadCount(0);
    }, []);
    const closeChat = useCallback(() => setIsOpen(false), []);

    const sendMessage = useCallback(
        (text: string, roomCode: string) => {
            const trimmed = text.trim();
            if (!trimmed || !chatName || !roomCode) return;

            // Emit to the server — see contract at the top of this file
            socket.emit("chat-message", {
                roomCode,
                senderName: chatName,
                text: trimmed,
            });
        },
        [chatName],
    );

    return (
        <ChatContext.Provider
            value={{
                messages,
                chatName,
                setChatName,
                isOpen,
                openChat,
                closeChat,
                unreadCount,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within a ChatProvider");
    return ctx;
}
