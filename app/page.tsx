"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import HomePage from "./components/HomePage";
import { RemoveScroll } from "react-remove-scroll";
import WaitingPage from "./components/WaitingPage";

type Screen = "home" | "create" | "join" | "waiting" | "review" | "results";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [roomCode, setRoomCode] = useState<string>("");

  const handleNavigate = (screen: Screen, code?: string) => {
    setCurrentScreen(screen);
    if (code) setRoomCode(code);
  };

  // hande weboscket connection via socket.io
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport => {
        setTransport(transport.name)
      }))
    }

    function onDisconnect() {
      setIsConnected(false)
      setTransport("N/A")
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    };
  }, [])

  return (
    <RemoveScroll>
      <div className="min-h-screen bg-primary p-4">
        {currentScreen === "home" && (
          <HomePage onNavigate={handleNavigate} />
        )}
        {currentScreen === "waiting" && (
          <WaitingPage />
        )}
      </div>
    </RemoveScroll >
  );
}
