const days = [
  {
    question: "¿Qué planeta es conocido como el planeta rojo?",
    answers: ["Venus", "Marte", "Júpiter", "Mercurio"],
    correct: 1,
    video: "dQw4w9WgXcQ",
    title: "La primera sorpresa",
    accent: "#496b50",
  },
  {
    question: "¿Cuántos minutos tiene una hora y media?",
    answers: ["60", "75", "90", "120"],
    correct: 2,
    video: "M7lc1UVf-VE",
    title: "Algo para sonreír",
    accent: "#66856b",
  },
  {
    question: "¿Cuál es la capital de Portugal?",
    answers: ["Oporto", "Coímbra", "Lisboa", "Braga"],
    correct: 2,
    video: "ysz5S6PUM-U",
    title: "La tercera pieza",
    accent: "#365b43",
  },
  {
    question: "¿Qué animal aparece en el escudo de Madrid?",
    answers: ["Un lobo", "Un oso", "Un águila", "Un caballo"],
    correct: 1,
    video: "jNQXAC9IVRw",
    title: "A mitad del camino",
    accent: "#78957b",
  },
  {
    question: "¿Cuántos lados tiene un hexágono?",
    answers: ["Cinco", "Seis", "Siete", "Ocho"],
    correct: 1,
    video: "aqz-KE-bpKQ",
    title: "La quinta sorpresa",
    accent: "#56765f",
  },
  {
    question: "¿Cuál de estos instrumentos tiene teclas?",
    answers: ["Violín", "Trompeta", "Piano", "Arpa"],
    correct: 2,
    video: "ScMzIvxBSi4",
    title: "Ya casi estás",
    accent: "#2f5940",
  },
  {
    question: "¿Qué número completa la serie: 2, 4, 6, 8...?",
    answers: ["9", "10", "11", "12"],
    correct: 1,
    video: "L_jWHffIx5E",
    title: "El gran final",
    accent: "#173f2a",
  },
];

const STORAGE_KEY = "siete-dias-demo-progress";
const ACCESS_KEY = "feliz-cumpleanos-access";
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const state = {
  currentDay: Number(localStorage.getItem("siete-dias-demo-day") || 1),
  unlocked: new Set(saved),
};

const challenge = document.querySelector("#challenge");
const daysGrid = document.querySelector("#daysGrid");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const daySelect = document.querySelector("#daySelect");
const todayTitle = document.querySelector("#todayTitle");
const todayPill = document.querySelector("#todayPill");
const toast = document.querySelector("#toast");
const accessScreen = document.querySelector("#accessScreen");
const accessForm = document.querySelector("#accessForm");
const accessPassword = document.querySelector("#accessPassword");
const accessError = document.querySelector("#accessError");
const siteShell = document.querySelector("#siteShell");

function normalizePassword(value) {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function openSite() {
  localStorage.setItem(ACCESS_KEY, "granted");
  accessScreen.hidden = true;
  siteShell.hidden = false;
  document.body.classList.remove("access-locked");
}

function initializeAccess() {
  if (localStorage.getItem(ACCESS_KEY) === "granted") {
    openSite();
    return;
  }

  document.body.classList.add("access-locked");
  accessPassword.focus();
}

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = normalizePassword(accessPassword.value);

  if (password === "libelula110426") {
    accessError.textContent = "";
    openSite();
    return;
  }

  accessForm.classList.remove("is-wrong");
  void accessForm.offsetWidth;
  accessForm.classList.add("is-wrong");
  accessError.textContent = "Esa no es. El comité empieza a sospechar.";
  accessPassword.select();
});

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.unlocked]));
  localStorage.setItem("siete-dias-demo-day", String(state.currentDay));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderChallenge(index = state.currentDay - 1) {
  const day = days[index];
  todayTitle.textContent = state.unlocked.has(index)
    ? day.title
    : index === state.currentDay - 1
      ? "Tu pista de hoy"
      : `Sorpresa del día ${index + 1}`;
  todayPill.textContent = `DÍA ${index + 1}`;

  if (state.unlocked.has(index)) {
    challenge.innerHTML = `
      <article class="video-card">
        <div class="video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${day.video}?rel=0"
            title="${day.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="video-caption">
          <strong>${day.title}</strong>
          <span>Día ${index + 1} de 7</span>
        </div>
      </article>
    `;
    return;
  }

  challenge.innerHTML = `
    <article class="challenge-card">
      <div class="challenge-art" style="--accent: ${day.accent}">
        <span class="art-number">${index + 1}</span>
      </div>
      <div class="challenge-content">
        <span class="question-count">PREGUNTA ${index + 1} DE 7</span>
        <h3>${day.question}</h3>
        <div class="answers">
          ${day.answers
            .map(
              (answer, answerIndex) => `
                <button class="answer" type="button" data-answer="${answerIndex}">
                  <span>${String.fromCharCode(65 + answerIndex)}</span>${answer}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    </article>
  `;

  challenge.querySelectorAll(".answer").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = Number(button.dataset.answer);
      if (answer === day.correct) {
        state.unlocked.add(index);
        save();
        showToast("¡Correcto! Has desbloqueado la sorpresa.");
        render();
      } else {
        button.classList.remove("wrong");
        void button.offsetWidth;
        button.classList.add("wrong");
        showToast("Esa no era. Prueba otra vez.");
      }
    });
  });
}

function renderDays() {
  daysGrid.innerHTML = days
    .map((day, index) => {
      const unlocked = state.unlocked.has(index);
      const available = index < state.currentDay && !unlocked;
      const status = unlocked
        ? "Descubierto"
        : available
          ? index === state.currentDay - 1
            ? "Disponible hoy"
            : "Pendiente"
          : `En ${index - state.currentDay + 1} día${index - state.currentDay + 1 === 1 ? "" : "s"}`;

      return `
        <article
          class="day-card ${unlocked ? "unlocked" : available ? "available" : "locked"}"
          data-day="${index}"
          ${unlocked || available ? 'tabindex="0" role="button"' : ""}
        >
          <span class="day-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            ${!unlocked && !available ? '<div class="lock">○</div>' : ""}
            <div class="day-status">${status}</div>
          </div>
        </article>
      `;
    })
    .join("");

  daysGrid.querySelectorAll("[role='button']").forEach((card) => {
    const openDay = () => {
      renderChallenge(Number(card.dataset.day));
      document.querySelector("#todaySection").scrollIntoView({ behavior: "smooth" });
    };
    card.addEventListener("click", openDay);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openDay();
    });
  });
}

function render() {
  renderChallenge();
  renderDays();
  progressText.textContent = `${state.unlocked.size} de 7 descubiertos`;
  progressBar.style.width = `${(state.unlocked.size / 7) * 100}%`;
  daySelect.value = String(state.currentDay);
}

daySelect.addEventListener("change", () => {
  state.currentDay = Number(daySelect.value);
  save();
  render();
  showToast(`Ahora estás viendo el día ${state.currentDay}.`);
});

document.querySelector("#resetButton").addEventListener("click", () => {
  state.unlocked.clear();
  state.currentDay = 1;
  save();
  render();
  showToast("La demo ha vuelto al día 1.");
});

initializeAccess();
render();
