// ===== Interactive Editor =====
const staticHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
    h2 { color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #4285f4; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #e8f0fe; }
    .price { color: #d93025; font-weight: bold; }
  </style>
</head>
<body>
  <h2>🛒 商品列表</h2>
  <table>
    <tr><th>品名</th><th>價格</th><th>庫存</th></tr>
    <tr><td>Python 入門書</td><td class="price">$450</td><td>12</td></tr>
    <tr><td>機器學習實戰</td><td class="price">$680</td><td>5</td></tr>
    <tr><td>資料結構與演算法</td><td class="price">$520</td><td>8</td></tr>
    <tr><td>網頁爬蟲攻略</td><td class="price">$390</td><td>20</td></tr>
  </table>
  <!-- 💡 試試用 F12 → Elements 找到 class="price" -->
</body>
</html>`;

const dynamicHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
    h2 { color: #333; border-bottom: 2px solid #34a853; padding-bottom: 8px; }
    #product-list { margin-top: 16px; }
    .product-card {
      background: white; padding: 16px; margin: 8px 0;
      border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.12);
      display: none;
    }
    .product-card.show { display: block; animation: fadeIn .3s ease; }
    .product-card .name { font-weight: bold; color: #333; }
    .product-card .price { color: #d93025; font-size: 18px; }
    button {
      background: #34a853; color: white; border: none;
      padding: 10px 24px; border-radius: 20px; cursor: pointer;
      font-size: 14px; margin-top: 12px;
    }
    button:hover { background: #1e8e3e; }
    .loading { color: #999; font-style: italic; display: none; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  </style>
</head>
<body>
  <h2>🔄 動態商品載入</h2>
  <p>這些資料是透過 JavaScript <b>動態</b>產生的</p>
  <button onclick="loadProducts()">📦 載入商品</button>
  <p class="loading" id="loading">載入中...</p>
  <div id="product-list"></div>

  <script>
    function loadProducts() {
      const loading = document.getElementById('loading');
      const list = document.getElementById('product-list');
      loading.style.display = 'block';
      list.innerHTML = '';

      // 模擬 API 請求延遲
      setTimeout(() => {
        const products = [
          { name: 'MacBook Pro', price: 59900 },
          { name: 'iPad Air', price: 19900 },
          { name: 'AirPods Pro', price: 7490 },
        ];
        loading.style.display = 'none';
        products.forEach((p, i) => {
          setTimeout(() => {
            list.innerHTML += \`
              <div class="product-card show">
                <div class="name">\${p.name}</div>
                <div class="price">$\${p.price.toLocaleString()}</div>
              </div>\`;
          }, i * 200);
        });
      }, 1000);
    }
  </script>
  <!-- 💡 先用 F12 → Elements 查看：按按鈕「之前」有什麼？ -->
  <!-- 💡 再按按鈕後看 DOM 有什麼變化？ -->
</body>
</html>`;

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  initNavbar();
  initCopyButtons();
  initCollapsibles();
  initScrollAnimations();
  initProgressBar();
  // Enable animations only after JS is ready
  requestAnimationFrame(() => {
    document.body.classList.add('js-loaded');
  });
});

// ===== Editor =====
function initEditor() {
  const textarea = document.getElementById('editor-textarea');
  const iframe = document.getElementById('editor-preview-frame');
  const btnStatic = document.getElementById('btn-static');
  const btnDynamic = document.getElementById('btn-dynamic');
  const btnRun = document.getElementById('btn-run');

  if (!textarea || !iframe) return;

  const editor = CodeMirror.fromTextArea(textarea, {
    mode: "htmlmixed",
    lineNumbers: true,
    theme: "default",
    tabSize: 2
  });

  let currentMode = 'static';

  function loadExample(mode) {
    currentMode = mode;
    editor.setValue(mode === 'static' ? staticHTML : dynamicHTML);
    btnStatic.classList.toggle('active', mode === 'static');
    btnDynamic.classList.toggle('active', mode === 'dynamic');
    runCode();
  }

  function runCode() {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(editor.getValue());
    doc.close();
  }

  btnStatic.addEventListener('click', () => loadExample('static'));
  btnDynamic.addEventListener('click', () => loadExample('dynamic'));
  btnRun.addEventListener('click', runCode);

  // Live update on typing (debounced)
  let timeout;
  editor.on('change', () => {
    clearTimeout(timeout);
    timeout = setTimeout(runCode, 500);
  });

  loadExample('static');
}

// ===== Navbar =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active section tracking
  const sections = document.querySelectorAll('.section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(section => observer.observe(section));
}

// ===== Copy Buttons =====
function initCopyButtons() {
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock.querySelector('pre code') || codeBlock.querySelector('pre');
      const text = code.innerText;

      navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '✓ 已複製';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

// ===== Collapsibles =====
function initCollapsibles() {
  document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const collapsible = trigger.closest('.collapsible');
      collapsible.classList.toggle('open');
    });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ===== Progress Bar =====
function initProgressBar() {
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
  });
}
