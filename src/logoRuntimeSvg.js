import logoUrl from './assets/coupang-logo.svg';

function applyLogo() {
  const sideBrand = document.querySelector('.side h1');
  if (sideBrand && sideBrand.dataset.logoApplied !== 'svg') {
    sideBrand.dataset.logoApplied = 'svg';
    sideBrand.classList.add('brandBlock');
    sideBrand.innerHTML = `
      <img class="brandLogoImg" src="${logoUrl}" alt="coupang" />
      <span class="brandTitle">Global Mobility</span>
    `;
  }

  const loginLogo = document.querySelector('.loginLogo');
  if (loginLogo && loginLogo.dataset.logoApplied !== 'svg') {
    loginLogo.dataset.logoApplied = 'svg';
    loginLogo.innerHTML = `<img class="loginLogoImg" src="${logoUrl}" alt="coupang" />`;
  }
}

export function initLogoRuntimeSvg() {
  requestAnimationFrame(applyLogo);
  setTimeout(applyLogo, 100);
  setTimeout(applyLogo, 500);
  const observer = new MutationObserver(() => requestAnimationFrame(applyLogo));
  observer.observe(document.body, { childList: true, subtree: true });
}
