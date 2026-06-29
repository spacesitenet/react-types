import { useEffect, useMemo, useState } from "react";
import { docs } from "./docs";
import type { Doc } from "./docs";
import MarkdownRenderer from "./MarkdownRenderer";

const siteName = "React TypeScript Patterns Guide";

function getHeadings(doc: Doc) {
  return doc.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", ""))
    .slice(0, 4);
}

function getWordCount(doc: Doc) {
  return doc.content.split(/\s+/).filter(Boolean).length;
}

export default function App() {
  const [activeSlug, setActiveSlug] = useState(docs[0].slug);
  const [query, setQuery] = useState("");

  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return docs;
    }

    return docs.filter((doc) => {
      const searchableText = `${doc.title} ${doc.description} ${doc.category} ${doc.content}`;
      return searchableText.toLowerCase().includes(normalizedQuery);
    });
  }, [query]);

  const activeDoc = docs.find((doc) => doc.slug === activeSlug) ?? docs[0];

  useEffect(() => {
    document.title = `${activeDoc.title} | ${siteName}`;
  }, [activeDoc.title]);

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Documentation navigation">
        <a className="brand" href="#top" onClick={() => setActiveSlug(docs[0].slug)}>
          <span className="brand-mark">RT</span>
          <span>
            <strong>{siteName}</strong>
            <small>Fast React docs and examples</small>
          </span>
        </a>

        <label className="search-label" htmlFor="doc-search">
          Search docs
        </label>
        <input
          id="doc-search"
          className="search-input"
          type="search"
          placeholder="Redux, MUI, events..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <nav className="doc-nav">
          {filteredDocs.map((doc) => (
            <button
              className={doc.slug === activeDoc.slug ? "nav-item active" : "nav-item"}
              key={doc.slug}
              type="button"
              onClick={() => setActiveSlug(doc.slug)}
            >
              <span>{doc.title}</span>
              <small>{doc.category}</small>
            </button>
          ))}
        </nav>

        {filteredDocs.length === 0 ? (
          <p className="empty-state">No docs match that search yet.</p>
        ) : null}
      </aside>

      <main className="main-content" id="top">
        <section className="hero">
          <span className="eyebrow">React TypeScript docs</span>
          <h1>{siteName}</h1>
          <p>
            A lightweight reference site for practical React, TypeScript, Redux
            Toolkit, testing, and Material UI patterns.
          </p>
          <div className="hero-actions" aria-label="Documentation stats">
            <span>{docs.length} guides</span>
            <span>GitHub Pages ready</span>
            <span>No backend needed</span>
          </div>
        </section>

        <section className="doc-grid" aria-label="Documentation collection">
          {docs.map((doc) => (
            <button
              className={doc.slug === activeDoc.slug ? "doc-card selected" : "doc-card"}
              key={doc.slug}
              type="button"
              onClick={() => setActiveSlug(doc.slug)}
            >
              <span>{doc.category}</span>
              <strong>{doc.title}</strong>
              <small>{doc.description}</small>
            </button>
          ))}
        </section>

        <article className="doc-panel">
          <header className="doc-header">
            <div>
              <span className="category-pill">{activeDoc.category}</span>
              <h2>{activeDoc.title}</h2>
              <p>{activeDoc.description}</p>
            </div>
            <div className="doc-meta">
              <span>{getWordCount(activeDoc)} words</span>
              <span>{getHeadings(activeDoc).length} sections</span>
            </div>
          </header>

          {getHeadings(activeDoc).length > 0 ? (
            <div className="section-links" aria-label="Sections in this guide">
              {getHeadings(activeDoc).map((heading) => (
                <span key={heading}>{heading}</span>
              ))}
            </div>
          ) : null}

          <MarkdownRenderer markdown={activeDoc.content} />
        </article>
      </main>
    </div>
  );
}
