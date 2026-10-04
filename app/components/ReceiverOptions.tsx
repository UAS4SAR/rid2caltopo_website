"use client";

import { useRef } from "react";

export function ReceiverOptions() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="bridge-resource-link receiver-options-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-controls="receiver-options"
        onClick={() => dialogRef.current?.showModal()}
      >
        Compare receivers and purchase options <span aria-hidden="true">→</span>
      </button>
      <dialog
        id="receiver-options"
        className="caltopo-disclosure-dialog receiver-options-dialog"
        ref={dialogRef}
        aria-labelledby="receiver-options-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="caltopo-disclosure-panel receiver-options-panel">
          <form method="dialog" className="caltopo-disclosure-close-form">
            <button type="submit" aria-label="Close receiver options">×</button>
          </form>
          <p className="eyebrow">DroneScout Bridge</p>
          <h2 id="receiver-options-title">Choose a receiver for your drones.</h2>
          <p>Both retail packages include an enclosure and external antenna, and use USB-C power. Choose based on your drones’ Remote ID broadcasts.</p>
          <div className="receiver-options-grid">
            <section className="receiver-option" aria-labelledby="ds100-title">
              <p className="eyebrow">For most 2.4 GHz drones</p>
              <h3 id="ds100-title">DS100 retail</h3>
              <p className="receiver-band">2.4 GHz · Bluetooth + Wi-Fi</p>
              <p>A good fit for most drones: BlueMark says most Remote ID broadcasts use 2.4 GHz. DS100 receives Bluetooth and 2.4 GHz Wi-Fi Beacon and Wi-Fi NAN with updated firmware.</p>
              <p>Choose it when your drones use 2.4 GHz Remote ID. It does not receive 5 or 5.8 GHz broadcasts.</p>
              <a className="button button-primary" href="https://dronescout.co/product/dronescout-bridge-ds100-retail/" target="_blank" rel="noreferrer">
                Shop DS100 retail <span aria-hidden="true">↗</span>
              </a>
            </section>
            <section className="receiver-option" aria-labelledby="ds110-title">
              <p className="eyebrow">For Skydio X10 &amp; broader coverage</p>
              <h3 id="ds110-title">DS110 retail</h3>
              <p className="receiver-band">Tri-band · 2.4, 5 &amp; 5.8 GHz</p>
              <p>Choose DS110 for Skydio X10, or other drones broadcasting Remote ID over Wi-Fi NAN at 5 or 5.8 GHz. Of these two receivers, DS110 is required for those higher-frequency signals.</p>
              <p>It also covers 2.4 GHz Bluetooth and Wi-Fi Remote ID, making it the more flexible choice for a mixed fleet.</p>
              <a className="button button-primary" href="https://dronescout.co/product/dronescout-bridge-triple-band-ds110-retail-remoteid-receiver-for-ios-android-and-drone/" target="_blank" rel="noreferrer">
                Shop DS110 retail <span aria-hidden="true">↗</span>
              </a>
            </section>
          </div>
          <p className="receiver-options-note"><strong>Wi-Fi NAN alone does not require DS110.</strong> DS100 supports NAN at 2.4 GHz with updated firmware; the frequency band is what matters. Keep your bridge firmware current, especially for Skydio’s channel hopping.</p>
          <p className="receiver-options-sources">
            Manufacturer guidance: <a href="https://download.bluemark.io/ds_bridge.pdf" target="_blank" rel="noreferrer">receiver manual</a> · <a href="https://bluemark.io/2026/07/do-you-have-trouble-detecting-skydio-rid-signals/" target="_blank" rel="noreferrer">Skydio firmware update</a>
          </p>
        </div>
      </dialog>
    </>
  );
}
