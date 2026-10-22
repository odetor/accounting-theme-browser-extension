import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    const CSS = `
html.accounting-ledger,
body.accounting-ledger {
  background-color: #0f172a !important;
}
`;

    const STYLE_ID = 'accounting-ledger-style';

    let enabled = false;
    let styleEl: HTMLStyleElement | null = null;

    function storageKey() {
      return 'ledgerEnabled';
    }

    function apply(enabledState: boolean) {
      enabled = enabledState;
      if (enabled) {
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = STYLE_ID;
          styleEl.textContent = CSS;
          (document.head || document.documentElement).appendChild(styleEl);
        }
        document.documentElement.classList.add('accounting-ledger');
        document.body.classList.add('accounting-ledger');
        if (!document.getElementById('ledger-bg-svg')) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.id = 'ledger-bg-svg';
          svg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;opacity:0.15;animation:float 6s ease-in-out infinite;';
          svg.setAttribute('viewBox', '0 0 400 400');
          svg.innerHTML = `<defs><style>
            @keyframes float { 0% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(1deg); } 100% { transform: translateY(0) rotate(0); } }
          </style></defs>
          <g fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round">
            <rect x="50" y="80" width="60" height="80" rx="4" fill="#0f172a" stroke="#10b981"/>
            <line x1="60" y1="100" x2="100" y2="100"/>
            <line x1="60" y1="115" x2="100" y2="115"/>
            <rect x="180" y="60" width="50" height="70" fill="#1e293b" transform="rotate(5 205 95)"/>
            <rect x="190" y="70" width="50" height="70" fill="#1e293b" transform="rotate(-3 215 105)"/>
            <rect x="300" y="180" width="12" height="80" rx="6" fill="#34d399" transform="rotate(-30 306 220)"/>
            <polygon points="300,260 310,220 320,260" fill="#10b981"/>
          </g>`;
          document.body.appendChild(svg);
        }
      } else {
        styleEl?.remove();
        styleEl = null;
        document.documentElement.classList.remove('accounting-ledger');
        document.body.classList.remove('accounting-ledger');
        document.getElementById('ledger-bg-svg')?.remove();
      }
    }

    async function loadState() {
      const result = await chrome.storage.sync.get([storageKey()]);
      apply(!!result[storageKey()]);
    }

    function watchStorage() {
      chrome.storage.onChanged.addListener((changes) => {
        if (storageKey() in changes) {
          apply(!!changes[storageKey()].newValue);
        }
      });
    }

    function listenMessages() {
      chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (message && message.type === 'LEDGER_TOGGLE') {
          apply(!enabled);
          return false;
        }
        if (message && message.type === 'LEDGER_SET') {
          apply(!!message.enabled);
          return false;
        }
        if (message && message.type === 'LEDGER_GET') {
          sendResponse({ enabled });
          return true;
        }
        return false;
      });
    }

    loadState();
    watchStorage();
    listenMessages();
  },
});
