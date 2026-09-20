export default function ContentPanel({ content, onClose }) {
    if (!content) return null;

    return (
        <section className="modal" aria-modal="true" aria-labelledby="panel-title" role="dialog">
            <div className="modal-header">
                <h1 id="panel-title">{content.title}</h1>
                <button className="modal-exit-button" onClick={onClose} type="button">
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
