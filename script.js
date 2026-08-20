'use strict';

const LETTERS = ['A', 'B', 'C'];

const ACCOUNTS = [
  { gmail: 'azharotb@gmail.com', password: '12345', role: 'Lead judge' },
  { gmail: 'azharotb1@gmail.com', password: '12344', role: 'Judge one' },
  { gmail: 'azharotb2@gmail.com', password: '12345', role: 'Judge two' },
  { gmail: 'kuttipencil1@gmail.com', password: '12345', role: 'Judge three' },
  { gmail: 'kuttipencil2@gmail.com', password: '12345', role: 'Judge four' },
  { gmail: 'kuttipencil3@gmail.com', password: '12345', role: 'Judge five' },
];

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

function getAllAccounts() {
  const extra = store.get('login', null);
  const extraList = (Array.isArray(extra) ? extra : []).map(function (a) {
    return {
      gmail: a.gmail,
      password: a.password != null ? a.password : a.pass,
      role: a.role || 'Judge',
    };
  });
  return ACCOUNTS.concat(extraList);
}

const ICON_PATHS = {
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  lock: '<circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  unlock: '<circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 9.33-2.5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
};

function icon(name, size, sw) {
  const strokeWidth = sw == null ? 2 : sw;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + strokeWidth + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON_PATHS[name] + '</svg>';
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

let email = localStorage.getItem('judgeEmail') || null;
let programmes = store.get('programmes', null);
let marks = store.get('marks', {});
let present = store.get('present', {});

function getProgrammes() {
  return Array.isArray(programmes) ? programmes : [];
}
function lockedProgrammes() {
  return getProgrammes().filter(function (p) { return p.locked; });
}
function programmeByName(name) {
  if (!name) return null;
  const decoded = decodeURIComponent(name);
  return getProgrammes().find(function (p) { return p.name === decoded; }) || null;
}
function lockProgramme(id) {
  programmes = getProgrammes().map(function (p) {
    return Object.assign({}, p, { locked: p.id === id || p.name === id });
  });
  store.set('programmes', programmes);
}
function allLettersSaved(prog) {
  if (!email) return false;
  const perJudge = (marks[prog.name] || {})[email];
  if (!perJudge) return false;
  return LETTERS.every(function (l) { return Boolean(perJudge[l]); });
}
function initialLetter(prog) {
  const perJudge = (marks[prog.name] || {})[email] || {};
  let idx = 0;
  while (idx < LETTERS.length && perJudge[LETTERS[idx]]) idx++;
  return Math.min(idx, LETTERS.length - 1);
}
function finishedKey(prog) {
  return 'finished_' + (email || '') + '_' + (prog ? prog.name : '');
}
function isFinished(prog) {
  return Boolean(store.get(finishedKey(prog), false));
}
function markFinished(prog) {
  store.set(finishedKey(prog), true);
}

const stage = document.getElementById('stage');
const judgeChip = document.getElementById('judge-chip');
const signOutBtn = document.getElementById('sign-out');
const brandHome = document.getElementById('brand-home');

function updateTopbar() {
  judgeChip.textContent = email || '';
  signOutBtn.hidden = !email;
  brandHome.setAttribute('href', email ? '#/welcome' : '#/login');
}

function nav(path, replace) {
  const target = '#' + (path === '/' ? '/' : path);
  if (replace) {
    try {
      history.replaceState(null, '', target);
    } catch (e) {
      window.location.hash = target;
    }
    route();
  } else {
    window.location.hash = target;
  }
}

function viewLoading() {
  stage.innerHTML =
    '<div class="content-wrap narrow">' +
    '<div class="surface surface-pad fade-in">' +
    '<div class="eyebrow">OTB judging desk</div>' +
    '<div class="skeleton-line"></div>' +
    '<div class="skeleton-line short"></div>' +
    '</div></div>';
}

function viewLogin() {
  stage.innerHTML =
    '<div class="content-wrap wide login-layout">' +
    '<div class="login-intro fade-in">' +
    '<span class="notebook-tag">' + icon('sparkles', 13, 2) + ' A calm place to make a call</span>' +
    '<h1 class="title">Give every idea<br><span style="color:var(--coral)">a fair page.</span></h1>' +
    '<p class="subtitle" style="margin-top:1.1rem">Welcome to AL-AZHAR\'s OTB judging desk. Bring your observation, choose a score, and let the next brilliant idea turn the page.</p>' +
    '<p style="font-family:var(--app-font-mono);font-size:.72rem;color:var(--teal);margin-top:1.2rem;display:inline-flex;align-items:center;gap:.45rem;">' + icon('clipboard', 18, 2) + ' Three letters. One thoughtful judgement.</p>' +
    '</div>' +
    '<form class="surface surface-pad login-card fade-in delay-1" id="login-form" novalidate>' +
    '<div class="eyebrow">Judge access</div>' +
    '<h2 class="serif" style="font-size:1.8rem;margin:.35rem 0 0;">Ready when you are.</h2>' +
    '<p style="font-size:.78rem;color:var(--ink-soft);margin:.4rem 0 0;">Use the Gmail and password printed on your ID card.</p>' +
    '<div class="form-stack">' +
    '<div class="field"><label for="gmail">Gmail</label>' +
    '<input type="email" id="gmail" placeholder="judge@al-azhar.edu" autocomplete="username" required data-testid="input-gmail"></div>' +
    '<div class="field"><label for="password">Password</label>' +
    '<input type="password" id="password" placeholder="Enter your password" autocomplete="current-password" required data-testid="input-password"></div>' +
    '<button class="button primary full" type="submit" data-testid="button-login">Open judging desk ' + icon('arrowRight', 17, 2) + '</button>' +
    '<p class="error-message" role="alert" data-testid="status-login-error"></p>' +
    '</div>' +
    '</form></div>';

  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const gmail = document.getElementById('gmail').value.trim();
    const password = document.getElementById('password').value;
    const found = getAllAccounts().find(function (a) {
      return a.gmail.toLowerCase() === gmail.toLowerCase() && a.password === password;
    });
    const err = stage.querySelector('[data-testid="status-login-error"]');
    if (!found) {
      err.textContent = 'That Gmail and password do not match a judge account.';
      return;
    }
    email = found.gmail;
    localStorage.setItem('judgeEmail', email);
    updateTopbar();
    nav('/welcome');
  });
}

function viewWelcome() {
  if (!email) { nav('/login', true); return; }
  const lockedList = lockedProgrammes();
  let inner;
  if (lockedList.length > 0) {
    const items = lockedList.map(function (p) {
      const done = isFinished(p) || allLettersSaved(p);
      return '<button class="programme-option' + (done ? '' : ' locked') + '" type="button" data-prog="' + encodeURIComponent(p.name) + '" data-testid="button-open-programme">' +
        '<span class="programme-name-row">' +
        '<span class="programme-icon">' + icon('award', 18, 2) + '</span>' +
        '<span class="programme-name-text">' + esc(p.name) + '</span>' +
        '</span>' + icon('arrowRight', 18, 2) +
        '</button>';
    }).join('');
    inner =
      '<div class="alert-strip">' + icon('lock', 16, 2) + '<span><strong>' + lockedList.length + ' programme' + (lockedList.length > 1 ? 's' : '') + ' on your desk.</span></div>' +
      '<div class="eyebrow">Active programmes</div>' +
      '<div class="programme-list">' + items + '</div>';
  } else {
    inner =
      '<div class="eyebrow">Your programme list</div>' +
      '<div class="empty-box" data-testid="status-no-programme">' +
      icon('book', 34, 1.6) +
      '<strong style="color:var(--navy);">No programme on your desk yet.</strong>' +
      '<p style="margin:.5rem 0 0;font-size:.78rem;">Programmes appear here once the admin panel locks them onto the desk.</p>' +
      '</div>';
  }

  stage.innerHTML =
    '<div class="content-wrap wide welcome-grid">' +
    '<div class="welcome-head fade-in">' +
    '<div>' +
    '<div class="eyebrow">Good to see you, judge</div>' +
    '<h1 class="title">Choose your<br><span style="color:var(--teal)">programme.</span></h1>' +
    '<p class="subtitle" style="margin-top:1.1rem">Open any programme on your desk, score its letters, and move on to the next.</p>' +
    '</div>' +
    '<span class="judge-badge" data-testid="text-welcome-email">' + esc(email) + '</span>' +
    '</div>' +
    '<div class="surface surface-pad fade-in delay-1">' +
    '<div class="welcome-surface-body">' + inner + '</div>' +
    '</div></div>';

  stage.querySelectorAll('.programme-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      nav('/programme/' + btn.getAttribute('data-prog'));
    });
  });
}

function renderScoring(prog, letterIdx) {
  const letterRail = LETTERS.map(function (l, i) {
    const cls = (i === letterIdx ? ' active' : '') + (i < letterIdx ? ' done' : '');
    const dot = i < letterIdx ? icon('check', 14, 2.5) : l;
    const line = i < LETTERS.length - 1 ? '<span class="letter-line"></span>' : '';
    return '<span class="letter-step' + cls + '"><span class="letter-dot">' + dot + '</span>' + line + '</span>';
  }).join('');

  const rows = prog.criteria.map(function (c, i) {
    const max = Number(c.marks) || 0;
    return '<tr>' +
      '<td><div class="criteria-label">' + esc(c.agenda) + '</div>' +
      (c.detail ? '<div class="criteria-description">' + esc(c.detail) + '</div>' : '') + '</td>' +
      '<td style="font-family:var(--app-font-mono);color:var(--ink-soft);">' + max + '</td>' +
      '<td><input class="marks-input" type="number" inputMode="numeric" min="0" max="' + max + '" value="" aria-label="Mark for ' + esc(c.agenda) + '" data-testid="input-mark-' + i + '" data-idx="' + i + '"></td>' +
      '</tr>';
  }).join('');

  const maxTotal = prog.criteria.reduce(function (a, c) { return a + (Number(c.marks) || 0); }, 0);

  stage.innerHTML =
    '<div class="score-shell">' +
    '<div class="score-header fade-in">' +
    '<div>' +
    '<a href="#/welcome" class="eyebrow" data-testid="link-back-welcome" style="display:inline-flex;align-items:center;gap:.35rem;text-decoration:none;">' + icon('arrowLeft', 13, 2) + ' Programme desk</a>' +
    '<h1 class="title">' + esc(prog.name) + '</h1>' +
    '<p class="score-context" style="margin-top:.6rem;">Logged in as ' + esc(email) + ' · take your time with each letter.</p>' +
    '</div>' +
    '<div class="letter-rail" aria-label="Scoring letter ' + LETTERS[letterIdx] + '" data-testid="status-letter-progress">' + letterRail + '</div>' +
    '</div>' +
    '<section class="surface score-card fade-in delay-1">' +
    '<div class="score-card-top">' +
    '<div><div class="eyebrow">Code letter ' + LETTERS[letterIdx] + '</div><h2>What did you notice?</h2></div>' +
    '<div class="score-total-note">Available total<strong>' + maxTotal + '</strong></div>' +
    '</div>' +
    '<div class="alert-strip">' + icon('alert', 16, 2) + '<span>Score the work in front of you. Marks are saved for <strong>letter ' + LETTERS[letterIdx] + '</strong> when you submit.</span></div>' +
    '<table class="criteria-table">' +
    '<thead><tr><th>Criterion</th><th>Max</th><th>Your mark</th></tr></thead>' +
    '<tbody>' + rows +
    '<tr class="total-row"><td>Total for ' + LETTERS[letterIdx] + '</td><td>' + maxTotal + '</td><td data-testid="text-judge-total">0</td></tr>' +
    '</tbody></table>' +
    '<div class="score-footer">' +
    '<p class="score-footer-note" role="alert" data-testid="status-score-error">Letter ' + LETTERS[letterIdx] + ' of ' + LETTERS.length + ' · your score stays on this device.</p>' +
    '<button class="button primary" type="button" data-testid="button-submit-score" id="submit-score">' +
    (letterIdx === LETTERS.length - 1 ? 'Finish judgement' : 'Submit letter ' + LETTERS[letterIdx]) + ' ' + icon('arrowRight', 17, 2) +
    '</button>' +
    '</div></section></div>';

  const inputs = Array.from(stage.querySelectorAll('.marks-input'));
  const totalEl = stage.querySelector('[data-testid="text-judge-total"]');
  const noteEl = stage.querySelector('[data-testid="status-score-error"]');

  inputs.forEach(function (inp) {
    inp.addEventListener('input', function () {
      clearInvalid(inp);
      const t = inputs.reduce(function (sum, el) {
        const val = Number(el.value);
        return sum + (el.value.trim() !== '' && !isNaN(val) && Number.isInteger(val) ? val : 0);
      }, 0);
      totalEl.textContent = String(t);
    });
  });

  document.getElementById('submit-score').addEventListener('click', function () {
    handleSubmit(prog, letterIdx, inputs, noteEl);
  });
}

function clearInvalid(inp) {
  inp.classList.remove('invalid');
}

function validateInputs(inputs) {
  inputs.forEach(function (inp) {
    const max = Number(inp.max) || 0;
    const val = inp.value.trim();
    if (val === '' || isNaN(Number(val)) || !Number.isInteger(Number(val)) || Number(val) < 0 || Number(val) > max) {
      inp.classList.add('invalid');
    } else {
      inp.classList.remove('invalid');
    }
  });
}

async function handleSubmit(prog, letterIdx, inputs, noteEl) {
  const btn = document.getElementById('submit-score');
  const values = inputs.map(function (el) { return el.value; });

  validateInputs(inputs);
  if (present[prog.name]) { nav('/rejected', true); return; }
  if (values.some(function (v) { return v === ''; })) {
    noteEl.textContent = 'Give each criterion a mark before submitting this letter.';
    return;
  }
  if (values.some(function (v, i) { return Number(v) < 0 || Number(v) > (Number(prog.criteria[i].marks) || 0); })) {
    noteEl.textContent = 'Each mark must sit between zero and the total marks shown.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving mark…';
  await new Promise(function (resolve) { setTimeout(resolve, 260); });

  const rows = values.map(Number);
  const total = rows.reduce(function (a, b) { return a + b; }, 0);
  marks = store.get('marks', {});
  if (!marks[prog.name]) marks[prog.name] = {};
  if (!marks[prog.name][email]) marks[prog.name][email] = {};
  marks[prog.name][email][LETTERS[letterIdx]] = { total: total, rows: rows };
  store.set('marks', marks);
  try {
    await Sync.saveJudgeMarks(prog.name, email, { [LETTERS[letterIdx]]: { total: total, rows: rows } });
  } catch (err) {
    alert('Could not sync mark to the cloud: ' + (err && err.message ? err.message : String(err)) + '\n\nThe mark is saved on this device only.');
  }

  if (letterIdx === LETTERS.length - 1) { nav('/final/' + encodeURIComponent(prog.name)); return; }
  renderScoring(prog, letterIdx + 1);
}

function viewFinalAssessment(prog) {
  if (!email) { nav('/login', true); return; }
  let perJudge = (marks[prog.name] || {})[email] || {};

  const tot = function (letter) {
    const saved = perJudge[letter];
    return saved && typeof saved.total === 'number' ? saved.total : 0;
  };

  const render = function (editing) {
    const rows = prog.criteria.map(function (c, i) {
      const cell = function (letter) {
        const saved = perJudge[letter];
        if (saved && Array.isArray(saved.rows) && saved.rows[i] != null) return String(saved.rows[i]);
        return '—';
      };
      return '<tr>' +
        '<td><div class="criteria-label">' + esc(c.agenda) + '</div>' +
        (c.detail ? '<div class="criteria-description">' + esc(c.detail) + '</div>' : '') + '</td>' +
        '<td class="final-marks">' + cell('A') + '</td>' +
        '<td class="final-marks">' + cell('B') + '</td>' +
        '<td class="final-marks">' + cell('C') + '</td>' +
        '</tr>';
    }).join('');

    let body = '';
    if (editing) {
      body = prog.criteria.map(function (c, i) {
        const max = Number(c.marks) || 0;
        const cellInput = function (letter) {
          const saved = perJudge[letter];
          const v = (saved && Array.isArray(saved.rows) && saved.rows[i] != null) ? saved.rows[i] : '';
          return '<input class="marks-input" type="number" inputMode="numeric" min="0" max="' + max + '" value="' + v + '" data-row="' + i + '" data-letter="' + letter + '" data-max="' + max + '">';
        };
        return '<tr>' +
          '<td><div class="criteria-label">' + esc(c.agenda) + '</div></td>' +
          '<td>' + cellInput('A') + '</td>' +
          '<td>' + cellInput('B') + '</td>' +
          '<td>' + cellInput('C') + '</td>' +
          '</tr>';
      }).join('');
    } else {
      body = rows;
    }

    stage.innerHTML =
      '<div class="score-shell">' +
      '<section class="surface score-card final-card fade-in">' +
      '<div class="score-card-top">' +
      '<div><div class="eyebrow">Your judgement</div><h2>Final Assessment</h2></div>' +
      '</div>' +
      '<div class="alert-strip">' + icon('checkCircle', 16, 2) + '<span>These are the marks you gave across letters <strong>A, B &amp; C</strong>.</span></div>' +
      '<table class="criteria-table final-table">' +
      '<thead><tr><th>Criterion</th><th>A</th><th>B</th><th>C</th></tr></thead>' +
      '<tbody>' + body +
      '<tr class="total-row"><td>Total</td>' +
      '<td data-total="A">' + tot('A') + '</td>' +
      '<td data-total="B">' + tot('B') + '</td>' +
      '<td data-total="C">' + tot('C') + '</td></tr>' +
      '</tbody></table>' +
      '<div class="score-footer">' +
      '<div class="final-actions">' +
      (editing
        ? '<button class="button primary white" type="button" data-testid="button-cancel-edit" id="cancel-edit">Cancel</button>' +
          '<button class="button primary" type="button" data-testid="button-save-edit" id="save-edit">Save ' + icon('check', 16, 2) + '</button>'
        : '<button class="button primary white" type="button" data-testid="button-review-judgement" id="review-judgement">Edit</button>' +
          '<button class="button primary" type="button" data-testid="button-finish-judgement" id="finish-judgement">Finish ' + icon('arrowRight', 17, 2) + '</button>') +
      '</div>' +
      '<p class="score-footer-note" role="alert">Your judgement is saved on this device.</p>' +
      '</div></section></div>';

    const finBtn = document.getElementById('finish-judgement');
    if (finBtn) finBtn.addEventListener('click', function () {
      showFinalConfirm(function () {
        markFinished(prog);
        nav((present[prog.name] ? '/rejected' : '/completed') + '/' + encodeURIComponent(prog.name), true);
      });
    });
    const editBtn = document.getElementById('review-judgement');
    if (editBtn) editBtn.addEventListener('click', function () { render(true); });

    if (editing) {
      stage.querySelectorAll('.marks-input').forEach(function (inp) {
        inp.addEventListener('input', function () {
          clearInvalid(inp);
          const letter = inp.getAttribute('data-letter');
          const letterInputs = Array.from(stage.querySelectorAll('.marks-input[data-letter="' + letter + '"]'));
          const sum = letterInputs.reduce(function (a, el) {
            const v = Number(el.value);
            return a + (isNaN(v) ? 0 : v);
          }, 0);
          stage.querySelector('[data-total="' + letter + '"]').textContent = String(sum);
        });
      });
    }

    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) cancelBtn.addEventListener('click', function () {
      marks = store.get('marks', {});
      perJudge = (marks[prog.name] || {})[email] || {};
      render(false);
    });
    const saveBtn = document.getElementById('save-edit');
    if (saveBtn) saveBtn.addEventListener('click', function () {
      const inputs = Array.from(stage.querySelectorAll('.marks-input'));
      validateInputs(inputs);
      const invalid = inputs.some(function (inp) { return inp.classList.contains('invalid'); });
      if (invalid) return;
      const updated = {};
      LETTERS.forEach(function (letter) {
        const letterInputs = inputs.filter(function (inp) { return inp.getAttribute('data-letter') === letter; });
        const vals = letterInputs.map(function (inp) { return Number(inp.value); });
        updated[letter] = { total: vals.reduce(function (a, b) { return a + b; }, 0), rows: vals };
      });
      marks = store.get('marks', {});
      if (!marks[prog.name]) marks[prog.name] = {};
      if (!marks[prog.name][email]) marks[prog.name][email] = {};
      marks[prog.name][email] = updated;
      store.set('marks', marks);
      Sync.saveJudgeMarks(prog.name, email, updated).catch(function (err) {
        alert('Could not sync to the cloud: ' + (err && err.message ? err.message : String(err)) + '\n\nThe marks are saved on this device only.');
      });
      perJudge = updated;
      render(false);
    });
  };

  render(false);
}

function viewProgramme(prog) {
  if (!email) { nav('/login', true); return; }
  if (!prog) {
    stage.innerHTML =
      '<div class="surface surface-pad status-card fade-in">' +
      '<div class="status-icon" style="background:var(--yellow);box-shadow:0 0 0 10px rgba(245,166,35,.15);color:var(--navy);">' + icon('book', 34, 1.6) + '</div>' +
      '<h1>No programme yet</h1>' +
      '<p>Choose an example programme before opening the judging sheet.</p>' +
      '<div class="status-actions"><a class="button primary" href="#/welcome" data-testid="link-choose-programme">Choose a programme ' + icon('arrowRight', 16, 2) + '</a></div>' +
      '</div>';
    return;
  }
  if (isFinished(prog)) {
    nav((present[prog.name] ? '/rejected' : '/completed') + '/' + encodeURIComponent(prog.name), true);
    return;
  }
  if (present[prog.name]) { nav('/rejected/' + encodeURIComponent(prog.name), true); return; }
  if (allLettersSaved(prog)) { nav('/final/' + encodeURIComponent(prog.name), true); return; }
  renderScoring(prog, initialLetter(prog));
}

function viewStatus(rejected, progName) {
  const completed = !rejected;
  const body = completed
    ? 'Thank you for giving this programme your full attention. Your judgement is safely saved on this device.'
    : 'This programme was marked present too late for judging. No marks can be submitted now.';
  const meta = progName ? progName + ' · ' + (completed ? 'judgement recorded' : 'submission closed') : '';
  const actions = completed
    ? ''
    : '<a class="button secondary" href="#/welcome" data-testid="link-rejected-welcome">Back to programme desk</a>';

  stage.innerHTML =
    '<div class="surface surface-pad status-card fade-in" data-testid="' + (completed ? 'status-completed' : 'status-rejected') + '">' +
    '<div class="status-icon ' + (completed ? 'success' : 'rejected') + '">' + (completed ? icon('checkCircle', 45, 2) : icon('x', 42, 2)) + '</div>' +
    '<div class="eyebrow">' + (completed ? 'All three letters are in' : 'A note from the desk') + '</div>' +
    '<h1>' + (completed ? 'Completed' : 'Not accepted') + '</h1>' +
    '<p>' + body + '</p>' +
    (meta ? '<div class="status-meta">' + esc(meta) + '</div>' : '') +
    (actions ? '<div class="status-actions">' + actions + '</div>' : '') +
    '</div>';
}

function showFinalConfirm(onSubmit) {
  const overlay = document.createElement('div');
  overlay.className = 'final-confirm-overlay';
  overlay.innerHTML =
    '<div class="final-confirm-card" role="dialog" aria-modal="true">' +
    '<div class="final-confirm-tag">Warning</div>' +
    '<h2>Once you submit, you will not be able to edit your response</h2>' +
    '<div class="final-confirm-actions">' +
    '<button class="button primary white" type="button" data-testid="button-confirm-cancel" id="final-confirm-cancel">Go back</button>' +
    '<button class="button primary" type="button" data-testid="button-confirm-submit" id="final-confirm-submit">Submit ' + icon('arrowRight', 16, 2) + '</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function () { overlay.classList.add('show'); });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) dismiss();
  });
  document.getElementById('final-confirm-cancel').addEventListener('click', dismiss);
  document.getElementById('final-confirm-submit').addEventListener('click', function () {
    dismiss();
    onSubmit();
  });
  document.addEventListener('keydown', keyHandler);
  function dismiss() {
    document.removeEventListener('keydown', keyHandler);
    overlay.classList.remove('show');
    setTimeout(function () { overlay.remove(); }, 260);
  }
  function keyHandler(e) {
    if (e.key === 'Escape') dismiss();
  }
}

function viewNotFound() {
  stage.innerHTML =
    '<div class="surface surface-pad status-card fade-in">' +
    '<div class="status-icon" style="background:var(--yellow);box-shadow:0 0 0 10px rgba(245,166,35,.15);color:var(--navy);">' + icon('book', 34, 1.6) + '</div>' +
    '<h1>Page not found</h1>' +
    '<p>This page wandered off the notebook. Let\'s get you back to the judging desk.</p>' +
    '<div class="status-actions"><a class="button primary" href="#/" data-testid="button-return-home">Return home ' + icon('arrowRight', 16, 2) + '</a></div>' +
    '</div>';
}

let homeTimer = null;

function route() {
  const raw = window.location.hash;
  const path = raw.replace(/^#\/?/, '');
  const parts = path.split('/');
  const view = parts[0];
  const param = parts.length > 1 ? parts.slice(1).join('/') : '';

  if (path === '') {
    if (homeTimer) return;
    document.title = 'AL-AZHAR OTB · Judging desk';
    viewLoading();
    updateTopbar();
    homeTimer = setTimeout(function () {
      homeTimer = null;
      nav(email ? '/welcome' : '/login', true);
    }, 350);
    return;
  }

  if (homeTimer) { clearTimeout(homeTimer); homeTimer = null; }

  switch (view) {
    case 'login':
      document.title = 'Sign in · AL-AZHAR OTB';
      viewLogin();
      break;
    case 'welcome':
      document.title = 'Choose a programme · AL-AZHAR OTB';
      viewWelcome();
      break;
    case 'programme': {
      const prog = programmeByName(param);
      document.title = (prog ? prog.name : 'No programme') + ' · AL-AZHAR OTB';
      viewProgramme(prog);
      break;
    }
    case 'final': {
      const prog = programmeByName(param);
      document.title = 'Final Assessment · AL-AZHAR OTB';
      if (!prog) { viewStatus(false); break; }
      if (isFinished(prog)) { nav('/completed/' + encodeURIComponent(prog.name), true); break; }
      viewFinalAssessment(prog);
      break;
    }
    case 'completed':
      document.title = 'Judgement completed · AL-AZHAR OTB';
      viewStatus(false, param ? decodeURIComponent(param) : null);
      break;
    case 'rejected':
      document.title = 'Judgement rejected · AL-AZHAR OTB';
      viewStatus(true, param ? decodeURIComponent(param) : null);
      break;
    default:
      document.title = 'AL-AZHAR OTB · Judging desk';
      viewNotFound();
  }
  updateTopbar();
}

signOutBtn.addEventListener('click', function () {
  localStorage.removeItem('judgeEmail');
  email = null;
  updateTopbar();
  nav('/login');
});

window.addEventListener('hashchange', route);
updateTopbar();
Promise.all([Sync.loadProgrammes(), Sync.loadPresent(), Sync.loadAllMarks()])
  .then(function (r) {
    programmes = r[0];
    present = r[1];
    marks = r[2];
    route();
  })
  .catch(function () { route(); });
