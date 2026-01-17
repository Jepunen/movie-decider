import React from "react";
import HelloWorld from "./HelloWorld";
import Button from "./Button";
import Header from "./Header";
import Reviews from "./Reviews";

const ComponentsPage = () => {
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
            </div>
        </div>
    );
};

export default ComponentsPage;