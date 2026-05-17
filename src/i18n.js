const STORAGE_KEY = 'global-mobility-language-v1';

const koToEn = {
  '통합 대시보드': 'Integrated Dashboard',
  'Tuition / Payment': 'Tuition / Payment',
  'Payment 대시보드': 'Payment Dashboard',
  'Payment 데이터': 'Payment Data',
  'Payment 등록': 'Register Payment',
  'Payment 업로드': 'Upload Payment',
  'Flight Booking': 'Flight Booking',
  '항공권 대시보드': 'Flight Dashboard',
  '항공권 데이터': 'Flight Data',
  '항공권 등록': 'Register Flight',
  '항공권 업로드': 'Upload Flight',
  'Admin': 'Admin',
  '계정관리': 'Account Management',
  '공지사항': 'Notices',
  '로그아웃': 'Logout',
  '학비/교육비 대시보드': 'Tuition / Education Dashboard',
  '항공권 데이터 관리': 'Flight Data Management',
  '항공권 개별 등록': 'Register Flight Individually',
  '공지 등록': 'Create Notice',
  '공지 목록': 'Notice List',
  '계정 등록': 'Create Account',
  '계정 목록': 'Account List',
  '로그인': 'Login',
  '학비·항공권 비용 관리를 위한 내부 대시보드': 'Internal dashboard for tuition and flight cost management',
  '계정 정보가 맞지 않거나 비활성 계정입니다.': 'The account information is incorrect or the account is inactive.',
  '기간': 'Period',
  '월': 'Month',
  '국가': 'Country',
  '구분': 'Type',
  '카테고리': 'Category',
  '2026 전체': 'Full Year 2026',
  '1분기': 'Q1',
  '2분기': 'Q2',
  '3분기': 'Q3',
  '4분기': 'Q4',
  '월별 사용 비용': 'Monthly Usage Cost',
  '국가별 학비/항공권 비용 비교': 'Tuition and Flight Cost by Country',
  '국가별 비용 상세': 'Country Cost Details',
  '월별 비용 상세': 'Monthly Cost Details',
  '정규화 KRW 기준': 'Normalized KRW Basis',
  '월별 학비/교육비': 'Monthly Tuition / Education Cost',
  '월별 항공권 비용': 'Monthly Flight Cost',
  '항공권 금액': 'Airfare Amount',
  '발권 수수료': 'Ticketing Fee',
  '등록하기': 'Submit',
  '엑셀 파일 업로드': 'Upload Excel File',
  '전체': 'Total',
  '신규': 'New',
  '중복 제외': 'Duplicates Excluded',
  '삭제': 'Delete',
  '상태변경': 'Change Status',
  '상단 고정': 'Pinned',
  '제목': 'Title',
  '분류': 'Category',
  '내용': 'Content',
  '공지': 'Notice',
  '업무공지': 'Work Notice',
  '데이터': 'Data',
  '이름': 'Name',
  '이메일': 'Email',
  '비밀번호': 'Password',
  '부서': 'Department',
  '역할': 'Role',
  '상태': 'Status',
  '샘플 데이터로 초기화할까요?': 'Reset to sample data?',
  '중복 Payment 데이터입니다.': 'Duplicate payment data.',
  '중복 항공권 데이터입니다.': 'Duplicate flight data.',
  '이미 등록된 이메일입니다.': 'This email is already registered.',
  '원본 컬럼은 유지하고 Normalized KRW / FX Rate 컬럼을 추가해 비교 기준을 통일했습니다.': 'Original columns are preserved, and Normalized KRW / FX Rate columns are added for consistent comparison.',
  'Payment Tracker 엑셀 업로드: 원본 금액/통화는 보존하고, Normalized KRW를 별도 계산합니다.': 'Payment Tracker Excel upload: original amount/currency are preserved and Normalized KRW is calculated separately.',
  '항공권 엑셀 업로드: Airfare + TRX Fee를 KRW 기준으로 정규화하고 중복을 제외합니다.': 'Flight Excel upload: Airfare + TRX Fee are normalized to KRW and duplicates are excluded.',
  '국가, 직원명, Invoice No, PO 검색': 'Search country, employee name, invoice no, PO',
  '국가, 직원명, 탑승객, 항공구간, Cost Center 검색': 'Search country, employee, passenger, route, cost center',
  '직원명': 'Employee Name',
  '탑승객': 'Passenger',
  '항공구간': 'Route'
};

const enToKo = Object.fromEntries(Object.entries(koToEn).map(([ko, en]) => [en, ko]));
const placeholderKoToEn = {
  '국가, 직원명, Invoice No, PO 검색': 'Search country, employee name, invoice no, PO',
  '국가, 직원명, 탑승객, 항공구간, Cost Center 검색': 'Search country, employee, passenger, route, cost center'
};
const placeholderEnToKo = Object.fromEntries(Object.entries(placeholderKoToEn).map(([ko, en]) => [en, ko]));

function getLang(){ return localStorage.getItem(STORAGE_KEY) || 'en'; }
function setLang(lang){ localStorage.setItem(STORAGE_KEY, lang); document.documentElement.lang = lang; }

function translateTextValue(value, lang){
  const trimmed = value.trim();
  if(!trimmed) return value;
  const dict = lang === 'en' ? koToEn : enToKo;
  const replacement = dict[trimmed];
  if(!replacement) return value;
  return value.replace(trimmed, replacement);
}

function translateNodeText(node, lang){
  if(!node || !node.nodeValue) return;
  const next = translateTextValue(node.nodeValue, lang);
  if(next !== node.nodeValue) node.nodeValue = next;
}

function shouldSkip(el){
  if(!el) return false;
  const tag = el.tagName;
  return ['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(tag);
}

function translateElementAttributes(el, lang){
  if(!el || !el.getAttribute) return;
  const p = el.getAttribute('placeholder');
  if(p){
    const dict = lang === 'en' ? placeholderKoToEn : placeholderEnToKo;
    if(dict[p]) el.setAttribute('placeholder', dict[p]);
  }
  const title = el.getAttribute('title');
  if(title) el.setAttribute('title', translateTextValue(title, lang));
}

function translateRoot(root=document.body, lang=getLang()){
  if(!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node){
      if(shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => translateNodeText(node, lang));
  root.querySelectorAll?.('[placeholder], [title]').forEach(el => translateElementAttributes(el, lang));
}

function buildSwitcher(){
  if(document.getElementById('language-switcher')) return;
  const wrap = document.createElement('div');
  wrap.id = 'language-switcher';
  wrap.innerHTML = `<button data-lang="en">EN</button><button data-lang="ko">KO</button>`;
  wrap.addEventListener('click', e => {
    const btn = e.target.closest('button[data-lang]');
    if(!btn) return;
    setLang(btn.dataset.lang);
    translateRoot(document.body, btn.dataset.lang);
    updateSwitcher();
  });
  document.body.appendChild(wrap);
  updateSwitcher();
}

function updateSwitcher(){
  const lang = getLang();
  document.querySelectorAll('#language-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

export function initI18n(){
  setLang(getLang());
  buildSwitcher();
  requestAnimationFrame(() => translateRoot(document.body, getLang()));
  const observer = new MutationObserver(mutations => {
    const lang = getLang();
    for(const m of mutations){
      m.addedNodes.forEach(node => {
        if(node.nodeType === Node.TEXT_NODE) translateNodeText(node, lang);
        if(node.nodeType === Node.ELEMENT_NODE) translateRoot(node, lang);
      });
    }
    updateSwitcher();
  });
  observer.observe(document.body, { childList:true, subtree:true });
}
