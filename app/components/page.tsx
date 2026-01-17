import React from "react";
import HelloWorld from "./HelloWorld";
import Button from "./Button";

const ComponentsPage = () => {
    return (
        <div>
            <h2 className="text-accent text-center">Components Page</h2>
            <div className="flex flex-col items-center gap-4 m-4">
                <HelloWorld />
                <Button>
                    Test clicking!
                </Button>
            </div>
        </div>
    );
};

export default ComponentsPage;