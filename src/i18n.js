const STORAGE_KEY = 'global-mobility-language-v1';

const koToEn = {
  '통합 비용 대시보드': 'Integrated Cost Dashboard',
  '통합 대시보드': 'Integrated Dashboard',
  '학비/교육비 대시보드': 'Tuition / Education Dashboard',
  '항공권 대시보드': 'Flight Dashboard',
  '항공권 데이터 관리': 'Flight Data Management',
  '항공권 개별 등록': 'Register Flight Individually',
  '항공권 데이터': 'Flight Data',
  '항공권 등록': 'Register Flight',
  '항공권 업로드': 'Upload Flight',
  'Payment 대시보드': 'Payment Dashboard',
  'Payment 데이터': 'Payment Data',
  'Payment 등록': 'Register Payment',
  'Payment 업로드': 'Upload Payment',
  '계정관리': 'Account Management',
  '공지사항': 'Notices',
  '로그아웃': 'Logout',
  '로그인': 'Login',
  '계정 등록': 'Create Account',
  '계정 목록': 'Account List',
  '공지 등록': 'Create Notice',
  '공지 목록': 'Notice List',
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
  '항공구간': 'Route',
  '학비 및 항공권 비용 입력 시 국가, 통화, Normalized KRW 항목을 반드시 확인해주세요.': 'When entering tuition and flight costs, please check Country, Currency, and Normalized KRW fields.',
  '항공권 업로드 중복 기준 안내': 'Flight Upload Duplicate Rule Guide',
  '2026년 2분기 비용 데이터 검토 안내': '2026 Q2 Cost Data Review Notice',
  'Booking Date + EE ID + Passenger Name + Departure + Airfare 기준으로 중복 등록을 방지합니다.': 'Duplicate registration is prevented by Booking Date + EE ID + Passenger Name + Departure + Airfare.',
  '건': 'items'
};

const enToKo = Object.fromEntries(Object.entries(koToEn).map(([ko, en]) => [en, ko]));
const LANGS = ['en', 'ko'];

function getLang(){
  const lang = localStorage.getItem(STORAGE_KEY);
  return LANGS.includes(lang) ? lang : 'en';
}
function setLang(lang){
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}
function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function replaceAllPhrases(value, lang){
  if(!value || !value.trim()) return value;
  const dict = lang === 'en' ? koToEn : enToKo;
  let next = value;
  Object.entries(dict)
    .sort((a,b)=>b[0].length-a[0].length)
    .forEach(([from,to]) => {
      if(next.includes(from)) next = next.replace(new RegExp(escapeRegExp(from), 'g'), to);
    });
  return next;
}

function shouldSkip(el){
  if(!el) return false;
  return ['SCRIPT','STYLE','TEXTAREA'].includes(el.tagName);
}
function translateNodeText(node, lang){
  if(!node || !node.nodeValue || shouldSkip(node.parentElement)) return;
  const next = replaceAllPhrases(node.nodeValue, lang);
  if(next !== node.nodeValue) node.nodeValue = next;
}
function translateElementAttributes(el, lang){
  if(!el || !el.getAttribute) return;
  ['placeholder','title','aria-label','value'].forEach(attr => {
    const v = el.getAttribute(attr);
    if(v) {
      const next = replaceAllPhrases(v, lang);
      if(next !== v) el.setAttribute(attr, next);
    }
  });
}
function translateRoot(root=document.body, lang=getLang()){
  if(!root) return;
  if(root.nodeType === Node.TEXT_NODE) return translateNodeText(root, lang);
  if(root.nodeType !== Node.ELEMENT_NODE && root !== document.body) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node){ return shouldSkip(node.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
  });
  const nodes = [];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => translateNodeText(node, lang));
  root.querySelectorAll?.('[placeholder], [title], [aria-label], option').forEach(el => {
    translateElementAttributes(el, lang);
    el.childNodes?.forEach(node => { if(node.nodeType === Node.TEXT_NODE) translateNodeText(node, lang); });
  });
}
function buildSwitcher(){
  if(document.getElementById('language-switcher')) return;
  const wrap = document.createElement('div');
  wrap.id = 'language-switcher';
  wrap.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="ko">KO</button>`;
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
  document.querySelectorAll('#language-switcher button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
}
export function initI18n(){
  setLang(getLang());
  buildSwitcher();
  const apply = () => { translateRoot(document.body, getLang()); updateSwitcher(); };
  requestAnimationFrame(apply);
  setTimeout(apply, 100);
  setTimeout(apply, 500);
  const observer = new MutationObserver(() => requestAnimationFrame(apply));
  observer.observe(document.body, { childList:true, subtree:true, characterData:true });
}
