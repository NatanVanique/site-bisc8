document.querySelectorAll('[data-game-subscribe]').forEach((bar) => {
  const toggle = bar.querySelector('[data-subscribe-toggle]');
  const form = bar.querySelector('.game-subscribe-form');
  const input = bar.querySelector('.game-subscribe-input');
  const btn = bar.querySelector('.game-subscribe-btn');
  const gameName = bar.dataset.gameName;

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = bar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  btn?.addEventListener('click', async () => {
    const email = input?.value.trim();
    if (!email) {
      showMessage(bar, 'Por favor, insira seu email.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, gamename: gameName }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(bar, 'Inscrito com sucesso!', 'success');
        input.value = '';
      } else if (res.status === 409) {
        showMessage(bar, 'Este email já está inscrito.', 'error');
      } else {
        showMessage(bar, data.error || 'Erro ao inscrever.', 'error');
      }
    } catch {
      showMessage(bar, 'Erro de conexão. Tente novamente.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Registrar';
    }
  });
});

function showMessage(bar, text, type) {
  let msg = bar.querySelector('.game-subscribe-message');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'game-subscribe-message';
    bar.querySelector('.game-subscribe-content')?.appendChild(msg);
  }
  msg.textContent = text;
  msg.className = `game-subscribe-message game-subscribe-message--${type}`;
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}
