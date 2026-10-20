/* =========================================================
   BEAR VISUALS — УВЕДОМЛЕНИЯ И КОДЫ АКТИВАЦИИ
   Файл: notifications.js
   ========================================================= */

(() => {
    'use strict';

    const TABLE = 'bear_visuals_notifications';

    const style = document.createElement('style');
    style.textContent = `
        .bv-notifications-wrap {
            position: relative;
            display: inline-flex;
            flex: 0 0 auto;
        }

        .bv-notifications-button {
            position: relative;
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            padding: 0;
            border: 1px solid rgba(210,154,97,.24);
            border-radius: 10px;
            background: rgba(184,121,62,.08);
            color: #D29A61;
            cursor: pointer;
            transition: background .2s, border-color .2s, transform .2s;
        }

        .bv-notifications-button:hover {
            background: rgba(184,121,62,.17);
            border-color: rgba(210,154,97,.55);
            transform: translateY(-1px);
        }

        .bv-notifications-button svg {
            width: 20px;
            height: 20px;
            display: block;
        }

        .bv-notifications-count {
            position: absolute;
            top: -5px;
            right: -5px;
            display: grid;
            place-items: center;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            border: 2px solid #160D09;
            border-radius: 999px;
            background: #B8793E;
            color: #FFF4E8;
            font-size: 9px;
            font-weight: 900;
            line-height: 1;
        }

        .bv-notifications-count[hidden] {
            display: none;
        }

        .bv-notifications-panel {
            position: absolute;
            z-index: 1000;
            top: calc(100% + 11px);
            right: 0;
            width: min(370px, calc(100vw - 30px));
            max-height: min(540px, 76vh);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(210,154,97,.28);
            border-radius: 15px;
            background: #160D09;
            color: #FFF4E8;
            box-shadow: 0 22px 70px rgba(0,0,0,.55);
        }

        .bv-notifications-panel[hidden] {
            display: none;
        }

        .bv-notifications-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 16px;
            border-bottom: 1px solid rgba(210,154,97,.13);
            background: linear-gradient(
                120deg,
                rgba(139,90,43,.2),
                rgba(22,13,9,.2)
            );
        }

        .bv-notifications-heading {
            margin: 0;
            font-size: 14px;
            font-weight: 850;
        }

        .bv-notifications-subtitle {
            margin: 4px 0 0;
            color: #B8A99D;
            font-size: 10px;
        }

        .bv-notifications-actions {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .bv-notifications-small-button {
            display: grid;
            place-items: center;
            min-width: 30px;
            height: 30px;
            padding: 0 8px;
            border: 1px solid rgba(210,154,97,.18);
            border-radius: 8px;
            background: rgba(184,121,62,.07);
            color: #D8BEA7;
            font-size: 11px;
            cursor: pointer;
        }

        .bv-notifications-small-button:hover {
            border-color: rgba(210,154,97,.5);
            color: #FFF4E8;
        }

        .bv-notifications-list {
            padding: 9px;
            overflow-y: auto;
            overscroll-behavior: contain;
        }

        .bv-notifications-list::-webkit-scrollbar {
            width: 7px;
        }

        .bv-notifications-list::-webkit-scrollbar-track {
            background: #100A07;
            border-radius: 10px;
        }

        .bv-notifications-list::-webkit-scrollbar-thumb {
            border: 1px solid #160D09;
            border-radius: 10px;
            background: linear-gradient(#D29A61, #8B5A2B);
        }

        .bv-notifications-status {
            padding: 18px 13px;
            color: #B8A99D;
            font-size: 11px;
            line-height: 1.7;
            text-align: center;
        }

        .bv-notification-item {
            position: relative;
            margin-bottom: 8px;
            padding: 13px;
            border: 1px solid rgba(210,154,97,.13);
            border-radius: 11px;
            background: rgba(255,255,255,.018);
        }

        .bv-notification-item:last-child {
            margin-bottom: 0;
        }

        .bv-notification-item.is-unread {
            border-color: rgba(184,121,62,.4);
            background: rgba(139,90,43,.09);
        }

        .bv-notification-title-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        .bv-notification-title {
            flex: 1;
            min-width: 0;
            margin: 0;
            font-size: 12px;
            font-weight: 800;
            line-height: 1.5;
            overflow-wrap: anywhere;
        }

        .bv-notification-unread-dot {
            flex: 0 0 auto;
            width: 7px;
            height: 7px;
            margin-top: 5px;
            border-radius: 50%;
            background: #D29A61;
            box-shadow: 0 0 9px rgba(210,154,97,.4);
        }

        .bv-notification-date {
            margin-top: 4px;
            color: #8F7D6F;
            font-size: 9px;
        }

        .bv-notification-message {
            margin: 9px 0 0;
            color: #C7B7A8;
            font-size: 11px;
            line-height: 1.65;
            overflow-wrap: anywhere;
        }

        .bv-activation-code {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-top: 12px;
            padding: 10px;
            border: 1px solid rgba(210,154,97,.22);
            border-radius: 9px;
            background: #100A07;
        }

        .bv-activation-code code {
            min-width: 0;
            color: #FFD08A;
            font-family: Consolas, Monaco, monospace;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .8px;
            overflow-wrap: anywhere;
            user-select: text;
        }

        .bv-copy-code {
            flex: 0 0 auto;
            padding: 7px 9px;
            border: 1px solid #8B5A2B;
            border-radius: 7px;
            background: #5A3822;
            color: #FFF4E8;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
        }

        .bv-copy-code:hover {
            background: #764A2B;
        }

        .bv-notification-mark-read {
            display: inline-block;
            margin-top: 10px;
            padding: 0;
            border: 0;
            background: transparent;
            color: #D29A61;
            font-size: 10px;
            cursor: pointer;
        }

        .bv-notification-mark-read:hover {
            color: #FFD08A;
        }

        @media (max-width: 620px) {
            .bv-notifications-button {
                width: 38px;
                height: 38px;
            }

            .bv-notifications-panel {
                position: fixed;
                top: 74px;
                right: 14px;
                max-height: calc(100vh - 94px);
            }
        }
    `;

    document.head.appendChild(style);

    const navActions = document.querySelector('.nav-actions');

    if (!navActions || document.getElementById('bvNotificationsWrap')) {
        return;
    }

    // Кнопка с колокольчиком.
    const wrap = document.createElement('div');
    wrap.id = 'bvNotificationsWrap';
    wrap.className = 'bv-notifications-wrap';

    const bellButton = document.createElement('button');
    bellButton.type = 'button';
    bellButton.className = 'bv-notifications-button';
    bellButton.setAttribute('aria-label', 'Уведомления Bear Visuals');
    bellButton.setAttribute('aria-expanded', 'false');
    bellButton.title = 'Уведомления';

    bellButton.innerHTML = `
        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="1.7"
             stroke-linecap="round"
             stroke-linejoin="round"
             aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
            <path d="M10 21h4"></path>
        </svg>
    `;

    const countBadge = document.createElement('span');
    countBadge.className = 'bv-notifications-count';
    countBadge.hidden = true;
    bellButton.appendChild(countBadge);

    // Выпадающее окно.
    const panel = document.createElement('section');
    panel.className = 'bv-notifications-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Уведомления');

    const header = document.createElement('div');
    header.className = 'bv-notifications-header';

    const headingBox = document.createElement('div');

    const heading = document.createElement('h3');
    heading.className = 'bv-notifications-heading';
    heading.textContent = 'Уведомления';

    const subtitle = document.createElement('p');
    subtitle.className = 'bv-notifications-subtitle';
    subtitle.textContent = 'Сообщения и коды активации';

    headingBox.append(heading, subtitle);

    const headerActions = document.createElement('div');
    headerActions.className = 'bv-notifications-actions';

    const refreshButton = document.createElement('button');
    refreshButton.type = 'button';
    refreshButton.className = 'bv-notifications-small-button';
    refreshButton.textContent = 'Обновить';
    refreshButton.title = 'Обновить уведомления';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'bv-notifications-small-button';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Закрыть уведомления');

    headerActions.append(refreshButton, closeButton);
    header.append(headingBox, headerActions);

    const list = document.createElement('div');
    list.className = 'bv-notifications-list';

    panel.append(header, list);
    wrap.append(bellButton, panel);

    const accountButton = document.getElementById('accountButton');

    if (accountButton && accountButton.parentElement === navActions) {
        navActions.insertBefore(wrap, accountButton);
    } else {
        navActions.prepend(wrap);
    }

    let currentNotifications = [];
    let activeUserId = null;
    let realtimeChannel = null;
    let loadSequence = 0;

    function getSupabaseClient() {
        try {
            if (typeof supabase !== 'undefined' && supabase) {
                return supabase;
            }
        } catch (_) {
            // Supabase ещё не инициализирован.
        }

        return null;
    }

    function setUnreadCount(count) {
        const value = Math.max(0, Number(count) || 0);

        countBadge.hidden = value === 0;
        countBadge.textContent = value > 99 ? '99+' : String(value);

        bellButton.setAttribute(
            'aria-label',
            value > 0
                ? `Уведомления Bear Visuals, непрочитанных: ${value}`
                : 'Уведомления Bear Visuals'
        );
    }

    function showStatus(message) {
        list.replaceChildren();

        const empty = document.createElement('div');
        empty.className = 'bv-notifications-status';
        empty.textContent = message;

        list.appendChild(empty);
    }

    function showToast(title, message, type = 'success') {
        try {
            if (typeof toast === 'function') {
                toast(title, message, type);
                return;
            }
        } catch (_) {
            // Если основной toast отсутствует, используем alert ниже.
        }

        window.alert(`${title}\n${message}`);
    }

    function formatDate(value) {
        if (!value) {
            return '';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return '';
        }

        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async function copyCode(code) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(code);
            } else {
                const temporaryInput = document.createElement('textarea');
                temporaryInput.value = code;
                temporaryInput.style.position = 'fixed';
                temporaryInput.style.opacity = '0';

                document.body.appendChild(temporaryInput);
                temporaryInput.select();

                const copied = document.execCommand('copy');
                temporaryInput.remove();

                if (!copied) {
                    throw new Error('Не удалось скопировать код');
                }
            }

            showToast(
                'Код скопирован',
                'Вставь его в Bear Visuals для активации лицензии.'
            );
        } catch (error) {
            showToast(
                'Не удалось скопировать',
                'Выдели код и скопируй его вручную.',
                'error'
            );
        }
    }

    function renderNotifications(rows, userId) {
        currentNotifications = Array.isArray(rows) ? rows : [];

        const unreadCount = currentNotifications.filter(
            item => !item.is_read
        ).length;

        setUnreadCount(unreadCount);
        list.replaceChildren();

        if (currentNotifications.length === 0) {
            showStatus(
                'Пока уведомлений нет. После выдачи лицензии код активации появится здесь.'
            );
            return;
        }

        for (const item of currentNotifications) {
            const card = document.createElement('article');

            card.className = 'bv-notification-item';

            if (!item.is_read) {
                card.classList.add('is-unread');
            }

            const titleRow = document.createElement('div');
            titleRow.className = 'bv-notification-title-row';

            const title = document.createElement('h4');
            title.className = 'bv-notification-title';
            title.textContent = item.title || 'Уведомление Bear Visuals';

            titleRow.appendChild(title);

            if (!item.is_read) {
                const dot = document.createElement('span');
                dot.className = 'bv-notification-unread-dot';
                dot.setAttribute('aria-label', 'Новое уведомление');
                titleRow.appendChild(dot);
            }

            card.appendChild(titleRow);

            const date = document.createElement('div');
            date.className = 'bv-notification-date';
            date.textContent = formatDate(item.created_at);

            card.appendChild(date);

            if (item.message) {
                const message = document.createElement('p');
                message.className = 'bv-notification-message';
                message.textContent = item.message;
                card.appendChild(message);
            }

            if (item.activation_code) {
                const codeBox = document.createElement('div');
                codeBox.className = 'bv-activation-code';

                const code = document.createElement('code');
                code.textContent = item.activation_code;

                const copyButton = document.createElement('button');
                copyButton.type = 'button';
                copyButton.className = 'bv-copy-code';
                copyButton.textContent = 'Копировать';

                copyButton.addEventListener('click', () => {
                    copyCode(item.activation_code);
                });

                codeBox.append(code, copyButton);
                card.appendChild(codeBox);
            }

            if (!item.is_read) {
                const markReadButton = document.createElement('button');
                markReadButton.type = 'button';
                markReadButton.className = 'bv-notification-mark-read';
                markReadButton.textContent = 'Пометить прочитанным';

                markReadButton.addEventListener('click', () => {
                    markAsRead(item.id, userId);
                });

                card.appendChild(markReadButton);
            }

            list.appendChild(card);
        }
    }

    function setupRealtime(client, userId) {
        if (
            activeUserId === userId &&
            realtimeChannel
        ) {
            return;
        }

        if (realtimeChannel) {
            try {
                client.removeChannel(realtimeChannel);
            } catch (_) {
                // Не мешаем обычному обновлению списка.
            }

            realtimeChannel = null;
        }

        activeUserId = userId;

        if (typeof client.channel !== 'function') {
            return;
        }

        try {
            realtimeChannel = client
                .channel(`bv-notifications-${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: TABLE,
                        filter: `user_id=eq.${userId}`
                    },
                    () => {
                        loadNotifications(true);
                    }
                )
                .subscribe();
        } catch (error) {
            console.warn(
                '[Bear Visuals] Realtime уведомлений недоступен:',
                error
            );
        }
    }

    async function getSignedInUser(client) {
        const { data, error } = await client.auth.getSession();

        if (error) {
            throw error;
        }

        return data?.session?.user || null;
    }

    async function loadNotifications(quiet = false) {
        const sequence = ++loadSequence;
        const client = getSupabaseClient();

        if (!client || !client.auth || !client.from) {
            setUnreadCount(0);

            if (!quiet) {
                showStatus(
                    'Supabase ещё не подключён. Сначала настрой авторизацию сайта.'
                );
            }

            return;
        }

        if (!quiet) {
            showStatus('Загружаем уведомления…');
        }

        try {
            const user = await getSignedInUser(client);

            if (sequence !== loadSequence) {
                return;
            }

            if (!user) {
                activeUserId = null;
                currentNotifications = [];
                setUnreadCount(0);

                showStatus('Войди в аккаунт Bear Visuals, чтобы увидеть свои уведомления.');

                const loginButton = document.createElement('button');
                loginButton.type = 'button';
                loginButton.className = 'bv-copy-code';
                loginButton.textContent = 'Войти в аккаунт';
                loginButton.style.margin = '0 auto 12px';
                loginButton.style.display = 'block';

                loginButton.addEventListener('click', () => {
                    if (accountButton) {
                        accountButton.click();
                    }
                });

                list.appendChild(loginButton);
                return;
            }

            setupRealtime(client, user.id);

            const { data, error } = await client
                .from(TABLE)
                .select(
                    'id, title, message, activation_code, is_read, created_at, notification_type'
                )
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(30);

            if (error) {
                throw error;
            }

            if (sequence !== loadSequence) {
                return;
            }

            renderNotifications(data || [], user.id);
        } catch (error) {
            if (sequence !== loadSequence) {
                return;
            }

            console.error(
                '[Bear Visuals] Не удалось загрузить уведомления:',
                error
            );

            setUnreadCount(0);

            showStatus(
                'Не удалось загрузить уведомления. Проверь, что SQL-миграция уведомлений выполнена в Supabase.'
            );
        }
    }

    async function markAsRead(notificationId, userId) {
        const client = getSupabaseClient();

        if (!client || !notificationId || !userId) {
            return;
        }

        try {
            const { error } = await client
                .from(TABLE)
                .update({ is_read: true })
                .eq('id', notificationId)
                .eq('user_id', userId);

            if (error) {
                throw error;
            }

            await loadNotifications(true);
        } catch (error) {
            console.error(
                '[Bear Visuals] Не удалось отметить уведомление:',
                error
            );

            showToast(
                'Не удалось обновить уведомление',
                'Попробуй ещё раз.',
                'error'
            );
        }
    }

    function openPanel() {
        panel.hidden = false;
        bellButton.setAttribute('aria-expanded', 'true');
        loadNotifications();
    }

    function closePanel() {
        panel.hidden = true;
        bellButton.setAttribute('aria-expanded', 'false');
    }

    bellButton.addEventListener('click', () => {
        if (panel.hidden) {
            openPanel();
        } else {
            closePanel();
        }
    });

    closeButton.addEventListener('click', closePanel);

    refreshButton.addEventListener('click', () => {
        loadNotifications();
    });

    document.addEventListener('click', event => {
        if (!wrap.contains(event.target)) {
            closePanel();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closePanel();
        }
    });

    const client = getSupabaseClient();

    if (client?.auth?.onAuthStateChange) {
        client.auth.onAuthStateChange(() => {
            // Даём основному обработчику сайта обновить состояние сессии.
            window.setTimeout(() => {
                loadNotifications(true);
            }, 0);
        });
    }

    // Обновляем счётчик, пока вкладка сайта открыта.
    window.setInterval(() => {
        if (!document.hidden) {
            loadNotifications(true);
        }
    }, 45000);

    setUnreadCount(0);
})();
