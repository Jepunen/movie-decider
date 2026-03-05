"use client";

import React, { Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { useChat } from "@/app/context/ChatContext";
import ChatNameSetup from "./ChatNameSetup";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

function CloseIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

interface ChatPanelProps {
    roomCode: string;
}

function ChatPanel({ roomCode }: ChatPanelProps) {
    const { isOpen, closeChat, chatName, messages } = useChat();

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeChat}>
                {/* Dim backdrop (subtle — chat shouldn't block everything) */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40" />
                </TransitionChild>

                {/* Panel container — anchored bottom-right on desktop, full-width on mobile */}
                <div className="fixed inset-0 flex items-end justify-end sm:items-end sm:justify-end p-0 sm:p-4 pointer-events-none">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-250"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel className="pointer-events-auto w-full sm:w-96 h-[70dvh] sm:h-130 flex flex-col rounded-t-2xl sm:rounded-2xl bg-background border border-white/10 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <DialogTitle as="h2" className="text-sm font-bold text-foreground">
                                        Room chat
                                    </DialogTitle>
                                    {chatName && (
                                        <span className="text-xs text-muted-foreground">
                                            — {chatName}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={closeChat}
                                    aria-label="Close chat"
                                    className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            {/* Body */}
                            {!chatName ? (
                                <ChatNameSetup />
                            ) : (
                                <>
                                    <ChatMessageList messages={messages} />
                                    <ChatInput roomCode={roomCode} />
                                </>
                            )}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ChatPanel;
