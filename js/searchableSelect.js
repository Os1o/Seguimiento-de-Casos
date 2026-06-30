(function () {
    function escaparHtml(valor) {
        return String(valor ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function textoSeleccionado(select, placeholder) {
        const selectedOption = select.options[select.selectedIndex];
        if (!selectedOption || !selectedOption.value) {
            return placeholder;
        }
        return selectedOption.textContent || placeholder;
    }

    function initSearchableSelect(selectId, config = {}) {
        const select = typeof selectId === 'string'
            ? document.getElementById(selectId)
            : selectId;

        if (!select) {
            return null;
        }

        if (select.dataset.searchableReady === 'true') {
            select._searchableRefresh?.();
            return select._searchableApi || null;
        }

        const placeholder = config.placeholder || 'Seleccione...';
        const searchPlaceholder = config.searchPlaceholder || 'Buscar...';

        const wrapper = document.createElement('div');
        wrapper.className = 'searchable-select';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'searchable-select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        const triggerText = document.createElement('span');
        triggerText.className = 'searchable-select-trigger-text';
        trigger.appendChild(triggerText);

        const triggerCaret = document.createElement('span');
        triggerCaret.className = 'searchable-select-trigger-caret';
        triggerCaret.innerHTML = '&#9662;';
        trigger.appendChild(triggerCaret);

        const panel = document.createElement('div');
        panel.className = 'searchable-select-panel';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'searchable-select-search';
        searchInput.placeholder = searchPlaceholder;
        searchInput.autocomplete = 'off';

        const optionsList = document.createElement('div');
        optionsList.className = 'searchable-select-options';
        optionsList.setAttribute('role', 'listbox');

        panel.appendChild(searchInput);
        panel.appendChild(optionsList);

        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(trigger);
        wrapper.appendChild(panel);
        wrapper.appendChild(select);

        select.classList.add('searchable-select-native');

        function obtenerOpciones() {
            return Array.from(select.options)
                .filter(option => option.value !== '')
                .map(option => ({
                    value: option.value,
                    label: option.textContent || '',
                    selected: option.selected
                }));
        }

        function renderizar(termino = '') {
            const busqueda = String(termino || '').trim().toUpperCase();
            const opciones = obtenerOpciones().filter(option => {
                if (!busqueda) {
                    return true;
                }
                return option.label.toUpperCase().includes(busqueda);
            });

            optionsList.innerHTML = '';

            if (opciones.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'searchable-select-empty';
                empty.textContent = 'Sin coincidencias';
                optionsList.appendChild(empty);
                return;
            }

            opciones.forEach(option => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `searchable-select-option${option.selected ? ' is-selected' : ''}`;
                button.setAttribute('role', 'option');
                button.setAttribute('aria-selected', option.selected ? 'true' : 'false');
                button.dataset.value = option.value;
                button.innerHTML = escaparHtml(option.label);
                optionsList.appendChild(button);
            });
        }

        function refresh() {
            triggerText.textContent = textoSeleccionado(select, placeholder);
            trigger.disabled = select.disabled;
            renderizar(searchInput.value);
        }

        function abrir() {
            if (trigger.disabled) {
                return;
            }

            panel.classList.add('show');
            trigger.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            window.requestAnimationFrame(() => searchInput.focus());
        }

        function cerrar() {
            panel.classList.remove('show');
            trigger.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            searchInput.value = '';
            renderizar('');
        }

        trigger.addEventListener('click', function () {
            if (panel.classList.contains('show')) {
                cerrar();
            } else {
                abrir();
            }
        });

        searchInput.addEventListener('input', function () {
            renderizar(searchInput.value);
        });

        optionsList.addEventListener('click', function (event) {
            const optionButton = event.target.closest('.searchable-select-option');
            if (!optionButton) {
                return;
            }

            select.value = optionButton.dataset.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            refresh();
            cerrar();
        });

        select.addEventListener('change', refresh);

        document.addEventListener('click', function (event) {
            if (!wrapper.contains(event.target)) {
                cerrar();
            }
        });

        const observer = new MutationObserver(refresh);
        observer.observe(select, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled']
        });

        select.dataset.searchableReady = 'true';
        select._searchableRefresh = refresh;
        select._searchableApi = {
            refresh,
            destroy() {
                observer.disconnect();
                wrapper.parentNode.insertBefore(select, wrapper);
                wrapper.remove();
                select.classList.remove('searchable-select-native');
                delete select.dataset.searchableReady;
                delete select._searchableRefresh;
                delete select._searchableApi;
            }
        };

        refresh();
        return select._searchableApi;
    }

    window.initSearchableSelect = initSearchableSelect;
})();
