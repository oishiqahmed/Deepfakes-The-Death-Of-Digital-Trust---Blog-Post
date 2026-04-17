// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.what-layout, .problem-grid, .media-type-card, .impact-card, .case-card, .solution-card, .why-point, .tip, .era-block, .fact-item, .conclusion-layout').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.big-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

// ===== QUIZ =====
const quizData = [
  {
    question: "Real Event or AI Fabrication?",
    scenario: `"A US Senator was nearly deceived during a video call by what appeared to be a senior Ukrainian diplomat — complete with name, face, and voice — requesting sensitive intelligence about military operations."`,
    options: ["This really happened", "AI-fabricated scenario"],
    answer: 0,
    explanation: "This is real. In 2023, US Senator Ben Cardin was nearly deceived on a Zoom call by a deepfake impersonating a Ukrainian official. The incident prompted urgent security reviews in Congress."
  },
  {
    question: "Voice Clone — Fact or Fiction?",
    scenario: `"A voice clone requires hours of high-quality studio audio of a person before it can be convincingly replicated by AI systems."`,
    options: ["True statement", "False — the reality is different"],
    answer: 1,
    explanation: "False. AI voice cloning technology requires as little as 3 seconds of audio to generate a clone with 85% voice match accuracy. Source audio can be scraped from social media posts, interviews, or public videos."
  },
  {
    question: "Real Incident or Fiction?",
    scenario: `"Fraudsters used a video deepfake to impersonate a company's Chief Financial Officer on a live multi-person video conference call, convincing an employee to authorize a $25 million wire transfer."`,
    options: ["This actually occurred", "AI-fabricated scenario"],
    answer: 0,
    explanation: "This occurred in Hong Kong in January 2024. It remains one of the largest financial losses directly attributed to deepfake technology and triggered global corporate security alerts."
  },
  {
    question: "Statistic — Real or Manufactured?",
    scenario: `"According to a 2024 Deloitte consumer study, 59% of respondents reported difficulty distinguishing between content created by AI versus content created by humans."`,
    options: ["Genuine statistic", "Fabricated statistic"],
    answer: 0,
    explanation: "This is a genuine finding from Deloitte's 2024 Connected Consumer Survey. The study also found that 68% of respondents familiar with generative AI feared synthetic content would be used to deceive them."
  },
  {
    question: "Media Claim — True or Deepfake?",
    scenario: `"In 2024, AI-generated images of Taylor Swift were shared on X (formerly Twitter), reaching approximately 47 million views before the platform removed them."`,
    options: ["This really happened", "AI-fabricated scenario"],
    answer: 0,
    explanation: "This is real. The incident in January 2024 triggered congressional calls for federal legislation criminalizing non-consensual AI-generated intimate imagery, and X temporarily blocked searches for the artist's name."
  },
  {
    question: "Detection Capability — Fact or Fiction?",
    scenario: `"Leading AI deepfake detection tools achieve 100% accuracy in identifying synthetic audio and video, making them fully reliable for use by journalists and law enforcement."`,
    options: ["True — detection is solved", "False — detection remains unreliable"],
    answer: 1,
    explanation: "False. Audio deepfake detectors achieve roughly 88.9% accuracy in controlled settings — and this degrades under adversarial conditions. Experts at the Tow Center for Digital Journalism warn that detection tools may even contribute to false security and weaken journalistic rigor."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion(index) {
  const q = quizData[index];
  answered = false;

  document.getElementById('questionNum').textContent = String(index + 1).padStart(2, '0');
  document.getElementById('progressLabel').textContent = `Question ${index + 1} of ${quizData.length}`;
  document.getElementById('progressFill').style.width = `${(index / quizData.length) * 100}%`;

  document.getElementById('quizContent').innerHTML = `
    <h3>${q.question}</h3>
    <p>Examine the scenario below. Is this a real, documented event/fact — or a fabricated AI-generated scenario?</p>
    <div class="quiz-scenario">${q.scenario}</div>
  `;

  const optionsEl = document.getElementById('quizOptions');
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(i));
    optionsEl.appendChild(btn);
  });

  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNext').style.display = 'none';
}

function handleAnswer(selected) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const isCorrect = selected === q.answer;
  if (isCorrect) score++;

  const buttons = document.querySelectorAll('.quiz-opt-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === selected && !isCorrect) btn.classList.add('incorrect');
  });

  const feedback = document.getElementById('quizFeedback');
  feedback.style.display = 'block';
  feedback.className = `quiz-feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`;
  feedback.innerHTML = `<strong>${isCorrect ? '✓ Correct.' : '✗ Not quite.'}</strong> ${q.explanation}`;

  document.getElementById('quizNext').style.display = 'block';
}

document.getElementById('quizNext').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion(currentQuestion);
  } else {
    showScore();
  }
});

function showScore() {
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('quizCard').style.display = 'none';
  const scoreEl = document.getElementById('quizScore');
  scoreEl.style.display = 'block';

  document.getElementById('scoreNum').textContent = score;

  const pct = score / quizData.length;
  let icon, headline, msg;

  if (pct === 1) {
    icon = '🏆';
    headline = 'Exceptional Awareness';
    msg = 'You identified every scenario correctly. You are well-equipped to navigate the deepfake landscape — but remember, these lines are blurring every day. Stay skeptical, stay curious.';
  } else if (pct >= 0.67) {
    icon = '🎯';
    headline = 'Strong Digital Literacy';
    msg = 'You caught most of the deceptions. The scenarios you missed illustrate how sophisticated synthetic media has become. Keep building your critical evaluation skills.';
  } else if (pct >= 0.34) {
    icon = '🔎';
    headline = 'Room to Sharpen';
    msg = 'You identified some, but missed others — which is entirely normal. This is exactly why media literacy training matters. The technology is designed to deceive even careful observers.';
  } else {
    icon = '⚠️';
    headline = 'The Deception Worked';
    msg = 'The synthetic scenarios fooled you — and that\'s the point. Deepfakes are engineered to bypass human intuition. Review the explanations and remember: skepticism is a skill, not a personality trait.';
  }

  document.getElementById('scoreIcon').textContent = icon;
  document.getElementById('scoreHeadline').textContent = headline;
  document.getElementById('scoreMsg').textContent = msg;
}

document.getElementById('quizRestart').addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  document.getElementById('quizScore').style.display = 'none';
  document.getElementById('quizCard').style.display = 'block';
  loadQuestion(0);
});

// Initialize quiz
loadQuestion(0);

// ===== STAGGER REVEAL FOR GRIDS =====
function staggerReveal(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll(selector));
        siblings.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * delay);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  if (elements.length) obs.observe(elements[0]);
}

staggerReveal('.media-type-card', 120);
staggerReveal('.impact-card', 100);
staggerReveal('.case-card', 100);
staggerReveal('.solution-card', 120);
