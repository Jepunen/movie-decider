"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import HomePage from "./components/HomePage";
import CreatePage from "./components/CreatePage";
import { RemoveScroll } from "react-remove-scroll";
import WaitingPage from "./components/WaitingPage";
import JoinPage from "./components/JoinPage";
import BackButton from "./components/BackButton";
import VotingPage from "./components/VotingPage";
import { Movie } from "@/types/movies";

type Screen = "home" | "create" | "join" | "waiting" | "review" | "results";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [roomCode, setRoomCode] = useState<string>("");


  // TODO: Implement movie fetching and passing to VotingPage after user starts the game from hosts CreatePage

  const handleNavigate = (screen: Screen, code?: string) => {
    setCurrentScreen(screen);
    if (code) setRoomCode(code);
  };

  // Handle websocket connection via socket.io
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  //! THIS IS A TEMPORARY MOCKUP FOR TESTING PURPOSES ONLY
  // TODO: Replace with actual API call to fetch movies when starting the game
  const sampleMovies: Movie[] = [
    {
      title: "Avatar: Fire and Ash",
      description: "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
      poster_url: "https://image.tmdb.org/t/p/w200/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg",
      release_date: "2025-12-17",
      runtime: "162",
      genres: [12, 878, 18],
      imdb_id: "tt1630029",
      imdb_url: "https://www.imdb.com/title/tt1630029/",
      ratings: [
        { Source: "Internet Movie Database", Value: "8.5" },
        { Source: "Rotten Tomatoes", Value: "92%" },
        { Source: "Metacritic", Value: "85" },
      ],
      language: "en",
      director: "James Cameron",
      actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    },
    {
      title: "The Grand Budapest Hotel",
      description: "A whimsical tale of a legendary concierge at a famous European hotel between the wars and his friendship with a young employee.",
      poster_url: null,
      release_date: "2014-03-28",
      runtime: "99",
      genres: [35, 18],
      imdb_id: "tt2278388",
      imdb_url: "https://www.imdb.com/title/tt2278388/",
      ratings: [
        { Source: "Internet Movie Database", Value: "8.1" },
        { Source: "Rotten Tomatoes", Value: "91%" },
        { Source: "Metacritic", Value: "88" },
      ],
      language: "en",
      director: "Wes Anderson",
      actors: "Ralph Fiennes, F. Murray Abraham, Mathieu Amalric",
    },
    {
      title: "Inception",
      description: "A thief who enters the dreams of others to steal secrets from their subconscious is given a chance to have his criminal history erased.",
      poster_url: null,
      release_date: "2010-07-16",
      runtime: "148",
      genres: [28, 878, 12],
      imdb_id: "tt1375666",
      imdb_url: "https://www.imdb.com/title/tt1375666/",
      ratings: [
        { Source: "Internet Movie Database", Value: "8.8" },
        { Source: "Rotten Tomatoes", Value: "87%" },
        { Source: "Metacritic", Value: "74" },
      ],
      language: "en",
      director: "Christopher Nolan",
      actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
    },
  ];


  return (
    <RemoveScroll>
      <div className="relative min-h-screen bg-primary p-4">
        {currentScreen === "home" && <HomePage onNavigate={handleNavigate} />}
        {currentScreen === "join" && <JoinPage onNavigate={handleNavigate} />}
        {currentScreen === "create" && (
          <CreatePage onNavigate={handleNavigate} />
        )}
        {currentScreen === "waiting" && <WaitingPage />}
        {currentScreen === "review" && <VotingPage movies={sampleMovies} onNavigate={handleNavigate} />}
      </div>
    </RemoveScroll>
  );
}
