/*
 * Bear Visuals
 * Модуль «Подключить Minecraft» удалён.
 * Этот файл оставлен пустым по функциональности,
 * чтобы старое подключение скрипта не вызывало ошибок.
 */

(() => {
    'use strict';

    function removeMinecraftLinkPanel() {
        const panel = document.getElementById('bearGameLinkPanel');

        if (panel) {
            panel.remove();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            removeMinecraftLinkPanel,
            { once: true }
        );
    } else {
        removeMinecraftLinkPanel();
    }
})();
