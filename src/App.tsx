import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { docs } from "./docs";
import type { Doc } from "./docs";
import MarkdownRenderer, { slugify } from "./MarkdownRenderer";

const siteName = "React TypeScript Patterns Guide";

function getHeadings(doc: Doc) {
  const lines = doc.content.split("\n");
  const headings: { text: string; level: 2 | 3; id: string }[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "").trim();
      headings.push({ text, level: 2, id: slugify(text) });
    } else if (line.startsWith("### ")) {
      const text = line.replace("### ", "").trim();
      headings.push({ text, level: 3, id: slugify(text) });
    }
  }

  return headings;
}

function getWordCount(doc: Doc) {
  return doc.content.split(/\s+/).filter(Boolean).length;
}

function getSearchPreview(doc: Doc, query: string): string {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return doc.description;
  }

  const content = doc.content.replace(/\s+/g, " ");
  const matchIndex = content.toLowerCase().indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return doc.description;
  }

  const start = Math.max(0, matchIndex - 48);
  const end = Math.min(content.length, matchIndex + normalizedQuery.length + 88);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";

  return `${prefix}${content.slice(start, end).trim()}${suffix}`;
}

export default function App() {
  const [activeSlug, setActiveSlug] = useState(() => {
    // Try to load from URL hash first, e.g., #redux-store-slice
    const hash = window.location.hash.replace("#", "");
    const found = docs.find((d) => d.slug === hash);
    return found ? found.slug : docs[0].slug;
  });

  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync theme with document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const found = docs.find((d) => d.slug === hash);
      if (found) {
        setActiveSlug(found.slug);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL hash when active slug changes
  useEffect(() => {
    window.location.hash = activeSlug;
  }, [activeSlug]);

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const autocompleteResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return docs.slice(0, 6);
    }

    return [...docs]
      .map((doc) => {
        const title = doc.title.toLowerCase();
        const category = doc.category.toLowerCase();
        const description = doc.description.toLowerCase();
        const content = doc.content.toLowerCase();
        let score = 0;

        if (title === normalizedQuery) score += 100;
        if (title.startsWith(normalizedQuery)) score += 60;
        if (title.includes(normalizedQuery)) score += 40;
        if (category.includes(normalizedQuery)) score += 24;
        if (description.includes(normalizedQuery)) score += 18;
        if (content.includes(normalizedQuery)) score += 8;

        return { doc, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.doc)
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Group documents by category for the sidebar
  const groupedDocs = useMemo(() => {
    const groups: Record<string, Doc[]> = {};
    for (const doc of filteredDocs) {
      if (!groups[doc.category]) {
        groups[doc.category] = [];
      }
      groups[doc.category].push(doc);
    }
    return groups;
  }, [filteredDocs]);

  const activeDoc = useMemo(() => {
    return docs.find((doc) => doc.slug === activeSlug) ?? docs[0];
  }, [activeSlug]);

  const headings = useMemo(() => {
    return getHeadings(activeDoc);
  }, [activeDoc]);

  // IntersectionObserver to highlight active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveHeadingId(visibleEntry.target.id);
        }
      },
      { rootMargin: "-80px 0px -80px 0px", threshold: 0.1 }
    );

    const headingElements = document.querySelectorAll(".markdown h2, .markdown h3");
    headingElements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [activeDoc]);

  // Find previous and next documents
  const { prevDoc, nextDoc } = useMemo(() => {
    const index = docs.findIndex((doc) => doc.slug === activeDoc.slug);
    return {
      prevDoc: index > 0 ? docs[index - 1] : null,
      nextDoc: index < docs.length - 1 ? docs[index + 1] : null,
    };
  }, [activeDoc]);

  useEffect(() => {
    document.title = `${activeDoc.title} | ${siteName}`;
  }, [activeDoc.title]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const selectSearchResult = (doc: Doc) => {
    setActiveSlug(doc.slug);
    setSearchOpen(false);
    setQuery("");
    setSidebarOpen(false);
  };

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
      setSearchOpen(true);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (autocompleteResults.length === 0) return;
      setActiveSearchIndex((currentIndex) =>
        Math.min(currentIndex + 1, autocompleteResults.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (autocompleteResults.length === 0) return;
      setActiveSearchIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (event.key === "Enter" && autocompleteResults[activeSearchIndex]) {
      event.preventDefault();
      selectSearchResult(autocompleteResults[activeSearchIndex]);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  return (
    <div className="app-shell">
      {/* Top Header Navigation */}
      <header className="header">
        <div className="header-left">
          <button
            className="icon-button menu-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
            type="button"
            aria-label="Toggle navigation sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <a className="brand" href="#top" onClick={() => setActiveSlug(docs[0].slug)}>
            <span className="brand-text">
              <strong className="brand-title">{siteName}</strong>
              <small className="brand-subtitle font-medium">Interactive Reference Guide</small>
            </span>
          </a>
        </div>

        <div className="header-right">
          <div className="search-container" ref={searchContainerRef}>
            <input
              ref={searchInputRef}
              id="doc-search"
              className="search-input"
              type="search"
              placeholder="Search docs..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              role="combobox"
              aria-expanded={searchOpen}
              aria-controls="search-autocomplete"
              aria-activedescendant={
                searchOpen && autocompleteResults[activeSearchIndex]
                  ? `search-result-${autocompleteResults[activeSearchIndex].slug}`
                  : undefined
              }
              aria-label="Search documentation"
            />
            <span className="search-shortcut">
              <kbd>⌘</kbd>K
            </span>

            {searchOpen ? (
              <div
                className="search-menu"
                id="search-autocomplete"
                role="listbox"
                aria-label="Search suggestions"
              >
                <div className="search-menu-header">
                  <span>{query.trim() ? "Search results" : "Popular guides"}</span>
                  <small>{autocompleteResults.length} found</small>
                </div>

                {autocompleteResults.length > 0 ? (
                  <div className="search-results">
                    {autocompleteResults.map((doc, index) => (
                      <button
                        className={
                          index === activeSearchIndex
                            ? "search-result active"
                            : "search-result"
                        }
                        id={`search-result-${doc.slug}`}
                        key={doc.slug}
                        type="button"
                        role="option"
                        aria-selected={index === activeSearchIndex}
                        onMouseEnter={() => setActiveSearchIndex(index)}
                        onClick={() => selectSearchResult(doc)}
                      >
                        <span className="search-result-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </span>
                        <span className="search-result-body">
                          <span className="search-result-topline">
                            <strong>{doc.title}</strong>
                            <small>{doc.category}</small>
                          </span>
                          <span className="search-result-preview">
                            {getSearchPreview(doc, query)}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="search-empty">
                    <strong>No matches found</strong>
                    <span>Try searching for Redux, MUI, events, testing, or thunk.</span>
                  </div>
                )}

                <div className="search-menu-footer">
                  <span>↑↓ Navigate</span>
                  <span>Enter Open</span>
                  <span>Esc Close</span>
                </div>
              </div>
            ) : null}
          </div>

          <button
            className="icon-button"
            onClick={toggleTheme}
            type="button"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <a
            className="icon-button"
            href="https://github.com/spacesitenet/react-types"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="main-container">
        {/* Left Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Documentation navigation">
          {Object.entries(groupedDocs).map(([category, items]) => (
            <div className="sidebar-group" key={category}>
              <h3 className="sidebar-group-title">{category}</h3>
              {items.map((doc) => (
                <button
                  className={doc.slug === activeDoc.slug ? "nav-item active" : "nav-item"}
                  key={doc.slug}
                  type="button"
                  onClick={() => {
                    setActiveSlug(doc.slug);
                    setSidebarOpen(false);
                  }}
                >
                  {doc.title}
                </button>
              ))}
            </div>
          ))}

          {filteredDocs.length === 0 ? (
            <p className="empty-state">No matching documents found.</p>
          ) : null}
        </aside>

        {/* Center Content Column */}
        <main className="content-area" id="top">
          <div className="content-container">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <span>Docs</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>{activeDoc.category}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="breadcrumb-active">{activeDoc.title}</span>
            </nav>

            {/* Document Header */}
            <header className="doc-header">
              <span className="category-badge">{activeDoc.category}</span>
              <h1 className="doc-title">{activeDoc.title}</h1>
              <p className="doc-description">{activeDoc.description}</p>
              <div className="doc-meta">
                <div className="doc-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>{getWordCount(activeDoc)} words</span>
                </div>
                <div className="doc-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{Math.max(1, Math.round(getWordCount(activeDoc) / 200))} min read</span>
                </div>
              </div>
            </header>

            {/* Markdown Content */}
            <MarkdownRenderer markdown={activeDoc.content} />

            {/* Previous / Next Navigation Buttons */}
            <nav className="prev-next-nav" aria-label="Previous and next pages">
              {prevDoc ? (
                <a
                  className="prev-next-card"
                  href={`#${prevDoc.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSlug(prevDoc.slug);
                  }}
                >
                  <span className="prev-next-label">Previous</span>
                  <span className="prev-next-title">← {prevDoc.title}</span>
                </a>
              ) : (
                <div style={{ flex: 1 }} />
              )}

              {nextDoc ? (
                <a
                  className="prev-next-card next"
                  href={`#${nextDoc.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSlug(nextDoc.slug);
                  }}
                >
                  <span className="prev-next-label">Next</span>
                  <span className="prev-next-title">{nextDoc.title} →</span>
                </a>
              ) : (
                <div style={{ flex: 1 }} />
              )}
            </nav>
          </div>
        </main>

        {/* Right Sidebar (Table of Contents) */}
        <aside className="toc-sidebar" aria-label="Table of contents">
          {headings.length > 0 ? (
            <>
              <h4 className="toc-title">On this page</h4>
              <ul className="toc-list">
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
                  >
                    <a
                      className={`toc-link ${activeHeadingId === heading.id ? "active" : ""}`}
                      href={`#${heading.id}`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
