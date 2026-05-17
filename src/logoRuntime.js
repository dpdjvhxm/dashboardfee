import coupangLogoUrl from './assets/coupang-logo.webp';

function renderBrandLogo() {
  const sideBrand = document.querySelector('.side h1');
  if (sideBrand && sideBrand.dataset.logoApplied !== 'true') {
    sideBrand.dataset.logoApplied = 'true';
    sideBrand.classList.add('brandBlock');
    sideBrand.innerHTML = `
      <img class="brandLogoImg" src="${coupangLogoUrl}" alt="coupang" />
      <span class="brandTitle">Global Mobility</span>
    `;
  }

  const loginLogo = document.querySelector('.loginLogo');
  if (loginLogo && loginLogo.dataset.logoApplied !== 'true') {
    loginLogo.dataset.logoApplied = 'true';
    loginLogo.innerHTML = `<img class="loginLogoImg" src="${coupangLogoUrl}" alt="coupang" />`;
  }
}

export function initLogoRuntime() {
  requestAnimationFrame(renderBrandLogo);
  setTimeout(renderBrandLogo, 100);
  setTimeout(renderBrandLogo, 500);

  const observer = new MutationObserver(() => requestAnimationFrame(renderBrandLogo));
  observer.observe(document.body, { childList: true, subtree: true });
}
