function setReactInputValue(input, value) {
  if (!input || input.value === value) return;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
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
    const names = Array.from(grid.querySelectorAll('.country h3')).map((h) => h.textContent?.trim());
    return ['Korea', 'Taiwan', 'Singapore', 'Japan'].some((name) => names.includes(name));
  });
  if (!countryGrid) return;

  countryGrid.classList.add('paymentCountryGrid');
  const order = ['Korea', 'Taiwan', 'Singapore', 'Japan'];
  const cards = Array.from(countryGrid.querySelectorAll(':scope > .country'));
  order.forEach((country) => {
    const card = cards.find((el) => el.querySelector('h3')?.textContent?.trim() === country);
    if (card) countryGrid.appendChild(card);
  });
}

function applyDemoUiRuntime() {
  patchLoginDemoAccount();
  patchPaymentCountryCards();
}

export function initDemoUiRuntime() {
  requestAnimationFrame(applyDemoUiRuntime);
  setTimeout(applyDemoUiRuntime, 100);
  setTimeout(applyDemoUiRuntime, 500);

  const observer = new MutationObserver(() => requestAnimationFrame(applyDemoUiRuntime));
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}
