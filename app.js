// ── State ──────────────────────────────────────────────────────────

const state = {
  books: [
    { title: 'Dune',        url: 'https://en.wikipedia.org/wiki/Dune_(novel)',                width: 5,  innerPad: 2, outerPad: 4, style: 'auto', border: 'auto' },
    { title: 'Neuromancer', url: 'https://en.wikipedia.org/wiki/Neuromancer',                 width: 7,  innerPad: 0, outerPad: 0, style: 'auto', border: 'auto' },
    { title: '1984',        url: 'https://en.wikipedia.org/wiki/Nineteen_Eighty-Four',        width: 5,  innerPad: 2, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Foundation',  url: 'https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)',    width: 9,  innerPad: 0, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Solaris',     url: 'https://en.wikipedia.org/wiki/Solaris_(novel)',              width: 7,  innerPad: 2, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Akira',       url: 'https://en.wikipedia.org/wiki/Akira_(manga)',               width: 11, innerPad: 2, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Hyperion',    url: 'https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)',     width: 7,  innerPad: 0, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Kafka',       url: 'https://en.wikipedia.org/wiki/The_Trial',                   width: 5,  innerPad: 0, outerPad: 0, style: 'auto', border: 'auto' },
    { title: 'Beloved',     url: 'https://en.wikipedia.org/wiki/Beloved_(novel)',              width: 7,  innerPad: 2, outerPad: 0, style: 'auto', border: 'auto' },
    { title: 'Godel',       url: 'https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach',    width: 11, innerPad: 0, outerPad: 0, style: 'auto', border: 'auto' },
    { title: 'Catch22',     url: 'https://en.wikipedia.org/wiki/Catch-22',                     width: 9,  innerPad: 0, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Sapiens',     url: 'https://en.wikipedia.org/wiki/Sapiens:_A_Brief_History',     width: 7,  innerPad: 2, outerPad: 2, style: 'auto', border: 'auto' },
    { title: 'Wind',        url: 'https://en.wikipedia.org/wiki/The_Wind-Up_Bird_Chronicle',   width: 5,  innerPad: 0, outerPad: 2, style: 'auto', border: 'auto' },
  ],
  options: {
    booksPerShelf: 8,
    shelfWalls: false,
  },
};

// ── Constants ──────────────────────────────────────────────────────

const INDENT = '  ';

const BORDER_CHARS = {
  single:  { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double:  { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
};

const BORDER_ORDER = ['single', 'double', 'rounded'];

// Fill styles — each defines how fill rows and letter rows look
const BOOK_STYLES = {
  light:    { name: 'Light',    preview: '░',  type: 'solid',       char: '░',           letterStyle: 'fill' },
  medium:   { name: 'Medium',   preview: '▒',  type: 'solid',       char: '▒',           letterStyle: 'fill' },
  dark:     { name: 'Dark',     preview: '▓',  type: 'solid',       char: '▓',           letterStyle: 'fill' },
  solid:    { name: 'Solid',    preview: '██', type: 'solid',       char: '█',           letterStyle: 'fill' },
  empty:    { name: 'Empty',    preview: '  ', type: 'empty',                             letterStyle: 'empty' },
  striped:  { name: 'Striped',  preview: '░▒', type: 'alternating', chars: ['░', '▒'],   letterStyle: 'fill' },
  ornate:   { name: 'Ornate',   preview: '░▓', type: 'gradient',    chars: ['░', '▒', '▓'], letterStyle: 'fill' },
  dotted:   { name: 'Dotted',   preview: '··', type: 'solid',       char: '·',           letterStyle: 'fill' },
  wave:     { name: 'Wave',     preview: '~≈', type: 'alternating', chars: ['~', '≈'],   letterStyle: 'fill' },
  mosaic:   { name: 'Mosaic',   preview: '▓□', type: 'checker',     chars: ['▓', ' '],   letterStyle: 'empty' },
  deco:     { name: 'Deco',     preview: '═─', type: 'alternating', chars: ['═', '─'],   letterStyle: 'fill' },
};

// Auto-cycle order for fill styles
const STYLE_ORDER = ['light', 'striped', 'ornate', 'solid', 'dotted', 'wave', 'mosaic', 'deco', 'medium', 'dark'];

const WIDTH_OPTIONS = [
  { value: 5,  label: 'Pocket' },
  { value: 7,  label: 'Standard' },
  { value: 9,  label: 'Wide' },
  { value: 11, label: 'Thick' },
];

// ── Helpers ────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function getStyleForBook(book, globalIndex) {
  if (book.style !== 'auto') {
    return BOOK_STYLES[book.style] || BOOK_STYLES.light;
  }
  return BOOK_STYLES[STYLE_ORDER[globalIndex % STYLE_ORDER.length]];
}

function getBorderForBook(book, globalIndex) {
  if (book.border !== 'auto') {
    return BORDER_CHARS[book.border] || BORDER_CHARS.single;
  }
  return BORDER_CHARS[BORDER_ORDER[globalIndex % BORDER_ORDER.length]];
}

function getBookHeight(book) {
  // outerPad: extra fill rows above/below title zone
  // innerPad: space rows inside title zone (before first letter, after last letter)
  const outer = book.outerPad || 0;
  const inner = book.innerPad || 0;
  const topFills = 1 + Math.ceil(outer / 2);
  const bottomFills = 1 + Math.floor(outer / 2);
  const topInner = Math.ceil(inner / 2);
  const bottomInner = Math.floor(inner / 2);
  return 2 + topFills + topInner + book.title.length + bottomInner + bottomFills;
}

// ── Style Rendering ────────────────────────────────────────────────

function renderFillContent(style, innerWidth, rowIndex) {
  switch (style.type) {
    case 'solid':
      return style.char.repeat(innerWidth);

    case 'alternating': {
      const c = style.chars[rowIndex % style.chars.length];
      return c.repeat(innerWidth);
    }

    case 'gradient': {
      const g = style.chars;
      let result = '';
      const mid = (innerWidth - 1) / 2;
      for (let i = 0; i < innerWidth; i++) {
        const dist = mid > 0 ? Math.abs(i - mid) / mid : 0;
        const idx = Math.min(Math.floor(dist * g.length), g.length - 1);
        result += g[g.length - 1 - idx];
      }
      return result;
    }

    case 'checker': {
      let result = '';
      for (let i = 0; i < innerWidth; i++) {
        result += (i + rowIndex) % 2 === 0 ? style.chars[0] : style.chars[1];
      }
      return result;
    }

    case 'empty':
      return ' '.repeat(innerWidth);

    default:
      return ' '.repeat(innerWidth);
  }
}

function renderLetterContent(style, letter, innerWidth, rowIndex) {
  const sideWidth = Math.max(0, (innerWidth - 3) / 2);

  if (style.letterStyle === 'empty') {
    return ' '.repeat(sideWidth) + ' ' + letter + ' ' + ' '.repeat(sideWidth);
  }

  let fillChar;
  switch (style.type) {
    case 'solid':
      fillChar = style.char;
      break;
    case 'alternating':
      fillChar = style.chars[rowIndex % style.chars.length];
      break;
    case 'gradient':
      fillChar = style.chars[Math.floor(style.chars.length / 2)];
      break;
    default:
      fillChar = ' ';
  }

  return fillChar.repeat(sideWidth) + ' ' + letter + ' ' + fillChar.repeat(sideWidth);
}

// ── Generator ──────────────────────────────────────────────────────

function renderBookLine(book, bookLine, style, border) {
  const innerWidth = book.width - 2;
  const outer = book.outerPad || 0;
  const inner = book.innerPad || 0;
  const topFills = 1 + Math.ceil(outer / 2);
  const topInner = Math.ceil(inner / 2);
  const bottomInner = Math.floor(inner / 2);
  const titleLen = book.title.length;
  const bookHeight = getBookHeight(book);

  if (bookLine === 0) {
    return border.tl + border.h.repeat(innerWidth) + border.tr;
  }
  if (bookLine === bookHeight - 1) {
    return border.bl + border.h.repeat(innerWidth) + border.br;
  }

  const contentLine = bookLine - 1;
  const titleStart = topFills + topInner;
  const titleEnd = titleStart + titleLen;
  const innerEnd = titleEnd + bottomInner;

  // Inner pad (space rows before/after title letters, inside border)
  if (contentLine >= topFills && contentLine < titleStart) {
    return border.v + ' '.repeat(innerWidth) + border.v;
  }
  if (contentLine >= titleEnd && contentLine < innerEnd) {
    return border.v + ' '.repeat(innerWidth) + border.v;
  }

  // Title zone
  if (contentLine >= titleStart && contentLine < titleEnd) {
    const letter = book.title[contentLine - titleStart].toUpperCase();
    return border.v + renderLetterContent(style, letter, innerWidth, contentLine) + border.v;
  }

  // Fill zone
  return border.v + renderFillContent(style, innerWidth, contentLine) + border.v;
}

function generateShelfBooks(books, globalIndexStart, targetWidth) {
  if (books.length === 0) return [];

  const walls = state.options.shelfWalls;
  const styles = books.map((b, i) => getStyleForBook(b, globalIndexStart + i));
  const borders = books.map((b, i) => getBorderForBook(b, globalIndexStart + i));
  const maxHeight = Math.max(...books.map(getBookHeight));
  const shelfWidth = getShelfVisualWidth(books);
  const rightPad = targetWidth > shelfWidth ? ' '.repeat(targetWidth - shelfWidth) : '';
  const lines = [];

  for (let lineIdx = 0; lineIdx < maxHeight; lineIdx++) {
    let html = '';

    for (let i = 0; i < books.length; i++) {
      if (i > 0) html += ' ';

      const book = books[i];
      const bookHeight = getBookHeight(book);
      const topPadding = maxHeight - bookHeight;

      if (lineIdx < topPadding) {
        html += ' '.repeat(book.width);
      } else {
        const text = renderBookLine(book, lineIdx - topPadding, styles[i], borders[i]);
        html += `<a href="${escapeAttr(book.url)}">${escapeHtml(text)}</a>`;
      }
    }

    html += rightPad;

    if (walls) {
      html = '│ ' + html + ' │';
    }

    lines.push(html);
  }

  return lines;
}

function getShelfVisualWidth(books) {
  if (books.length === 0) return 0;
  return books.reduce((sum, b) => sum + b.width, 0) + (books.length - 1);
}

function generateShelfBar(width) {
  if (state.options.shelfWalls) {
    return '├' + '═'.repeat(width + 2) + '┤';
  }
  return '═'.repeat(width);
}

function generateSeparator(innerWidth) {
  const dots = '·     ·  ·       ·';
  if (innerWidth <= 0) return '';
  if (innerWidth <= dots.length) return dots.slice(0, innerWidth);
  const leftPad = Math.floor((innerWidth - dots.length) / 2);
  const rightPad = innerWidth - dots.length - leftPad;
  return ' '.repeat(leftPad) + dots + ' '.repeat(rightPad);
}

function assembleBookshelf() {
  const { books, options } = state;
  if (books.length === 0) return '';

  const shelves = [];
  for (let i = 0; i < books.length; i += options.booksPerShelf) {
    shelves.push(books.slice(i, i + options.booksPerShelf));
  }

  const shelfWidths = shelves.map(getShelfVisualWidth);
  const maxShelfWidth = Math.max(...shelfWidths);

  const outputLines = [];
  let globalBookIndex = 0;

  const walls = state.options.shelfWalls;
  const wallInner = maxShelfWidth + 2; // space + books + space

  shelves.forEach((shelfBooks, shelfIdx) => {
    if (shelfBooks.length === 0) return;

    // Top wall for first shelf only
    if (walls && shelfIdx === 0) {
      outputLines.push(INDENT + '┌' + '─'.repeat(wallInner) + '┐');
    }

    const bookLines = generateShelfBooks(shelfBooks, globalBookIndex, maxShelfWidth);
    bookLines.forEach(l => outputLines.push(INDENT + l));
    outputLines.push(INDENT + generateShelfBar(maxShelfWidth));

    if (shelfIdx < shelves.length - 1) {
      // Bridging wall between shelves
      if (walls) {
        outputLines.push(INDENT + '│' + ' '.repeat(wallInner) + '│');
        outputLines.push(INDENT + '│' + ' ' + generateSeparator(maxShelfWidth) + ' │');
        outputLines.push(INDENT + '│' + ' '.repeat(wallInner) + '│');
      } else {
        outputLines.push('');
        outputLines.push(INDENT + generateSeparator(maxShelfWidth));
        outputLines.push('');
      }
    }

    // Bottom wall for last shelf
    if (walls && shelfIdx === shelves.length - 1) {
      outputLines.push(INDENT + '└' + '─'.repeat(wallInner) + '┘');
    }

    globalBookIndex += shelfBooks.length;
  });

  outputLines.push('');
  return outputLines.join('\n');
}

// ── UI ─────────────────────────────────────────────────────────────

let dragSourceIndex = null;

function renderBookList() {
  const container = document.getElementById('bookList');
  container.innerHTML = '';

  state.books.forEach((book, idx) => {
    const item = document.createElement('div');
    item.className = 'book-item';
    item.draggable = true;
    item.dataset.index = idx;

    const widthOpts = WIDTH_OPTIONS.map(w =>
      `<option value="${w.value}" ${book.width === w.value ? 'selected' : ''}>${w.label}</option>`
    ).join('');

    const styleKeys = ['auto', ...Object.keys(BOOK_STYLES)];
    const styleOpts = styleKeys.map(k => {
      if (k === 'auto') return `<option value="auto" ${book.style === 'auto' ? 'selected' : ''}>Auto</option>`;
      const s = BOOK_STYLES[k];
      return `<option value="${k}" ${book.style === k ? 'selected' : ''}>${s.name} ${s.preview}</option>`;
    }).join('');

    const borderKeys = ['auto', ...Object.keys(BORDER_CHARS)];
    const borderOpts = borderKeys.map(k => {
      if (k === 'auto') return `<option value="auto" ${book.border === 'auto' ? 'selected' : ''}>Auto</option>`;
      const labels = { single: 'Single ┌┐', double: 'Double ╔╗', rounded: 'Round ╭╮' };
      return `<option value="${k}" ${book.border === k ? 'selected' : ''}>${labels[k]}</option>`;
    }).join('');

    item.innerHTML = `
      <div class="book-item-header">
        <span class="drag-handle">⠿</span>
        <span class="book-title-display">${escapeHtml(book.title || '?')}</span>
        <button class="btn-delete" data-index="${idx}" title="Remove">&times;</button>
      </div>
      <div class="book-fields">
        <div class="book-field-row">
          <div class="book-field">
            <label>Title</label>
            <input type="text" data-index="${idx}" data-field="title" value="${escapeAttr(book.title)}">
          </div>
        </div>
        <div class="book-field-row">
          <div class="book-field">
            <label>URL</label>
            <input type="text" data-index="${idx}" data-field="url" value="${escapeAttr(book.url)}" placeholder="https://...">
          </div>
        </div>
        <div class="book-field-row">
          <div class="book-field">
            <label>Size</label>
            <select data-index="${idx}" data-field="width">${widthOpts}</select>
          </div>
          <div class="book-field">
            <label>Inner</label>
            <input type="number" data-index="${idx}" data-field="innerPad" value="${book.innerPad || 0}" min="0" max="6">
          </div>
          <div class="book-field">
            <label>Outer</label>
            <input type="number" data-index="${idx}" data-field="outerPad" value="${book.outerPad || 0}" min="0" max="12">
          </div>
        </div>
        <div class="book-field-row">
          <div class="book-field">
            <label>Fill</label>
            <select data-index="${idx}" data-field="style">${styleOpts}</select>
          </div>
          <div class="book-field">
            <label>Border</label>
            <select data-index="${idx}" data-field="border">${borderOpts}</select>
          </div>
        </div>
      </div>
    `;

    // Drag events
    item.addEventListener('dragstart', (e) => {
      dragSourceIndex = idx;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.book-item').forEach(el => el.classList.remove('drag-over'));
      dragSourceIndex = null;
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.book-item').forEach(el => el.classList.remove('drag-over'));
      item.classList.add('drag-over');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      if (dragSourceIndex !== null && dragSourceIndex !== idx) {
        const [moved] = state.books.splice(dragSourceIndex, 1);
        state.books.splice(idx, 0, moved);
        renderBookList();
        renderPreview();
      }
    });

    container.appendChild(item);
  });
}

function handleBookInput(e) {
  const { index, field } = e.target.dataset;
  if (index === undefined || !field) return;

  const idx = parseInt(index);
  let value = e.target.value;

  if (field === 'width' || field === 'innerPad' || field === 'outerPad') value = parseInt(value) || 0;

  state.books[idx][field] = value;

  if (field === 'title') {
    const item = e.target.closest('.book-item');
    item.querySelector('.book-title-display').textContent = value || '?';
  }

  renderPreview();
}

function handleBookClick(e) {
  if (e.target.classList.contains('btn-delete')) {
    const idx = parseInt(e.target.dataset.index);
    state.books.splice(idx, 1);
    renderBookList();
    renderPreview();
  }
}

function addBook() {
  state.books.push({
    title: 'New',
    url: '#',
    width: 7,
    innerPad: 0,
    outerPad: 0,
    style: 'auto',
    border: 'auto',
  });
  renderBookList();
  renderPreview();

  const list = document.getElementById('bookList');
  list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderPreview() {
  const html = assembleBookshelf();
  document.getElementById('output').innerHTML = html;
  document.getElementById('rawOutput').value = html ? '<pre>\n' + html + '\n</pre>' : '';
}

async function copyToClipboard() {
  const html = assembleBookshelf();
  if (!html) return;

  const text = '<pre>\n' + html + '\n</pre>';

  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('copyHtml');
    btn.classList.add('copied');
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = 'Copy HTML';
    }, 1500);
  } catch {
    const textarea = document.getElementById('rawOutput');
    textarea.parentElement.open = true;
    textarea.select();
    document.execCommand('copy');
  }
}

// ── Event Setup ────────────────────────────────────────────────────

function bindControls() {
  const el = (id) => document.getElementById(id);

  el('booksPerShelf').addEventListener('input', (e) => {
    state.options.booksPerShelf = Math.max(1, parseInt(e.target.value) || 8);
    renderPreview();
  });

  el('shelfWalls').addEventListener('change', (e) => {
    state.options.shelfWalls = e.target.checked;
    renderPreview();
  });

  el('addBook').addEventListener('click', addBook);
  el('copyHtml').addEventListener('click', copyToClipboard);
}

// ── Init ───────────────────────────────────────────────────────────

function init() {
  const bookList = document.getElementById('bookList');
  bookList.addEventListener('input', handleBookInput);
  bookList.addEventListener('change', handleBookInput);
  bookList.addEventListener('click', handleBookClick);

  bindControls();
  renderBookList();
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);
