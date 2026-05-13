import type { CuestionarioPayload, Question, QuestionnairePalette } from "@/interfaces/actividades";

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function fontFamilyCss(fontFamily: string): string {
    if (fontFamily === "roboto") return "'Roboto', sans-serif";
    if (fontFamily === "source-sans-3") return "'Source Sans 3', sans-serif";
    return "'Inter', sans-serif";
}

function fontImport(fontFamily: string): string {
    if (fontFamily === "roboto")
        return "https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap";
    if (fontFamily === "source-sans-3")
        return "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap";
    return "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
}

export function generateHtmlActivity(
    payload: CuestionarioPayload,
    title: string,
    subject: string
): string {
    const palette: QuestionnairePalette = payload.palette ?? {
        fontFamily: "inter",
        titleSize: 20,
        subtitleSize: 18,
        bodySize: 16,
        textColor: "#0F172A",
        backgroundColor: "#FFFFFF",
        mode: "alto-contraste",
    };

    const questionsJson = JSON.stringify(payload.questions.map((q: Question) => ({
        id: q.id,
        title: q.title,
        imageUrl: q.imageUrl ?? "",
        imageAlt: q.imageAlt ?? "",
        options: q.options.map((o) => ({ id: o.id, label: o.label, isCorrect: o.isCorrect })),
        explanation: q.explanation ?? "",
    })));

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="${fontImport(palette.fontFamily)}" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fontFamilyCss(palette.fontFamily)};
      background: ${escapeHtml(palette.backgroundColor)};
      color: ${escapeHtml(palette.textColor)};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }
    .container { width: 100%; max-width: 720px; }
    .header {
      background: linear-gradient(90deg, #0F172A 0%, #123F7A 55%, #135BEC 100%);
      border-radius: 1rem 1rem 0 0;
      padding: 1.5rem 2rem;
      color: white;
    }
    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border-radius: 999px;
      padding: 0.2rem 0.75rem;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }
    .activity-title {
      font-size: ${palette.titleSize + 8}px;
      font-weight: 700;
      line-height: 1.15;
    }
    .card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-top: none;
      border-radius: 0 0 1rem 1rem;
      padding: 2rem;
    }
    .instructions {
      font-size: ${palette.bodySize}px;
      color: #475569;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .question-block { margin-bottom: 2rem; }
    .question-counter {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #94A3B8;
      margin-bottom: 0.5rem;
    }
    .question-title {
      font-size: ${palette.subtitleSize}px;
      font-weight: 700;
      color: ${escapeHtml(palette.textColor)};
      margin-bottom: 1rem;
      line-height: 1.4;
    }
    .question-image {
      width: 100%;
      max-height: 280px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .options { display: flex; flex-direction: column; gap: 0.6rem; }
    .option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 0.75rem;
      cursor: pointer;
      background: white;
      font-size: ${palette.bodySize}px;
      font-weight: 500;
      color: ${escapeHtml(palette.textColor)};
      transition: border-color 0.2s, background 0.2s;
      text-align: left;
      width: 100%;
    }
    .option:hover { border-color: #135BEC; background: #EEF4FF; }
    .option.selected { border-color: #135BEC; background: #EEF4FF; }
    .option.correct { border-color: #10B981; background: #ECFDF5; }
    .option.incorrect { border-color: #EF4444; background: #FEF2F2; }
    .option-dot {
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 2px solid #CBD5E1;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s, background 0.2s;
    }
    .option.selected .option-dot { border-color: #135BEC; background: #135BEC; }
    .option.correct .option-dot { border-color: #10B981; background: #10B981; }
    .option.incorrect .option-dot { border-color: #EF4444; background: #EF4444; }
    .dot-inner { width: 6px; height: 6px; border-radius: 50%; background: white; }
    .feedback-box {
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 13px;
      line-height: 1.6;
      display: none;
    }
    .feedback-box.show { display: block; }
    .feedback-correct { background: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; }
    .feedback-incorrect { background: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; }
    .nav-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
      gap: 1rem;
    }
    .btn-primary {
      padding: 0.75rem 2rem;
      background: #135BEC;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: ${palette.bodySize}px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #0f4fd1; }
    .btn-primary:disabled { background: #94A3B8; cursor: not-allowed; }
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: white;
      color: #475569;
      border: 1.5px solid #E2E8F0;
      border-radius: 0.75rem;
      font-size: ${palette.bodySize}px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .btn-secondary:hover { background: #F8FAFC; }
    .progress-bar-container {
      height: 4px;
      background: #E2E8F0;
      border-radius: 999px;
      margin-bottom: 1.5rem;
    }
    .progress-bar {
      height: 100%;
      background: #135BEC;
      border-radius: 999px;
      transition: width 0.4s ease;
    }
    .final-message {
      text-align: center;
      padding: 2rem;
      display: none;
    }
    .final-message.show { display: block; }
    .score-circle {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: #EEF4FF;
      border: 3px solid #135BEC;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
      font-size: 24px;
      font-weight: 700;
      color: #135BEC;
    }
    .objective-box {
      background: #EEF4FF;
      border: 1px solid #BFDBFE;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      font-size: 13px;
      color: #1E40AF;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">${escapeHtml(subject)}</div>
      <h1 class="activity-title">${escapeHtml(title)}</h1>
    </div>
    <div class="card">
      ${payload.objective ? `<div class="objective-box"><strong>Objetivo:</strong> ${escapeHtml(payload.objective)}</div>` : ""}
      ${payload.instructions ? `<p class="instructions">${escapeHtml(payload.instructions)}</p>` : ""}
      <div class="progress-bar-container">
        <div class="progress-bar" id="progressBar" style="width:0%"></div>
      </div>
      <div id="questionsContainer"></div>
      <div id="finalMessage" class="final-message">
        <div class="score-circle" id="scoreCircle">0%</div>
        <h2 style="font-size:${palette.subtitleSize + 2}px;font-weight:700;margin-bottom:0.5rem">
          ${payload.generalMessage ? escapeHtml(payload.generalMessage) : "¡Actividad completada!"}
        </h2>
        <p style="color:#64748B;font-size:${palette.bodySize}px;margin-bottom:1.5rem">
          Revisaste todas las preguntas.
        </p>
        <button class="btn-primary" onclick="restartActivity()">Reintentar</button>
      </div>
      <div class="nav-buttons" id="navButtons">
        <button class="btn-secondary" id="prevBtn" onclick="prevQuestion()" disabled>Anterior</button>
        <span id="questionCounter" style="font-size:13px;color:#94A3B8;font-weight:600"></span>
        <button class="btn-primary" id="nextBtn" onclick="nextQuestion()">Siguiente</button>
      </div>
    </div>
  </div>
  <script>
    const questions = ${questionsJson};
    const feedbackMode = ${JSON.stringify(payload.feedbackMode)};
    const showCorrectAnswers = ${payload.showCorrectAnswers ? "true" : "false"};
    let currentIndex = 0;
    let answers = new Array(questions.length).fill(null);
    let submitted = new Array(questions.length).fill(false);
    // Shuffled option order per question, frozen for the whole session
    let shuffledOptions = [];

    function fisherYatesShuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function buildShuffledOptions() {
      shuffledOptions = questions.map(q => fisherYatesShuffle(q.options));
    }

    function renderQuestion(index) {
      const q = questions[index];
      const displayOptions = shuffledOptions[index] || q.options;
      const container = document.getElementById('questionsContainer');
      const isSubmitted = submitted[index];
      const selectedOptionId = answers[index];

      const optionsHtml = displayOptions.map(opt => {
        let cls = 'option';
        if (selectedOptionId === opt.id) {
          cls += isSubmitted ? (opt.isCorrect ? ' correct' : ' incorrect') : ' selected';
        } else if (isSubmitted && opt.isCorrect && showCorrectAnswers) {
          cls += ' correct';
        }
        return \`<button class="\${cls}" onclick="selectOption('\${opt.id}')" \${isSubmitted ? 'disabled' : ''}>
          <span class="option-dot"><span class="dot-inner" style="display:\${selectedOptionId === opt.id || (isSubmitted && opt.isCorrect) ? 'block' : 'none'}"></span></span>
          \${opt.label}
        </button>\`;
      }).join('');

      let feedbackHtml = '';
      if (isSubmitted && feedbackMode === 'per-question') {
        const isCorrect = q.options.find(o => o.id === selectedOptionId)?.isCorrect ?? false;
        feedbackHtml = \`<div class="feedback-box show \${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
          <strong>\${isCorrect ? '✓ Correcto' : '✗ Incorrecto'}</strong>
          \${q.explanation ? '<br>' + q.explanation : ''}
        </div>\`;
      }

      container.innerHTML = \`
        <div class="question-block">
          <p class="question-counter">Pregunta \${index + 1} de \${questions.length}</p>
          <h2 class="question-title">\${q.title}</h2>
          \${q.imageUrl ? \`<img src="\${q.imageUrl}" alt="\${q.imageAlt || ''}" class="question-image" />\` : ''}
          <div class="options">\${optionsHtml}</div>
          \${feedbackHtml}
        </div>
      \`;

      document.getElementById('progressBar').style.width = \`\${(index / questions.length) * 100}%\`;
      document.getElementById('questionCounter').textContent = \`\${index + 1} / \${questions.length}\`;
      document.getElementById('prevBtn').disabled = index === 0;
      updateNextBtn();
    }

    function updateNextBtn() {
      const btn = document.getElementById('nextBtn');
      if (currentIndex === questions.length - 1) {
        btn.textContent = 'Finalizar';
      } else {
        btn.textContent = 'Siguiente';
      }
    }

    // Use currentIndex directly. The visible question is always currentIndex
    // and the user can only click options on the visible question.
    function selectOption(optionId) {
      if (submitted[currentIndex]) return;
      answers[currentIndex] = optionId;
      if (feedbackMode === 'per-question') {
        submitted[currentIndex] = true;
      }
      renderQuestion(currentIndex);
    }

    function nextQuestion() {
      if (!submitted[currentIndex] && feedbackMode === 'per-question' && answers[currentIndex]) {
        submitted[currentIndex] = true;
        renderQuestion(currentIndex);
        return;
      }
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion(currentIndex);
      } else {
        finishActivity();
      }
    }

    function prevQuestion() {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion(currentIndex);
      }
    }

    function finishActivity() {
      submitted = submitted.map(() => true);
      const correct = questions.filter((q, i) => {
        const ans = answers[i];
        return ans && q.options.find(o => o.id === ans)?.isCorrect;
      }).length;
      const pct = Math.round((correct / questions.length) * 100);
      document.getElementById('questionsContainer').innerHTML = '';
      document.getElementById('navButtons').style.display = 'none';
      document.getElementById('progressBar').style.width = '100%';
      const fm = document.getElementById('finalMessage');
      fm.classList.add('show');
      document.getElementById('scoreCircle').textContent = pct + '%';
    }

    function restartActivity() {
      currentIndex = 0;
      answers = new Array(questions.length).fill(null);
      submitted = new Array(questions.length).fill(false);
      buildShuffledOptions();
      document.getElementById('navButtons').style.display = 'flex';
      document.getElementById('finalMessage').classList.remove('show');
      renderQuestion(0);
    }

    buildShuffledOptions();
    renderQuestion(0);
  </script>
</body>
</html>`;
}
