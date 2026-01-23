"use client";

import React, { useState } from "react";
import HelloWorld from "./HelloWorld";
import Button from "./Button";
import Header from "./Header";
import Reviews from "./Reviews";
import RoomCode from "./RoomCode";
import StatusImage from "@/app/components/StatusImage";
import PillButtonGroup from "./PillButtonGroup";

const ComponentsPage = () => {
    const [guestCode, setGuestCode] = useState("");
    const [selected, setSelected] = useState('action');

    return (
        <div className="bg-primary">
            <h2 className="text-accent text-center">Components Page</h2>
            <div className="flex flex-col items-center gap-4 m-4">
                <Header />
                <HelloWorld />
                <Button>
                    Test clicking!
                </Button>
                <Reviews IMDBRating="8.5/10" RottenTomatoesRating="95%" MetacriticRating="88" />
                <RoomCode isHost={true} code="123456" />
                <RoomCode isHost={false} code={guestCode} onCodeChange={(code) => setGuestCode(code)} />
                <StatusImage status={'default'} />
                <StatusImage status={'hosting'} />
                <StatusImage status={'waiting'} />
                <StatusImage status={'joining'} />
                <StatusImage status={'setting'} />
                <PillButtonGroup
                    options={[
                        { label: 'Action', value: 'action' },
                        { label: 'Comedy', value: 'comedy' },
                        { label: 'Drama', value: 'drama' },
                    ]}
                    value={selected}
                    onChange={setSelected}
                />
            </div>
        </div>
    );
};

export default ComponentsPage;