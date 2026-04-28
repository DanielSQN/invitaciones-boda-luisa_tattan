"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className={styles.page}>
      <div className={`${styles.floral} ${styles.floralTop}`} aria-hidden="true" />
      <div className={`${styles.floral} ${styles.floralBottom}`} aria-hidden="true" />

      <section className={styles.hero} aria-label="Invitacion de boda">
        <p className={styles.monogram}>L | T</p>

        <div className={styles.copy}>
          <p className={styles.kicker}>Nuestra boda</p>
          <h1>
            Luisa <span>&amp;</span> Tattan
          </h1>
          <p className={styles.date}>26 de septiembre de 2026</p>
        </div>

        <button
          className={`${styles.envelopeButton} ${isOpen ? styles.open : ""}`}
          type="button"
          aria-expanded={isOpen}
          aria-label="Abrir la carta de invitacion"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={styles.card}>
            <span className={styles.cardKicker}>Nos casamos</span>
            <span className={styles.cardNames}>
              Luisa <span>&amp;</span> Tattan
            </span>
            <span className={styles.cardDate}>26.09.2026</span>
          </span>

          <span className={styles.envelope} aria-hidden="true">
            <span className={styles.envelopeBack} />
            <span className={styles.envelopePocket} />
            <span className={styles.envelopeFlap} />
            <span className={styles.seal}>
              <span>L&amp;T</span>
            </span>
          </span>
        </button>

        <p className={styles.prompt}>
          Haz clic en la carta
          <span>para ver la invitaci&oacute;n</span>
        </p>
      </section>
    </main>
  );
}
