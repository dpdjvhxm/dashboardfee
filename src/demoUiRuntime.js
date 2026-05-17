const COUNTRY_FLAGS = {
  Korea: '🇰🇷',
  Taiwan: '🇹🇼',
  Singapore: '🇸🇬',
  Japan: '🇯🇵',
  USA: '🇺🇸',
  India: '🇮🇳',
  Australia: '🇦🇺',
  'Hong Kong': '🇭🇰'
};

function setReactInputValue(input, value) {
  if (!input || input.value === value) return;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function plainCountryName(text = '') {
  return text.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, '').trim();
}

function withFlag(country) {
  const clean = plainCountryName(country);
  return COUNTRY_FLAGS[clean] ? `${COUNTRY_FLAGS[clean]} ${clean}` : country;
}

function patchLoginDemoAccount() {
  const loginCard = document.querySelector('.loginCard');
  if (!loginCard) return;

  const inputs = loginCard.querySelectorAll('input');
  const emailInput = inputs[0];
  const passwordInput = inputs[1];

  if (emailInput && emailInput.value === 'admin@coupang.com') {
    setReactInputValue(emailInput, 'admin@demo.com');
  }
  if (passwordInput && !passwordInput.value) {
    setReactInputValue(passwordInput, 'admin123');
  }

  loginCard.querySelectorAll('small').forEach((small) => {
    if (small.textContent?.includes('admin@coupang.com')) {
      small.textContent = 'Demo: admin@demo.com / admin123';
    }
  });
}

function patchPaymentCountryCards() {
  const heading = document.querySelector('header h2');
  const title = heading?.textContent || '';
  const isPaymentDashboard = title.includes('Payment') || title.includes('학비') || title.includes('Tuition');
  if (!isPaymentDashboard) return;

  const grids = Array.from(document.querySelectorAll('.grid3'));
  const countryGrid = grids.find((grid) => {
    const names = Array.from(grid.querySelectorAll('.country h3')).map((h) => plainCountryName(h.textContent || ''));
    return ['Korea', 'Taiwan', 'Singapore', 'Japan'].some((name) => names.includes(name));
  });
  if (!countryGrid) return;

  countryGrid.classList.add('paymentCountryGrid');
  const order = ['Korea', 'Taiwan', 'Singapore', 'Japan'];
  const cards = Array.from(countryGrid.querySelectorAll(':scope > .country'));
  order.forEach((country) => {
    const card = cards.find((el) => plainCountryName(el.querySelector('h3')?.textContent || '') === country);
    if (card) countryGrid.appendChild(card);
  });
}

function patchCountryFlags() {
  document.querySelectorAll('.country h3').forEach((h3) => {
    const clean = plainCountryName(h3.textContent || '');
    if (COUNTRY_FLAGS[clean]) h3.textContent = withFlag(clean);
  });

  document.querySelectorAll('td').forEach((td) => {
    const clean = plainCountryName(td.textContent || '');
    if (COUNTRY_FLAGS[clean]) td.textContent = withFlag(clean);
  });

  document.querySelectorAll('option').forEach((option) => {
    const clean = plainCountryName(option.textContent || '');
    if (COUNTRY_FLAGS[clean]) option.textContent = withFlag(clean);
  });
}

function applyDemoUiRuntime() {
  patchLoginDemoAccount();
  patchPaymentCountryCards();
  patchCountryFlags();
}

export function initDemoUiRuntime() {
  requestAnimationFrame(applyDemoUiRuntime);
  setTimeout(applyDemoUiRuntime, 100);
  setTimeout(applyDemoUiRuntime, 500);

  const observer = new MutationObserver(() => requestAnimationFrame(applyDemoUiRuntime));
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}
