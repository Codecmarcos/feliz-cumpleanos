const days = [
  {
    question: "Lo que para Bécquer era la poesía, para mí lo es el amor. ¿Recuerdas qué es para mí el amor?",
    answers: [
      "el amor eres tu",
      "tu",
      "yo",
      "el amor soy yo",
    ],
    hints: [
      "Bécquer escribió este verso en su famosa Rima XXI.",
      "Alguna vez te he mencionado la respuesta.",
      "Puedes encontrar la respuesta en el fondo de un espejo.",
    ],
    successTitle: "Correcto. Sí, has acertado.",
    successMessage:
      "Aunque tampoco era muy difícil. Es un secreto a voces que, para mí, el amor lleva tu nombre. Espero que te guste el regalo de hoy.",
    giftButton: "Abrir mi primer regalo",
    video: "dQw4w9WgXcQ",
    title: "La primera sorpresa",
  },
  {
    question: "¿Cuántos kilómetros separan nuestros cuerpos?",
    answers: [
      "420",
      "420 km",
      "420km",
      "420 kilometros",
    ],
    hints: [
      "No debería haber pistas porque es bastante fácil, pero bueno: también es el Día Mundial del Cannabis.",
    ],
    successTitle: "Bien. Gracias por volver.",
    successMessage:
      "Un día más has acertado. ¿Quién no iba a recordar el número de kilómetros que tantos dolores de cabeza nos da? Recuerda que la distancia solo separa cuerpos. Mi corazón y mi mente son tuyos y estarán donde quieras que vayas. Disfruta de tu regalo del día 2.",
    giftButton: "Abrir el regalo del día 2",
    video: "M7lc1UVf-VE",
    title: "Algo para sonreír",
  },
  {
    question: "¿Qué es aquello que jamás podré decirte?",
    answers: [
      "mentiras",
      "mentira",
      "una mentira",
      "las mentiras",
    ],
    hints: [
      "Siempre me las pillas.",
      "Destruyen una relación.",
      "Jamás te las diré.",
    ],
    successTitle: "¡Enhorabuena!",
    successMessage:
      "Vaya, esta no era tan fácil. ¿Has necesitado las pistas? Jajaja. Pues sí, en efecto: las mentiras representan el principio del fin. No es solo que se me den mal, sino que son incompatibles con el amor. ¿Podrás oír unas cuantas?",
    giftButton: "Abrir el regalo del día 3",
    video: "ysz5S6PUM-U",
    title: "La tercera pieza",
  },
  {
    question: "Hoy es tu cumpleaños, ¡hay que hacer algo especial! Subamos la dificultad: ¿qué diosa de la mitología griega se enamoró perdidamente de un hombre más joven que ella?",
    answers: [
      "afrodita",
    ],
    hints: [
      "Es un mito muy conocido de la mitología griega.",
      "Ambos son referentes del amor romántico y la belleza.",
    ],
    successTitle: "¡Bueeeeno! Aquí estás un día más.",
    successMessage:
      "Me alegro mucho de que estés tomándotelo en serio. Hoy es tu día, mi amor. El primer cumpleaños de muchos a tu lado. No diría que soy un Adonis, pero sí que tuve su suerte al encontrar a mi Afrodita. Te amo con locura. Muchas felicidades, mi chica guapa.",
    giftButton: "Abrir mi regalo de cumpleaños",
    video: "jNQXAC9IVRw",
    title: "A mitad del camino",
  },
  {
    question: "¿Cuántos lados tiene un hexágono?",
    answers: ["6", "seis"],
    hints: ["Tiene más lados que un cuadrado.", "Tiene menos que un octógono.", "Piensa en un panal."],
    video: "aqz-KE-bpKQ",
    title: "La quinta sorpresa",
  },
  {
    question: "¿Cuál de estos instrumentos tiene teclas y pedales?",
    answers: ["piano", "el piano"],
    hints: ["Puede ser de cola.", "Suele tener 88 teclas.", "Mozart sabía tocarlo."],
    video: "ScMzIvxBSi4",
    title: "Ya casi estás",
  },
  {
    question: "¿Qué número completa la serie: 2, 4, 6, 8...?",
    answers: ["10", "diez"],
    hints: ["Todos son números pares.", "Avanza de dos en dos.", "Es el primero de dos cifras."],
    video: "L_jWHffIx5E",
    title: "El gran final",
  },
];

// Cambia esta fecha cuando se decida el día real de comienzo.
const START_DATE = "2026-06-12T00:00:00+02:00";
const ACCESS_PASSWORD = "libelula110426";
const ARCHIVE_PASSWORD = "archivo110426";
const PROGRESS_KEY = "feliz-cumpleanos-completed-days";
const ACCESS_KEY = "feliz-cumpleanos-access";

const completedDays = new Set(
  JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]"),
);
const revealedGifts = new Set();

const accessScreen = document.querySelector("#accessScreen");
const siteShell = document.querySelector("#siteShell");
const accessForm = document.querySelector("#accessForm");
const accessPassword = document.querySelector("#accessPassword");
const accessError = document.querySelector("#accessError");
const homePage = document.querySelector("#homePage");
const archivePage = document.querySelector("#archivePage");
const archiveLocked = document.querySelector("#archiveLocked");
const archiveOpen = document.querySelector("#archiveOpen");
const archiveForm = document.querySelector("#archiveForm");
const archivePassword = document.querySelector("#archivePassword");
const archiveError = document.querySelector("#archiveError");
const dailyChallenge = document.querySelector("#dailyChallenge");
const archiveGrid = document.querySelector("#archiveGrid");
const completedCount = document.querySelector("#completedCount");
const archiveCompletedCount = document.querySelector("#archiveCompletedCount");
const dayEyebrow = document.querySelector("#dayEyebrow");
const toast = document.querySelector("#toast");

function normalize(value) {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,]/g, "")
    .replace(/\s+/g, " ");
}

function getJourneyState() {
  const now = Date.now();
  const start = new Date(START_DATE).getTime();
  const elapsed = now - start;
  const dayIndex = Math.floor(elapsed / 86400000);
  const nextReset = start + (dayIndex + 1) * 86400000;

  return {
    dayIndex,
    nextReset,
    hasStarted: dayIndex >= 0,
    hasEnded: dayIndex >= days.length,
  };
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completedDays]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2300);
}

function openSite() {
  localStorage.setItem(ACCESS_KEY, "granted");
  accessScreen.hidden = true;
  siteShell.hidden = false;
  document.body.classList.remove("access-locked");
  route();
}

function initializeAccess() {
  if (localStorage.getItem(ACCESS_KEY) === "granted") {
    openSite();
    return;
  }

  document.body.classList.add("access-locked");
  accessPassword.focus();
}

function renderCounts() {
  completedCount.textContent = completedDays.size;
  archiveCompletedCount.textContent = completedDays.size;
}

function renderDailyChallenge() {
  const journey = getJourneyState();

  if (!journey.hasStarted) {
    dayEyebrow.textContent = "PRÓXIMAMENTE";
    dailyChallenge.innerHTML = `
      <div class="empty-state">
        <p class="eyebrow">TODAVÍA NO</p>
        <h2>El viaje aún no ha empezado.</h2>
        <p>Vuelve cuando llegue el primer día. La paciencia también cuenta como prueba.</p>
      </div>
    `;
    return;
  }

  if (journey.hasEnded) {
    dayEyebrow.textContent = "VIAJE COMPLETADO";
    dailyChallenge.innerHTML = `
      <div class="empty-state">
        <p class="eyebrow">FIN DEL VIAJE</p>
        <h2>Los siete días ya han pasado.</h2>
        <p>El archivo guarda las pruebas. Y posiblemente algún secreto administrativo.</p>
        <a class="text-link" href="#archivo">Ir al archivo →</a>
      </div>
    `;
    return;
  }

  const day = days[journey.dayIndex];
  dayEyebrow.textContent = `DÍA ${journey.dayIndex + 1} DE 7`;

  if (
    completedDays.has(journey.dayIndex) &&
    !revealedGifts.has(journey.dayIndex)
  ) {
    dailyChallenge.innerHTML = `
      <article class="success-panel">
        <div class="success-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <path d="M10 28h44v27H10zM7 19h50v9H7zM32 19v36" />
            <path d="M31 19H18c-6 0-7-9-1-10 7-1 14 10 14 10ZM33 19h13c6 0 7-9 1-10-7-1-14 10-14 10Z" />
          </svg>
        </div>
        <p class="eyebrow">RESPUESTA CORRECTA</p>
        <h2>${day.successTitle || "Has acertado."}</h2>
        <p>${day.successMessage || "Tu regalo de hoy ya está preparado."}</p>
        <button class="gift-button" id="revealGift" type="button">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 13h22v15H5zM3 8h26v5H3zM16 8v20M15 8H9C5 8 5 3 9 3c4 0 6 5 6 5ZM17 8h6c4 0 4-5 0-5-4 0-6 5-6 5Z" />
          </svg>
          ${day.giftButton || "Abrir mi regalo"}
        </button>
      </article>
    `;

    document.querySelector("#revealGift").addEventListener("click", () => {
      revealedGifts.add(journey.dayIndex);
      renderDailyChallenge();
      window.setTimeout(() => {
        dailyChallenge.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    });
    return;
  }

  if (completedDays.has(journey.dayIndex)) {
    dailyChallenge.innerHTML = `
      <article class="video-panel">
        <div class="video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${day.video}?rel=0"
            title="${day.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="video-meta">
          <div><span>REGALO DE HOY</span><strong>${day.title}</strong></div>
          <span>Día ${journey.dayIndex + 1} de 7</span>
        </div>
      </article>
    `;
    return;
  }

  dailyChallenge.innerHTML = `
    <article class="question-panel">
      <div class="question-main">
        <p class="eyebrow">LA PREGUNTA DE HOY</p>
        <h2>${day.question}</h2>
        <form class="answer-form" id="answerForm">
          <label for="writtenAnswer">Tu respuesta</label>
          <div class="answer-field">
            <input id="writtenAnswer" type="text" autocomplete="off" spellcheck="false" placeholder="Escríbela aquí" />
            <button type="submit">Comprobar →</button>
          </div>
          <p class="form-error" id="answerError" role="alert" aria-live="polite"></p>
        </form>
      </div>
      <div class="hints">
        <p class="eyebrow">ALGUNAS PISTAS</p>
        <ol>
          ${day.hints.map((hint) => `<li>${hint}</li>`).join("")}
        </ol>
      </div>
    </article>
  `;

  const answerForm = document.querySelector("#answerForm");
  const writtenAnswer = document.querySelector("#writtenAnswer");
  const answerError = document.querySelector("#answerError");

  answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const proposed = normalize(writtenAnswer.value);
    const isCorrect = day.answers.some((answer) => normalize(answer) === proposed);

    if (!isCorrect) {
      answerError.textContent = "No parece ser esa. Respira, mira las pistas y vuelve a intentarlo.";
      answerForm.classList.remove("is-wrong");
      void answerForm.offsetWidth;
      answerForm.classList.add("is-wrong");
      writtenAnswer.select();
      return;
    }

    completedDays.add(journey.dayIndex);
    saveProgress();
    renderCounts();
    renderDailyChallenge();
    window.setTimeout(() => {
      dailyChallenge.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    showToast("Respuesta correcta. Tu regalo está desbloqueado.");
  });
}

function renderArchive() {
  const journey = getJourneyState();
  const previousDays = Math.min(Math.max(journey.dayIndex, 0), days.length);

  if (previousDays === 0) {
    archiveGrid.innerHTML = `
      <div class="archive-empty">
        <h2>Aquí todavía no hay nada.</h2>
        <p>El archivo necesita pasado. Vuelve después del primer día.</p>
      </div>
    `;
    return;
  }

  archiveGrid.innerHTML = days
    .slice(0, previousDays)
    .map(
      (day, index) => `
        <article class="archive-item">
          <div class="archive-number">${String(index + 1).padStart(2, "0")}</div>
          <div>
            <span>${completedDays.has(index) ? "VISTO" : "NO COMPLETADO"}</span>
            <h2>${day.title}</h2>
          </div>
          <div class="archive-video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/${day.video}?rel=0"
              title="${day.title}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </article>
      `,
    )
    .join("");
}

function openArchive() {
  archiveLocked.hidden = true;
  archiveOpen.hidden = false;
  renderArchive();
  renderCounts();
}

function updateTimer() {
  const journey = getJourneyState();
  let remaining = journey.nextReset - Date.now();

  if (!journey.hasStarted) {
    remaining = new Date(START_DATE).getTime() - Date.now();
  } else if (journey.hasEnded) {
    remaining = 0;
  }

  remaining = Math.max(0, remaining);
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  document.querySelector("#timerHours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#timerMinutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#timerSeconds").textContent = String(seconds).padStart(2, "0");

  if (remaining === 0) {
    renderDailyChallenge();
    renderArchive();
  }
}

function route() {
  const isArchive = window.location.hash === "#archivo";
  homePage.hidden = isArchive;
  archivePage.hidden = !isArchive;

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle(
      "active",
      link.dataset.route === (isArchive ? "archive" : "home"),
    );
  });

  if (isArchive) {
    archiveLocked.hidden = false;
    archiveOpen.hidden = true;
    archivePassword.value = "";
    archiveError.textContent = "";
    window.setTimeout(() => archivePassword.focus(), 0);
  } else {
    renderDailyChallenge();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalize(accessPassword.value) === ACCESS_PASSWORD) {
    accessError.textContent = "";
    openSite();
    return;
  }

  accessError.textContent = "Esa no es. El comité empieza a sospechar.";
  accessForm.classList.remove("is-wrong");
  void accessForm.offsetWidth;
  accessForm.classList.add("is-wrong");
  accessPassword.select();
});

archiveForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (normalize(archivePassword.value) === ARCHIVE_PASSWORD) {
    archiveError.textContent = "";
    openArchive();
    return;
  }

  archiveError.textContent = "Inexpugnable, te avisamos. Esa llave no abre nada.";
  archiveForm.classList.remove("is-wrong");
  void archiveForm.offsetWidth;
  archiveForm.classList.add("is-wrong");
  archivePassword.select();
});

window.addEventListener("hashchange", route);
renderCounts();
initializeAccess();
updateTimer();
window.setInterval(updateTimer, 1000);
