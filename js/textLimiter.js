const DEFAULT_TEXT_LIMIT = 200;

function countEffectiveCharacters(value) {
    return String(value || '').length;
}

function trimToEffectiveLimit(value, limit) {
    const source = String(value || '');
    return source.slice(0, Math.max(limit, 0));
}

function ensureTextLimiterUI(field, options) {
    const helperId = `${field.id}Limiter`;
    let helper = document.getElementById(helperId);

    if (helper) {
        return helper;
    }

    helper = document.createElement('div');
    helper.id = helperId;
    helper.className = 'text-limit-helper';
    helper.innerHTML = `
        <span class="text-limit-status"></span>
    `;

    field.insertAdjacentElement('afterend', helper);

    return helper;
}

function updateTextLimiter(field, options) {
    const helper = ensureTextLimiterUI(field, options);
    const status = helper.querySelector('.text-limit-status');
    let currentLimit = Number(field.dataset.effectiveLimit) || options.initialLimit;
    const effectiveCharacters = countEffectiveCharacters(field.value);

    if (effectiveCharacters > currentLimit) {
        field.value = trimToEffectiveLimit(field.value, currentLimit);
    }

    const effectiveAfterTrim = countEffectiveCharacters(field.value);
    const remaining = Math.max(currentLimit - effectiveAfterTrim, 0);

    status.textContent = `${effectiveAfterTrim}/${currentLimit} caracteres. Restan ${remaining}.`;

    helper.classList.toggle('is-near-limit', remaining <= 20);
    helper.classList.toggle('is-at-limit', remaining === 0);
}

function setupExpandableTextLimiter(config) {
    const field = document.getElementById(config.fieldId);

    if (!field) {
        return null;
    }

    const options = {
        initialLimit: config.initialLimit || DEFAULT_TEXT_LIMIT
    };

    field.dataset.effectiveLimit = String(options.initialLimit);
    ensureTextLimiterUI(field, options);

    field.addEventListener('input', function () {
        updateTextLimiter(field, options);
    });

    updateTextLimiter(field, options);

    return {
        refresh() {
            updateTextLimiter(field, options);
        }
    };
}

window.setupExpandableTextLimiter = setupExpandableTextLimiter;
