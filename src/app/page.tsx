"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

const WHATSAPP_NUMBER = "";

const weddingDetails = {
  couple: {
    bride: "Luisa",
    groom: "Tattan",
    initials: "L | T",
  },
  event: {
    dateLabel: "26 de septiembre de 2026",
    shortDate: "26.09.2026",
    startsAt: "2026-09-26T16:00:00-05:00",
    calendarEnd: "2026-09-27T01:00:00-05:00",
    locationName: "Lugar por confirmar",
    address: "Direccion por confirmar",
  },
  dressCode: {
    title: "Elegante formal",
    note: "Queremos que vivas la noche con comodidad y mucho encanto. Pronto compartiremos la paleta y detalles finales.",
  },
  schedule: [
    {
      time: "16:00 hrs",
      title: "Ceremonia",
      place: "Capilla por confirmar",
      detail: "Nos encontraremos para celebrar el si.",
    },
    {
      time: "18:30 hrs",
      title: "Recepcion",
      place: "Salon por confirmar",
      detail: "Cena, brindis y momentos para guardar.",
    },
    {
      time: "21:00 hrs",
      title: "Fiesta",
      place: "Mismo lugar",
      detail: "Musica y celebracion hasta el amanecer.",
    },
    {
      time: "00:00 hrs",
      title: "Post fiesta",
      place: "Zona lounge",
      detail: "Un ultimo brindis para cerrar la noche.",
    },
  ],
  itinerary: [
    "Llegada de invitados",
    "Ceremonia",
    "Coctel",
    "Cena",
    "Brindis",
    "Fiesta",
  ],
};

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
    location: `${weddingDetails.event.locationName}, ${weddingDetails.event.address}`,
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
  const detailsRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  function handleOpenInvitation() {
    setIsOpen(true);
    window.setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 950);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Invitacion de boda">
        <header className={styles.heroHeader}>
          <a className={styles.monogram} href="#inicio" aria-label="Inicio">
            {weddingDetails.couple.initials}
          </a>
          <nav className={styles.topNav} aria-label="Navegacion principal">
            <a href="#inicio">Inicio</a>
            <a href="#informacion">Informacion</a>
            <a href="#confirmar">Confirmar asistencia</a>
          </nav>
          <button className={styles.musicButton} type="button" aria-label="Musica">
            ♪
          </button>
        </header>

        <div className={styles.copy} id="inicio">
          <p className={styles.kicker}>Nuestra boda</p>
          <h1>
            {weddingDetails.couple.bride} <span>&amp;</span> {weddingDetails.couple.groom}
          </h1>
          <p className={styles.date}>{weddingDetails.event.dateLabel}</p>

          <div className={styles.countdown} aria-label="Cuenta regresiva para la boda">
            {[
              ["Dias", countdown.days],
              ["Horas", countdown.hours],
              ["Minutos", countdown.minutes],
              ["Segundos", countdown.seconds],
            ].map(([label, value]) => (
              <span className={styles.countdownItem} key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>

        <button
          className={`${styles.envelopeButton} ${isOpen ? styles.open : ""}`}
          type="button"
          aria-expanded={isOpen}
          aria-label="Abrir la carta de invitacion"
          onClick={handleOpenInvitation}
        >
          <span className={styles.card}>
            <span className={styles.cardKicker}>Nos casamos</span>
            <span className={styles.cardNames}>
              {weddingDetails.couple.bride} <span>&amp;</span> {weddingDetails.couple.groom}
            </span>
            <span className={styles.cardDate}>{weddingDetails.event.shortDate}</span>
          </span>

          <span className={styles.envelope} aria-hidden="true">
            <span className={styles.envelopeBack} />
            <span className={styles.envelopePocket} />
            <span className={styles.envelopeFlap} />
            <span className={styles.recipient}>Para: {guestName}</span>
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

      <section
        className={styles.details}
        ref={detailsRef}
        id="informacion"
        aria-label="Detalles de la boda"
      >
        <aside className={styles.sideNav} aria-label="Secciones">
          <p>{weddingDetails.couple.initials}</p>
          <span aria-hidden="true" />
          <a href="#inicio">Inicio</a>
          <a href="#historia">Nuestra historia</a>
          <a href="#detalles">Detalles</a>
          <a href="#lugar">Lugar</a>
          <a href="#dress-code">Dress code</a>
          <a href="#confirmar">Confirmar asistencia</a>
        </aside>

        <div className={styles.detailContent}>
          <section className={styles.opening} id="historia">
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Nos casamos</p>
              <h2>
                {weddingDetails.couple.bride} <span>&amp;</span> {weddingDetails.couple.groom}
              </h2>
              <p>
                Con la bendicion de Dios y de nuestros padres, queremos compartir contigo el dia
                mas importante de nuestras vidas.
              </p>
              <p className={styles.scriptLine}>Gracias por ser parte de nuestra historia.</p>
              <a className={styles.primaryButton} href="#confirmar">
                Confirmar asistencia
              </a>
            </div>

            <div className={styles.photoFrame} aria-label="Foto de los novios">
              <div className={styles.couplePhoto} />
            </div>
          </section>

          <section className={styles.eventDetails} id="detalles">
            <p className={styles.kicker}>Detalles de nuestra boda</p>
            <div className={styles.infoGrid}>
              {weddingDetails.schedule.map((item) => (
                <article className={styles.infoCard} key={item.title}>
                  <span className={styles.detailIcon} aria-hidden="true">
                    {item.title === "Ceremonia"
                      ? "⌂"
                      : item.title === "Recepcion"
                        ? "♢"
                        : item.title === "Fiesta"
                          ? "♫"
                          : "✦"}
                  </span>
                  <p>{item.time}</p>
                  <h3>{item.title}</h3>
                  <span>{item.place}</span>
                  <small>{item.detail}</small>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.cardRow}>
            <article className={styles.miniCard} id="lugar">
              <p className={styles.kicker}>Lugar</p>
              <h3>{weddingDetails.event.locationName}</h3>
              <p>{weddingDetails.event.address}</p>
              <a className={styles.textButton} href={calendarUrl} target="_blank" rel="noreferrer">
                Agregar a Google Calendar
              </a>
            </article>

            <article className={styles.miniCard} id="dress-code">
              <p className={styles.kicker}>Dress code</p>
              <h3>{weddingDetails.dressCode.title}</h3>
              <div className={styles.palette} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>{weddingDetails.dressCode.note}</p>
            </article>

            <article className={styles.miniCard}>
              <p className={styles.kicker}>Nuestra historia</p>
              <div className={styles.storyStrip} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Muy pronto agregaremos fotos y recuerdos de este camino juntos.</p>
            </article>
          </div>

          <section className={styles.itinerary} aria-label="Itinerario">
            <p className={styles.kicker}>Itinerario</p>
            <h3>Un dia para celebrar</h3>
            <ol>
              {weddingDetails.itinerary.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.rsvp} id="confirmar" aria-label="Confirmar asistencia">
            <p className={styles.kicker}>Confirmar asistencia</p>
            <h3>Nos encantaria verte ahi</h3>
            <p>
              Cuando tengas claro si puedes acompanarnos, confirma por WhatsApp para ayudarnos a
              preparar cada detalle.
            </p>
            <a className={styles.primaryButton} href={whatsappUrl} target="_blank" rel="noreferrer">
              Confirmar por WhatsApp
            </a>
          </section>

          <footer className={styles.footer}>
            <p>Gracias por acompa&ntilde;arnos. Te esperamos.</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
