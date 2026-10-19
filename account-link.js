/\* Bear Visuals account linking: loaded after the existing inline site script. \*/\
(() => {\
&#x20; 'use strict';\
\
&#x20; function addAccountLinkPanel() {\
&#x20;   const signedInPanel = *document*.getElementById('signedInPanel');\
&#x20;   const signOutButton = *document*.getElementById('signOutButton');\
&#x20;   if (!signedInPanel || *document*.getElementById('bearGameLinkPanel')) return;\
\
&#x20;   const panel = *document*.createElement('section');\
&#x20;   panel.id = 'bearGameLinkPanel';\
&#x20;   panel.style.cssText = [\
&#x20;     'margin:16px 0 12px', 'padding:14px', 'border:1px solid rgba(184,121,62,.28)',\
&#x20;     'border-radius:12px', 'background:rgba(22,13,9,.72)', 'color:#FFF4E8'\
&#x20;   ].join(';');\
\
&#x20;   const title = *document*.createElement('h3');\
&#x20;   title.textContent = 'Подключить Minecraft';\
&#x20;   title.style.cssText = 'margin:0 0 7px;color:#D29A61;font-size:15px';\
\
&#x20;   const help = *document*.createElement('p');\
&#x20;   help.textContent = 'Открой Bear Visuals в Minecraft → OTHER → Frend, нажми «Создать код подключения» и введи код ниже. Пароль от сайта в Minecraft вводить не нужно.';\
&#x20;   help.style.cssText = 'margin:0 0 12px;color:#B8A99D;font-size:12px;line-height:1.55';\
\
&#x20;   const form = *document*.createElement('form');\
&#x20;   form.id = 'bearGameLinkForm';\
&#x20;   form.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px';\
\
&#x20;   const input = *document*.createElement('input');\
&#x20;   input.id = 'bearGamePairCode';\
&#x20;   input.type = 'text';\
&#x20;   input.inputMode = 'text';\
&#x20;   input.autocomplete = 'off';\
&#x20;   input.spellcheck = false;\
&#x20;   input.maxLength = 10;\
&#x20;   input.placeholder = 'КОД ИЗ MINECRAFT';\
&#x20;   input.setAttribute('aria-label', 'Код подключения из Minecraft');\
&#x20;   input.style.cssText = 'min-width:0;box-sizing:border-box;padding:11px 12px;border:1px solid rgba(184,121,62,.4);border-radius:8px;background:#100A07;color:#FFF4E8;font:inherit;font-weight:700;letter-spacing:.12em;text-transform:uppercase';\
&#x20;   input.addEventListener('input', () => {\
&#x20;     input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);\
&#x20;   });\
\
&#x20;   const button = *document*.createElement('button');\
&#x20;   button.type = 'submit';\
&#x20;   button.textContent = 'Подключить';\
&#x20;   button.style.cssText = 'padding:10px 13px;border:1px solid #8B5A2B;border-radius:8px;background:#5A3822;color:#FFF4E8;font:inherit;font-weight:700;cursor:pointer';\
\
&#x20;   const status = *document*.createElement('p');\
&#x20;   status.id = 'bearGameLinkStatus';\
&#x20;   status.setAttribute('role', 'status');\
&#x20;   status.style.cssText = 'margin:10px 0 0;color:#B8A99D;font-size:12px;line-height:1.45';\
&#x20;   status.textContent = 'Код действует 10 минут и используется один раз.';\
\
&#x20;   form.append(input, button);\
&#x20;   panel.append(title, help, form, status);\
&#x20;   if (signOutButton && signOutButton.parentElement === signedInPanel) {\
&#x20;     signedInPanel.insertBefore(panel, signOutButton);\
&#x20;   } else {\
&#x20;     signedInPanel.appendChild(panel);\
&#x20;   }\
\
&#x20;   form.addEventListener('submit', async (event) => {\
&#x20;     event.preventDefault();\
&#x20;     const code = input.value.trim();\
&#x20;     if (!/^[A-HJ-NP-Z2-9]{10}$/.test(code)) {\
&#x20;       status.textContent = 'Введи все 10 символов кода из Minecraft.';\
&#x20;       status.style.color = '#D6A08C';\
&#x20;       return;\
&#x20;     }\
&#x20;     if (typeof supabase === 'undefined' || !supabase || typeof supabase.rpc !== 'function') {\
&#x20;       status.textContent = 'Supabase не подключён на сайте. Проверь Publishable key в index.html.';\
&#x20;       status.style.color = '#D6A08C';\
&#x20;       return;\
&#x20;     }\
&#x20;     if (typeof currentSession === 'undefined' || !currentSession?.user) {\
&#x20;       status.textContent = 'Сначала войди в аккаунт Bear Visuals на сайте.';\
&#x20;       status.style.color = '#D6A08C';\
&#x20;       return;\
&#x20;     }\
\
&#x20;     button.disabled = true;\
&#x20;     button.textContent = 'Подключаем…';\
&#x20;     status.textContent = 'Проверяем код…';\
&#x20;     status.style.color = '#B8A99D';\
&#x20;     try {\
&#x20;       const { data, error } = await supabase.rpc('claim_bear_game_pairing', {\
&#x20;         p_pair_code: code\
&#x20;       });\
&#x20;       if (error) throw error;\
&#x20;       if (data?.status !== 'claimed') {\
&#x20;         throw new Error('Supabase не подтвердил подключение. Создай новый код в Minecraft.');\
&#x20;       }\
&#x20;       input.value = '';\
&#x20;       status.textContent = 'Готово! Теперь вернись в Minecraft: аккаунт подключится автоматически за несколько секунд.';\
&#x20;       status.style.color = '#C4D6AD';\
&#x20;       if (typeof toast === 'function') {\
&#x20;         toast('Minecraft подключён', 'Вернись в игру — система друзей скоро активируется.', 'success');\
&#x20;       }\
&#x20;     } catch (error) {\
&#x20;       status.textContent = error?.message || 'Не удалось подключить Minecraft. Создай новый код и попробуй ещё раз.';\
&#x20;       status.style.color = '#D6A08C';\
&#x20;     } finally {\
&#x20;       button.disabled = false;\
&#x20;       button.textContent = 'Подключить';\
&#x20;     }\
&#x20;   });\
&#x20; }\
\
&#x20; if (*document*.readyState === 'loading') {\
&#x20;   *document*.addEventListener('DOMContentLoaded', addAccountLinkPanel, { once: true });\
&#x20; } else {\
&#x20;   addAccountLinkPanel();\
&#x20; }\
})();\
&#x20;куда его?
