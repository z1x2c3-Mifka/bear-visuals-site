/* Bear Visuals account linking: loaded after the existing inline site script. */
(() => {
  'use strict';

  function addAccountLinkPanel() {
    const signedInPanel = document.getElementById('signedInPanel');
    const signOutButton = document.getElementById('signOutButton');
    if (!signedInPanel || document.getElementById('bearGameLinkPanel')) return;

    const panel = document.createElement('section');
    panel.id = 'bearGameLinkPanel';
    panel.style.cssText = [
      'margin:16px 0 12px', 'padding:14px', 'border:1px solid rgba(184,121,62,.28)',
      'border-radius:12px', 'background:rgba(22,13,9,.72)', 'color:#FFF4E8'
    ].join(';');

    const title = document.createElement('h3');
    title.textContent = 'Подключить Minecraft';
    title.style.cssText = 'margin:0 0 7px;color:#D29A61;font-size:15px';

    const help = document.createElement('p');
    help.textContent = 'Открой Bear Visuals в Minecraft → OTHER → Frend, нажми «Создать код подключения» и введи код ниже. Пароль от сайта в Minecraft вводить не нужно.';
    help.style.cssText = 'margin:0 0 12px;color:#B8A99D;font-size:12px;line-height:1.55';

    const form = document.createElement('form');
    form.id = 'bearGameLinkForm';
    form.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px';

    const input = document.createElement('input');
    input.id = 'bearGamePairCode';
    input.type = 'text';
    input.inputMode = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.maxLength = 10;
    input.placeholder = 'КОД ИЗ MINECRAFT';
    input.setAttribute('aria-label', 'Код подключения из Minecraft');
    input.style.cssText = 'min-width:0;box-sizing:border-box;padding:11px 12px;border:1px solid rgba(184,121,62,.4);border-radius:8px;background:#100A07;color:#FFF4E8;font:inherit;font-weight:700;letter-spacing:.12em;text-transform:uppercase';
    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Подключить';
    button.style.cssText = 'padding:10px 13px;border:1px solid #8B5A2B;border-radius:8px;background:#5A3822;color:#FFF4E8;font:inherit;font-weight:700;cursor:pointer';

    const status = document.createElement('p');
    status.id = 'bearGameLinkStatus';
    status.setAttribute('role', 'status');
    status.style.cssText = 'margin:10px 0 0;color:#B8A99D;font-size:12px;line-height:1.45';
    status.textContent = 'Код действует 10 минут и используется один раз.';

    form.append(input, button);
    panel.append(title, help, form, status);
    if (signOutButton && signOutButton.parentElement === signedInPanel) {
      signedInPanel.insertBefore(panel, signOutButton);
    } else {
      signedInPanel.appendChild(panel);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const code = input.value.trim();
      if (!/^[A-HJ-NP-Z2-9]{10}$/.test(code)) {
        status.textContent = 'Введи все 10 символов кода из Minecraft.';
        status.style.color = '#D6A08C';
        return;
      }
      if (typeof supabase === 'undefined' || !supabase || typeof supabase.rpc !== 'function') {
        status.textContent = 'Supabase не подключён на сайте. Проверь Publishable key в index.html.';
        status.style.color = '#D6A08C';
        return;
      }
      if (typeof currentSession === 'undefined' || !currentSession?.user) {
        status.textContent = 'Сначала войди в аккаунт Bear Visuals на сайте.';
        status.style.color = '#D6A08C';
        return;
      }

      button.disabled = true;
      button.textContent = 'Подключаем…';
      status.textContent = 'Проверяем код…';
      status.style.color = '#B8A99D';
      try {
        const { data, error } = await supabase.rpc('claim_bear_game_pairing', {
          p_pair_code: code
        });
        if (error) throw error;
        if (data?.status !== 'claimed') {
          throw new Error('Supabase не подтвердил подключение. Создай новый код в Minecraft.');
        }
        input.value = '';
        status.textContent = 'Готово! Теперь вернись в Minecraft: аккаунт подключится автоматически за несколько секунд.';
        status.style.color = '#C4D6AD';
        if (typeof toast === 'function') {
          toast('Minecraft подключён', 'Вернись в игру — система друзей скоро активируется.', 'success');
        }
      } catch (error) {
        status.textContent = error?.message || 'Не удалось подключить Minecraft. Создай новый код и попробуй ещё раз.';
        status.style.color = '#D6A08C';
      } finally {
        button.disabled = false;
        button.textContent = 'Подключить';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAccountLinkPanel, { once: true });
  } else {
    addAccountLinkPanel();
  }
})();
