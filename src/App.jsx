import { useEffect, useState } from "react";
import ContentPanel from "./ContentPanel.jsx";
import ThreeScene from "./ThreeScene.jsx";

// Path relative to public/. Change this to use a different MP3.
const backgroundMusicFile = "sounds/music_zapsplat_banana_tree.mp3";

const panelContent = {
    About_Sign: {
        type: "blurb",
        title: "About",
        body: "hi, i'm sophia. i go to Rutgers, New Brunswick and i'm studying computer science and data science. in my free time, i like to 3D model and try new cafe spots!"

    },
    Start_Sign: {
        type: "blurb",
        title: "Start",
        body: "welcome to my site! you can move around using the arrow keys or W, A, S, D on your keyboard :) "
    },
    End_Sign: {
        type: "blurb",
        title: "End",
        body: "curious how i made this portfolio? i used the Blender software to create all assets by hand! from there, i used React and Three.js to wire everything together. if you're interested in learning 3D modeling, check out Andrew Woan on YouTube! \n\ni hope you have a great day and thanks for visiting :) \n\n credits: music and sound effects are from zapslat.com"
    },
    Experience_Sign: {
        type: "cards",
        descriptionClassName: "experience-description",
        title: "Experience",
        items: [
            {
                title: "Software Engineering Intern",
                meta: "Fiserv | June 2026 - August 2026",
                description: "refactored a shared Spring Boot library used across 17 microservices in Docker and Azure environments, leveraging Codex to identify edge cases and accelerate JUnit test development, increasing coverage by 26%. enabled direct service-to-service communication in Azure Kubernetes Service, removing ingress routing and credential dependencies. integrated grafana k6 load tests into Harness CI/CD, giving engineers a reliable way to evaluate microservice health."
            },
            {
                title: "Break Through Tech AI Fellow",
                meta: "Cornell Tech, Microsoft | May 2025 - Present",
                description: "selected from 4,000+ applicants to complete a year-long program focused on agentic ai and machine learning. as part of the program, developing an end-to-end python ML pipeline with Microsoft to estimate systolic and diastolic blood pressure from PPG signals, including preprocessing physiological datasets with Python, Numpy, and Pandas, and evaluating regression models using MAE, RMSE, R², and feature-importance analysis."
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

    useEffect(() => {
        const music = new Audio(`${import.meta.env.BASE_URL}${backgroundMusicFile}`);
        music.loop = true;
        music.volume = 0.8;
        let disposed = false;

        function removeStartListeners() {
            window.removeEventListener("click", startMusic);
            window.removeEventListener("keydown", startMusic);
        }

        function startMusic() {
            music.play().then(removeStartListeners).catch((error) => {
                if (disposed || error.name === "AbortError") return;
                if (error.name !== "NotAllowedError") {
                    removeStartListeners();
                    console.warn(`Could not play ${backgroundMusicFile}.`, error);
                }
            });
        }

        // Retry on interaction if the browser blocks audible autoplay.
        window.addEventListener("click", startMusic);
        window.addEventListener("keydown", startMusic);
        startMusic();

        return () => {
            disposed = true;
            removeStartListeners();
            music.pause();
            music.removeAttribute("src");
            music.load();
        };
    }, []);

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
