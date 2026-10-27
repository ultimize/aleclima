"use client";

/** Riapre il banner cookie (lo stesso evento del link nel footer). */
export function PreferenzeCookie() {
  return (
    <button className="btn btn-blue" onClick={() => window.dispatchEvent(new Event("aleclima:cookie"))}>
      Modifica preferenze cookie
    </button>
  );
}
