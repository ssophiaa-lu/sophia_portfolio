import { useState } from "react";
import ContentPanel from "./ContentPanel.jsx";
import ThreeScene from "./ThreeScene.jsx";

const panelContent = {
    About_Sign: {
        type: "blurb",
        title: "About",
        body: "hi, i'm sophia. i go to Rutgers, New Brunswick and i'm studying computer science and data science!"

    },
    Start_Sign: {
        type: "blurb",
        title: "Start",
        body: "welcome to my site! you can move around using W, A, S, D on your keyboard :) "
    },
    End_Sign: {
        type: "blurb",
        title: "End",
        body: "curious how i made this portfolio? i used the Blender software to create all assets by hand! from there, i used React and Three.js to wire everything together. if you're interested in learning 3D modeling, this is the tutorial i used: . i hope you have a great day and thanks for visiting :) "
    },
    Experience_Sign: {
        type: "cards",
        title: "Experience",
        items: [
            {
                title: "Software Engineering Intern",
                meta: "Fiserv | June 2026 - August 2026",
                description: "desc"
            }
        ]
    },
    Projects_Sign: {
        type: "cards",
        title: "Projects",
        items: [
            {
                title: "Clinical Pipeline",
                meta: "Data project",
                description: "A project for working with clinical data.",
                link: "https://github.com/ssophiaa-lu/clinical-pipeline"
            },
            {
                title: "Time Sheet Tracker",
                meta: "Web project",
                description: "A project for tracking time entries.",
                link: "https://github.com/ssophiaa-lu/time-sheet-tracker"
            }
        ]
    }
};

export default function App() {
    const [activePanel, setActivePanel] = useState(null);

    function handleObjectClick(objectName) {
        if (panelContent[objectName]) {
            setActivePanel(panelContent[objectName]);
        }
    }

    return (
        <main>
            <ThreeScene onObjectClick={handleObjectClick} />
            <ContentPanel content={activePanel} onClose={() => setActivePanel(null)} />
        </main>
    );
}
