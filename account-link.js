
/* Bear Visuals — Minecraft account linking + custom scrollbar */
(() => {
  'use strict';

  function addBearScrollbar() {
    if (document.getElementById('bear-visuals-scrollbar-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'bear-visuals-scrollbar-style';

    style.textContent = `
      :root {
        scrollbar-color: #8B5A2B #100A07;
        scrollbar-width: thin;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: #8B5A2B #100A07;
      }

      ::-webkit-scrollbar {
        width: 9px;
        height: 9px;
      }

      ::-webkit-scrollbar-track {
        background: #100A07;
        border: 1px solid #24160F;
        border-radius: 999px;
      }

      ::-webkit-scrollbar-thumb {
        min-height: 30px;
        background: linear-gradient(
          180deg,
          #B8793E 0%,
          #8B5A2B 55%,
          #5A3822 100%
        );
        border: 2px solid #100A07;
        border-radius: 999px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(
          180deg,
          #D29A61 0%,
          #B8793E 100%
        );
      }

      ::-webkit-scrollbar-thumb:active {
        background: #D29A61;
      }

      ::-webkit-scrollbar-corner {
        background: #100A07;
      }

      #bearGameLinkPanel,
      #bearGameLinkPanel * {
        scrollbar-width: thin;
        scrollbar-color: #8B5A2B #100A07;
      }

      #bearGameLinkPanel button {
        transition:
          background 160ms ease,
          border-color 160ms ease,
          transform 160ms ease,
          box-shadow 160ms ease;
      }

      #bearGameLinkPanel button:hover:not(:disabled) {
        background: #704523 !important;
        border-color: #D29A61 !important;
        box-shadow: 0 0 12px rgba(184, 121, 62, 0.18);
      }

      #bearGameLinkPanel button:active:not(:disabled) {
        transform: scale(0.98);
      }

      #bearGameLinkPanel button:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      #bearGamePairCode {
        outline: none;
        transition:
          border-color 160ms ease,
          box-shadow 160ms ease;
      }

      #bearGamePairCode:focus {
        border-color: #D29A61 !important;
        box-shadow: 0 0 0 3px rgba(184, 121, 62, 0.15);
      }

      @media (max-width: 480px) {
        #bearGameLinkPanel form {
          grid-template-columns: minmax(0, 1fr) !important;
        }

        #bearGameLinkPanel form button {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function addAccountLinkPanel() {
    const signedInPanel = document.getElementById('signedInPanel');
    const signOutButton = document.getElementById('signOutButton');

    if (
      !signedInPanel ||
      document.getElementById('bearGameLinkPanel')
    ) {
      return;
    }

    const panel = document.createElement('section');
    panel.id = 'bearGameLinkPanel';

    panel.style.cssText = [
      'margin:16px 0 12px',
      'padding:14px',
      'border:1px solid rgba(184,121,62,.28)',
      'border-radius:12px',
      'background:rgba(22,13,9,.72)',
      'color:#FFF4E8'
    ].join(';');

    const title = document.createElement('h3');
    title.textContent = 'Подключить Minecraft';

    title.style.cssText = [
      'margin:0 0 12px',
      'color:#D29A61',
      'font-size:15px'
    ].join(';');

    /*
     * Инструкцию про создание кода в Minecraft убрали.
     * Само подключение через код осталось рабочим.
     */

    const form = document.createElement('form');
    form.id = 'bearGameLinkForm';

    form.style.cssText = [
      'display:grid',
      'grid-template-columns:minmax(0,1fr) auto',
      'gap:8px'
    ].join(';');

    const input = document.createElement('input');
    input.id = 'bearGamePairCode';
    input.type = 'text';
    input.inputMode = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.maxLength = 10;
    input.placeholder = 'КОД ПОДКЛЮЧЕНИЯ';

    input.setAttribute(
      'aria-label',
      'Код подключения Minecraft'
    );

    input.style.cssText = [
      'min-width:0',
      'box-sizing:border-box',
      'padding:11px 12px',
      'border:1px solid rgba(184,121,62,.4)',
      'border-radius:8px',
      'background:#100A07',
      'color:#FFF4E8',
      'font:inherit',
      'font-weight:700',
      'letter-spacing:.12em',
      'text-transform:uppercase'
    ].join(';');

    input.addEventListener('input', () => {
      input.value = input.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 10);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Подключить';

    button.style.cssText = [
      'padding:10px 13px',
      'border:1px solid #8B5A2B',
      'border-radius:8px',
      'background:#5A3822',
      'color:#FFF4E8',
      'font:inherit',
      'font-weight:700',
      'cursor:pointer'
    ].join(';');

    const status = document.createElement('p');
    status.id = 'bearGameLinkStatus';
    status.setAttribute('role', 'status');

    status.style.cssText = [
      'margin:10px 0 0',
      'color:#B8A99D',
      'font-size:12px',
      'line-height:1.45'
    ].join(';');

    status.textContent =
      'Код действует 10 минут и используется один раз.';

    form.append(input, button);
    panel.append(title, form, status);

    if (
      signOutButton &&
      signOutButton.parentElement === signedInPanel
    ) {
      signedInPanel.insertBefore(panel, signOutButton);
    } else {
      signedInPanel.appendChild(panel);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const code = input.value.trim();

      if (!/^[A-HJ-NP-Z2-9]{10}$/.test(code)) {
        status.textContent =
          'Введи все 10 символов кода подключения.';

        status.style.color = '#D6A08C';
        return;
      }

      if (
        typeof supabase === 'undefined' ||
        !supabase ||
        typeof supabase.rpc !== 'function'
      ) {
        status.textContent =
          'Не удалось подключиться к серверу. Обнови страницу и попробуй снова.';

        status.style.color = '#D6A08C';
        return;
      }

      if (
        typeof currentSession === 'undefined' ||
        !currentSession?.user
      ) {
        status.textContent =
          'Сначала войди в аккаунт Bear Visuals.';

        status.style.color = '#D6A08C';
        return;
      }

      button.disabled = true;
      button.textContent = 'Подключаем…';

      status.textContent = 'Проверяем код…';
      status.style.color = '#B8A99D';

      try {
        const { data, error } = await supabase.rpc(
          'claim_bear_game_pairing',
          {
            p_pair_code: code
          }
        );

        if (error) {
          throw error;
        }

        if (data?.status !== 'claimed') {
          throw new Error(
            'Сервер не подтвердил подключение. Создай новый код.'
          );
        }

        input.value = '';

        status.textContent =
          'Minecraft успешно подключён! Можешь возвращаться в игру.';

        status.style.color = '#C4D6AD';

        if (typeof toast === 'function') {
          toast(
            'Minecraft подключён',
            'Вернись в игру — система друзей скоро активируется.',
            'success'
          );
        }
      } catch (error) {
        status.textContent =
          error?.message ||
          'Не удалось подключить Minecraft. Попробуй создать новый код.';

        status.style.color = '#D6A08C';
      } finally {
        button.disabled = false;
        button.textContent = 'Подключить';
      }
    });
  }

  function initializeBearAccountLink() {
    addBearScrollbar();
    addAccountLinkPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeBearAccountLink,
      { once: true }
    );
  } else {
    initializeBearAccountLink();
  }
})();
