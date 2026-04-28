"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

const WHATSAPP_NUMBER = "";
const BIBLE_VERSE =
  "El que halla esposa halla el bien, y alcanza la benevolencia de Jehova.";

const weddingDetails = {
  couple: {
    bride: "Luisa",
    groom: "Tattan",
    initials: "L&T",
  },
  event: {
    dateLabel: "26 de septiembre",
    year: "2026",
    startsAt: "2026-09-26T16:00:00-05:00",
    calendarEnd: "2026-09-27T01:00:00-05:00",
  },
  ceremony: {
    time: "5:00 PM",
    place: "Iglesia de la Unidad",
    address: "Calle 123 #45 - 67, Ciudad",
  },
  reception: {
    time: "7:30 PM",
    place: "Hacienda San Miguel",
    address: "Km 12 via al Sol, Ciudad",
  },
  dressCode: "Formal / Elegante",
};

type AnimationState = "closed" | "opening" | "revealed";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const initialCountdown: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdown(targetDate: string): Countdown {
  const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0);

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function formatCalendarDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(".000", "");
}

function createCalendarUrl() {
  const title = `${weddingDetails.couple.bride} & ${weddingDetails.couple.groom} - Boda`;
  const details = "Acompananos a celebrar nuestra boda. Te esperamos con mucha alegria.";
  const dates = `${formatCalendarDate(weddingDetails.event.startsAt)}/${formatCalendarDate(
    weddingDetails.event.calendarEnd,
  )}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details,
    location: `${weddingDetails.ceremony.place}, ${weddingDetails.ceremony.address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function createWhatsappUrl(guestName: string) {
  const message = `Hola, confirmo mi asistencia a la boda de Luisa y Tattan. Soy ${guestName}.`;

  if (!WHATSAPP_NUMBER) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const invitationRef = useRef<HTMLElement | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState>("closed");
  const [guestName, setGuestName] = useState("Invitado especial");
  const [countdown, setCountdown] = useState<Countdown>(initialCountdown);

  const calendarUrl = useMemo(() => createCalendarUrl(), []);
  const whatsappUrl = useMemo(() => createWhatsappUrl(guestName), [guestName]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitedGuest = params.get("invitado")?.trim();

    if (invitedGuest) {
      const syncGuestName = window.setTimeout(() => setGuestName(invitedGuest), 0);

      return () => window.clearTimeout(syncGuestName);
    }
  }, []);

  useEffect(() => {
    const startCountdown = window.setTimeout(() => {
      setCountdown(getCountdown(weddingDetails.event.startsAt));
    }, 0);

    const timer = window.setInterval(() => {
      setCountdown(getCountdown(weddingDetails.event.startsAt));
    }, 1000);

    return () => {
      window.clearTimeout(startCountdown);
      window.clearInterval(timer);
    };
  }, []);

  function openInvitation() {
    if (animationState !== "closed") {
      return;
    }

    setAnimationState("opening");

    window.setTimeout(() => {
      setAnimationState("revealed");
    }, 1700);

    window.setTimeout(() => {
      invitationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 2050);
  }

  return (
    <main className={styles.page} data-state={animationState}>
      <section className={styles.hero} aria-label="Pantalla inicial">
        <div className={styles.verseBlock}>
          <span className={styles.ornament} aria-hidden="true" />
          <p>{BIBLE_VERSE}</p>
          <small>Proverbios 18:22</small>
          <span className={styles.ornamentSmall} aria-hidden="true" />
        </div>

        <button
          className={styles.envelopeButton}
          type="button"
          aria-expanded={animationState !== "closed"}
          aria-label="Abrir la carta de invitacion"
          onClick={openInvitation}
        >
          <span className={styles.innerCard} aria-hidden="true">
            <span>Nuestra boda</span>
            <strong>
              {weddingDetails.couple.bride} &amp; {weddingDetails.couple.groom}
            </strong>
            <small>{weddingDetails.event.dateLabel}</small>
          </span>

          <span className={styles.envelope} aria-hidden="true">
            <span className={styles.envelopeBack} />
            <span className={styles.envelopePocket} />
            <span className={styles.envelopeFlap}>
              <span>Nuestra boda</span>
              <small>{weddingDetails.event.dateLabel}</small>
            </span>
            <span className={styles.botanicalLeft} />
            <span className={styles.botanicalRight} />
            <span className={styles.seal}>
              <span>{weddingDetails.couple.initials}</span>
            </span>
            <span className={styles.recipient}>
              Para:
              <i>{guestName}</i>
            </span>
          </span>
        </button>

        <button className={styles.openButton} type="button" onClick={openInvitation}>
          <span aria-hidden="true" />
          Haz clic en la carta para abrirla
          <span aria-hidden="true" />
        </button>
      </section>

      <section
        className={styles.invitation}
        ref={invitationRef}
        aria-label="Invitacion completa"
        aria-hidden={animationState === "closed"}
      >
        <div className={styles.invitationPaper}>
          <p className={styles.script}>Nuestra boda</p>
          <p className={styles.invitationDate}>
            {weddingDetails.event.dateLabel} de {weddingDetails.event.year}
          </p>
          <span className={styles.divider} aria-hidden="true" />

          <h1>
            {weddingDetails.couple.bride} <span>&amp;</span> {weddingDetails.couple.groom}
          </h1>

          <p className={styles.blessing}>
            Con la bendicion de Dios tenemos el honor de invitarte a nuestra boda.
          </p>

          <div className={styles.detailsGrid}>
            <article>
              <p className={styles.script}>Ceremonia</p>
              <strong>{weddingDetails.ceremony.time}</strong>
              <span>{weddingDetails.ceremony.place}</span>
              <small>{weddingDetails.ceremony.address}</small>
            </article>

            <article>
              <p className={styles.script}>Recepcion</p>
              <strong>{weddingDetails.reception.time}</strong>
              <span>{weddingDetails.reception.place}</span>
              <small>{weddingDetails.reception.address}</small>
            </article>
          </div>

          <div className={styles.countdown} aria-label="Cuenta regresiva para la boda">
            {[
              ["Dias", countdown.days],
              ["Horas", countdown.hours],
              ["Min", countdown.minutes],
              ["Seg", countdown.seconds],
            ].map(([label, value]) => (
              <span className={styles.countdownItem} key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </span>
            ))}
          </div>

          <div className={styles.dressCode}>
            <p className={styles.script}>Vestimenta</p>
            <span>{weddingDetails.dressCode}</span>
          </div>

          <div className={styles.actions}>
            <a href={calendarUrl} target="_blank" rel="noreferrer">
              Agregar al calendario
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Confirmar por WhatsApp
            </a>
          </div>

          <blockquote>
            &quot;{BIBLE_VERSE}&quot;
            <cite>Proverbios 18:22</cite>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
