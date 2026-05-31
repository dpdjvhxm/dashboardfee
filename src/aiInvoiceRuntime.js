const TEXT_MAP = new Map([
  ['AI 인보이스 추출', 'AI Invoice Extraction'],
  ['AI 인보이스 추출/검수', 'AI Invoice Extraction & Review'],
  ['인보이스 업로드/텍스트 입력', 'Invoice Upload / Text Input'],
  ['현재 화면은 프론트 데모입니다. 실제 운영에서는 이 지점에서 백엔드가 OCR/AI API를 호출하고, 결과만 프론트로 전달합니다.', 'This is a front-end demo screen. In production, the backend should call the OCR/AI API and return structured JSON results to this review screen.'],
  ['AI 분석 실행', 'Run AI Analysis'],
  ['추출 결과 검수', 'Extraction Result Review'],
  ['왼쪽에서 인보이스를 업로드하거나 샘플 텍스트로 AI 분석을 실행하세요.', 'Upload an invoice or run AI analysis with the sample text.'],
  ['중복 저장 방지 적용', 'Duplicate prevention enabled'],
  ['신뢰도 낮은 항목은 담당자가 수정한 뒤 확정 저장하세요. 저장 시 Payment 데이터에 바로 반영됩니다.', 'Review low-confidence fields before saving. Confirmed records are saved directly into Payment Tracker.'],
  ['신뢰도 낮은 항목은 담당자가 수정한 뒤 확정 저장하세요. 저장 시 Payment Data에 바로 반영됩니다.', 'Review low-confidence fields before saving. Confirmed records are saved directly into Payment Tracker.'],
  ['검수 완료 후 Payment 저장', 'Save to Payment Tracker'],
]);

let scheduled = false;
let observerStarted = false;

function replaceOwnText(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const raw = node.nodeValue || '';
  const trimmed = raw.trim();
  if (!trimmed) return;

  if (TEXT_MAP.has(trimmed)) {
    node.nodeValue = raw.replace(trimmed, TEXT_MAP.get(trimmed));
    return;
  }

  let next = raw;
  next = next.replace(/AI 인보이스 추출\/검수/g, 'AI Invoice Extraction & Review');
  next = next.replace(/AI 인보이스 추출/g, 'AI Invoice Extraction');
  next = next.replace(/인보이스 업로드\/텍스트 입력/g, 'Invoice Upload / Text Input');
  next = next.replace(/AI 분석 실행/g, 'Run AI Analysis');
  next = next.replace(/추출 결과 검수/g, 'Extraction Result Review');
  next = next.replace(/검수 필요\s*(\d+)건/g, 'Review Required: $1');
  next = next.replace(/검수 필요/g, 'Review Required');
  next = next.replace(/예상 KRW/g, 'Estimated KRW');
  next = next.replace(/중복 저장 방지 적용/g, 'Duplicate prevention enabled');
  next = next.replace(/신뢰도\s*(\d+)%/g, 'Confidence $1%');
  next = next.replace(/신뢰도/g, 'Confidence');
  next = next.replace(/신뢰도 낮은 항목은 담당자가 수정한 뒤 확정 저장하세요\. 저장 시 Payment (?:데이터|Data)에 바로 반영됩니다\./g, 'Review low-confidence fields before saving. Confirmed records are saved directly into Payment Tracker.');
  next = next.replace(/검수 완료 후 Payment 저장/g, 'Save to Payment Tracker');
  next = next.replace(/왼쪽에서 인보이스를 업로드하거나 샘플 텍스트로 AI 분석을 실행하세요\./g, 'Upload an invoice or run AI analysis with the sample text.');
  next = next.replace(/현재 화면은 프론트 데모입니다\. 실제 운영에서는 이 지점에서 백엔드가 OCR\/AI API를 호출하고, 결과만 프론트로 전달합니다\./g, 'This is a front-end demo screen. In production, the backend should call the OCR/AI API and return structured JSON results to this review screen.');

  if (next !== raw) node.nodeValue = next;
}

function translateTree(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) replaceOwnText(node);

  document.querySelectorAll('textarea[placeholder="인보이스 원문 또는 OCR 결과를 붙여넣으세요."]').forEach(el => {
    el.placeholder = 'Paste invoice text or OCR output here.';
  });
}

function scheduleTranslate() {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    translateTree();
  }, 80);
}

function injectAiInvoiceStyles() {
  if (document.getElementById('ai-invoice-runtime-styles')) return;
  const style = document.createElement('style');
  style.id = 'ai-invoice-runtime-styles';
  style.textContent = `
    .aiGrid{display:grid !important;grid-template-columns:minmax(320px,420px) minmax(0,1fr) !important;gap:18px !important;align-items:start !important}
    .aiInput,.aiReview{min-height:calc(100vh - 160px)}
    .aiInput h3,.aiReview h3{display:flex;align-items:center;gap:8px;margin-bottom:12px}
    .aiInput p{color:#64748b;line-height:1.65;margin:0 0 16px}
    .aiInput input[type="file"]{width:100%;display:block;margin:0 0 14px;padding:14px;border:1px dashed #93c5fd;border-radius:14px;background:#f8fbff;color:#334155;font-weight:800}
    .aiInput textarea{width:100%;min-height:360px;resize:vertical;border:1px solid #d1d5db;border-radius:14px;padding:14px;background:#fff;color:#111827;line-height:1.55;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;margin-bottom:14px}
    .aiReview .emptyState{display:grid;place-items:center;min-height:260px;border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;color:#64748b;font-weight:900;text-align:center;padding:24px}
    .aiSummary{display:grid !important;grid-template-columns:1fr !important;gap:10px !important;margin-bottom:16px !important}
    .aiSummary span{display:flex;justify-content:space-between;align-items:center;width:100%;padding:12px 14px;border-radius:12px;background:linear-gradient(90deg,#eaf7ff,#f7fff1);border:1px solid #e5e7eb;color:#0f172a;font-weight:900}
    .aiForm{display:grid !important;grid-template-columns:1fr !important;gap:12px !important}
    .aiForm label{display:grid !important;grid-template-columns:190px minmax(110px,130px) minmax(0,1fr) !important;align-items:center !important;gap:12px !important;padding:12px !important;border:1px solid #e5e7eb !important;border-radius:14px !important;background:#fff !important;font-size:13px !important;color:#111827 !important}
    .aiForm label small{margin:0 !important;padding:6px 9px !important;border-radius:999px !important;background:#eff6ff !important;color:#0b72c9 !important;font-size:12px !important;font-weight:900 !important;text-align:center !important;white-space:nowrap !important}
    .aiForm label input{margin:0 !important;min-height:40px !important;width:100% !important}
    .aiReview>.primary{width:100%;margin-top:14px;min-height:48px}
    @media(max-width:1100px){.aiGrid{grid-template-columns:1fr !important}.aiInput,.aiReview{min-height:auto}.aiForm label{grid-template-columns:1fr !important;align-items:start !important}.aiForm label small{text-align:left;width:max-content}}
  `;
  document.head.appendChild(style);
}

function startSafeObserver() {
  if (observerStarted) return;
  observerStarted = true;
  const observer = new MutationObserver(mutations => {
    const shouldRun = mutations.some(m => m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length));
    if (shouldRun) scheduleTranslate();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function initAiInvoiceRuntime() {
  injectAiInvoiceStyles();
  scheduleTranslate();
  startSafeObserver();
  document.addEventListener('click', scheduleTranslate, true);
  document.addEventListener('change', scheduleTranslate, true);
  document.addEventListener('input', scheduleTranslate, true);
}
