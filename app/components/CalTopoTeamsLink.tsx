"use client";

import { Fragment, useEffect, useRef } from "react";

const disclosureEvent = "rid2caltopo:open-caltopo-disclosure";

function openDisclosure() {
  window.dispatchEvent(new Event(disclosureEvent));
}

export function CalTopoLink() {
  return (
    <button
      className="caltopo-disclosure-link"
      type="button"
      aria-haspopup="dialog"
      onClick={openDisclosure}
    >
      CalTopo
    </button>
  );
}

export function CalTopoText({ text }: { text: string }) {
  const parts = text.split(/(CalTopo)/g);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part === "CalTopo" ? (
            <CalTopoLink />
          ) : (
            part
          )}
        </Fragment>
      ))}
    </>
  );
}

export const CalTopoTeamsText = CalTopoText;

export function CalTopoDisclosurePanel() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => dialogRef.current?.showModal();
    window.addEventListener(disclosureEvent, open);
    return () => window.removeEventListener(disclosureEvent, open);
  }, []);

  return (
    <dialog
      className="caltopo-disclosure-dialog"
      ref={dialogRef}
      aria-labelledby="caltopo-disclosure-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="caltopo-disclosure-panel">
        <form method="dialog" className="caltopo-disclosure-close-form">
          <button type="submit" aria-label="Close relationship disclosure">×</button>
        </form>
        <p className="eyebrow">Independent project</p>
        <h2 id="caltopo-disclosure-title">RID2Caltopo is not a CalTopo product.</h2>
        <p>
          RID2Caltopo is an independent, open-source project. It is not affiliated
          with, sponsored by, or endorsed by CalTopo.
        </p>
        <p>
          RID2Caltopo can publish operational information through the CalTopo Teams
          API. We are thankful to the CalTopo developers for their excellent mapping
          product and for supporting the Teams API used by search-and-rescue teams.
        </p>
        <a
          className="button button-primary"
          href="https://caltopo.com/about/teams/"
          target="_blank"
          rel="noreferrer"
        >
          Learn about the Teams API <span aria-hidden="true">↗</span>
        </a>
      </div>
    </dialog>
  );
}
