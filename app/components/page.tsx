import React from "react";
import HelloWorld from "./HelloWorld";

const ComponentsPage = () => {
    return (
        <div>
            <h2 className="text-accent text-center">Components Page</h2>
            <div className="flex flex-col items-center gap-4">
                <HelloWorld />
            </div>
        </div>
    );
};

export default ComponentsPage;