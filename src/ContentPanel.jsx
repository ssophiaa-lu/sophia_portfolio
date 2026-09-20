import { useEffect, useRef } from "react";

// Add your exit sound to public/sounds/, or change this filename.
const exitSoundFile = "sounds/close_sign.mp3";

export default function ContentPanel({ content, onClose }) {
    const exitSoundRef = useRef(null);

    useEffect(() => () => {
        if (exitSoundRef.current) {
            exitSoundRef.current.pause();
            exitSoundRef.current.removeAttribute("src");
            exitSoundRef.current.load();
        }
    }, []);

    function handleExit() {
        if (!exitSoundRef.current) {
            exitSoundRef.current = new Audio(`${import.meta.env.BASE_URL}${exitSoundFile}`);
        }
        const sound = exitSoundRef.current;
        sound.currentTime = 0;
        sound.play().catch((error) => {
            console.warn("Could not play the sign exit sound.", error);
        });
        onClose();
    }

    if (!content) return null;

    return (
        <section className="modal" aria-modal="true" aria-labelledby="panel-title" role="dialog">
            <div className="modal-header">
                <h1 id="panel-title">{content.title}</h1>
                <button className="modal-exit-button" onClick={handleExit} type="button">
                    Exit
                </button>
            </div>

            {content.type === "blurb" ? (
                <p className="modal-blurb">{content.body}</p>
            ) : (
                <div className="card-list">
                    {content.items.map((item) => (
                        <article className="content-card" key={item.title}>
                            <h2>{item.title}</h2>
                            <p className="card-meta">{item.meta}</p>
                            <p>{item.description}</p>
                            {item.link && (
                                <a href={item.link} rel="noreferrer" target="_blank">
                                    View Project
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
