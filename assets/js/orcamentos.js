document.addEventListener('DOMContentLoaded', function () {
    TagOrcamento();
    TotalizarValores();
    setupArchiveButton();
    setupAddButton()
});

function getStatusSelect() {
    return select = document.getElementById("statusSelect");
}

function aplicarCor() {
    const s = getStatusSelect();
    if (!s) return;
    s.className = "status";                    // reset
    if (s.value) s.classList.add(s.value);    // adiciona cor certa
}

const maybeSelect = getStatusSelect();
if (maybeSelect) {
    aplicarCor();                                     // cor inicial
    maybeSelect.addEventListener("change", aplicarCor);
}

function ExibirCriarOrcamento() {
    const div_orcamento = document.querySelector('.criarOrcamento');
    div_orcamento.style.display = 'flex';
}

function CriarOrcamento() {
    const orcamento_list = document.getElementById('orcamento_list');
    const s = getStatusSelect();

    const statusClass = s ? Array.from(s.classList).find(c => c && c !== 'status') : '';
    let status = statusClass || (s ? s.value : '');

    const cliente = document.getElementById('cliente_nome').value;
    const descricao = document.getElementById('orcamento_descricao').value;
    const data = document.getElementById('data_entrega').value;
    const material = document.getElementById('material_orcamento').value;
    const valor = document.getElementById('valor_total').textContent.replace("Valor Total: ", "").replace(",", ".");

    let status_name;
    if (status == "abrindo") {
        status = "aberto";
        status_name = "Aberto";
    } else if (status == "confirmar") {
        status = "confirmado";
        status_name = "Confirmado";
    } else if (status == 'arquivado') {
        status_name = "Arquivado";
    }

    // 🔑 gera um ID único para cada descrição
    const uniqueId = "descricao_" + Date.now();

    const card_orcamento = document.createElement('div');
    card_orcamento.classList.add('card-orcamento');
    card_orcamento.innerHTML = `
   
            <ul>
                <li>
                    <img src="assets/img/calendar_4864602 1.png" alt="">
                    <p>${data}</p>
                </li>
                <li>
                    <img src="assets/img/person_13937526 1.png" alt="">
                    <p>${cliente}</p>
                </li>
                <li>
                    <img src="assets/img/icons8-pedra-100 1.png" alt="">
                    <p>${material}</p>
                </li>
                <li>
                    <img src="assets/img/file_1052636 1.png" alt="">
                    <div class="descricao-limitada" id="${uniqueId}">
                        ${descricao}
                    </div>
                    <button type="button" class="ver-mais" onclick="toggleDescricao('${uniqueId}', this)">Ver mais</button>
                </li>
                <li>
                    <img src="assets/img/icons8-cifrão-100 1.png" alt="">
                    <p>${valor}</p>
                </li>
            </ul>
            <p class="tag-orcamento ${status}">${status_name}</p>
        
    `;

    if (orcamento_list.appendChild(card_orcamento)) {
        const div_orcamento = document.querySelector('.criarOrcamento');
        div_orcamento.style.display = 'none';
    }

    TagOrcamento();
}

function setupAddButton() {
    const btn = document.querySelector('.criarOrcamento .adicionar');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const form = btn.closest("form");
        if (!form) return;

        // ativa validação dos required
        const valid = form.checkValidity();

        if (!valid) {
            form.reportValidity();   // mostra a mensagem nativa do navegador
            return;                  // impede CriarOrcamento
        }

        CriarOrcamento();
    });
}

function TagOrcamento() {
    const items = document.querySelectorAll('.container-orcamento nav ul li');

    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tagSelecionada = item.id.replace('nav-', '');

            // 🔑 pega os cards atuais (inclui os novos criados)
            const cards = document.querySelectorAll('.container-orcamento .orcamento-display .card-orcamento');

            cards.forEach(card => {
                const tagCard = card.querySelector('.tag-orcamento');

                if (tagSelecionada == 'geral') {
                    card.style.display = 'flex';
                } else if (tagCard && tagCard.classList.contains(tagSelecionada)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        })
    })
}

function TotalizarValores() {
    const totalEl = document.querySelector('.criarOrcamento .botoes .total') || document.querySelector('.total');
    if (!totalEl) return;

    function getInputByLabelText(text) {
        const labels = document.querySelectorAll('label');
        for (const label of labels) {
            if (label.textContent && label.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
                const next = label.nextElementSibling;
                if (next && (next.tagName === 'INPUT' || next.tagName === 'TEXTAREA' || next.tagName === 'SELECT')) return next;
            }
        }
        return null;
    }

    const entradaInput = getInputByLabelText('Entrada');
    const restanteInput = getInputByLabelText('Restante');

    function parseCurrency(str) {
        if (!str && str !== 0) return 0;
        const s = String(str).replace(/R\$\s?/g, '').replace(/\s/g, '').trim();
        const cleaned = s.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.\-]/g, '');
        const n = parseFloat(cleaned);
        return isNaN(n) ? 0 : n;
    }

    function formatCurrency(val) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    function atualizarTotal() {
        const e = entradaInput ? parseCurrency(entradaInput.value) : 0;
        const r = restanteInput ? parseCurrency(restanteInput.value) : 0;
        const total = e + r;
        totalEl.textContent = 'Valor Total: ' + formatCurrency(total);
    }

    // liga eventos se inputs existirem
    [entradaInput, restanteInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', atualizarTotal);
        // ao sair do campo, formata o valor como moeda (opcional)
        input.addEventListener('blur', () => {
            const v = parseCurrency(input.value);
            input.value = v ? formatCurrency(v) : '';
        });
    });

    // inicializa com valores existentes
    atualizarTotal();
}

function addStatusOption(value, label, makeActive = false) {
    const sel = getStatusSelect();
    if (!sel) return;

    // evitar duplicar option
    if (!Array.from(sel.options).some(o => o.value === value)) {
        const opt = new Option(label, value);
        sel.add(opt);
    }
    if (makeActive) {
        sel.value = value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return sel;
}

function lockStatusSelect(lock = true) {
    const sel = getStatusSelect();
    if (!sel) return;
    sel.disabled = !!lock;
    sel.classList.add('arquivar');
}

function setupArchiveButton() {
    const btn = document.querySelector('.criarOrcamento .arquivar');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const isArchived = btn.dataset.archived === 'true';

        if (!isArchived) {
            // arquivar
            addStatusOption('arquivado', 'Arquivado', true);
            lockStatusSelect(true);
            btn.textContent = 'Desarquivar';
            btn.dataset.archived = 'true';
            btn.style.backgroundColor = '#808080';
            btn.style.color = '#ffffffff';
        } else {
            // desarquivar
            const sel = getStatusSelect();
            if (sel) {
                // remove a option com value "arquivado"
                const opt = Array.from(sel.options).find(o => o.value === 'arquivado');
                if (opt) sel.remove(opt.index);

                addStatusOption('abrindo', 'Abrindo', true);
            }
            lockStatusSelect(false);
            aplicarCor();
            btn.textContent = 'Arquivar';
            btn.dataset.archived = 'false';
        }
    });
}

function toggleDescricao(id, btn) {
    const descricao = document.getElementById(id);
    descricao.classList.toggle('expanded');
    btn.textContent = descricao.classList.contains('expanded') ? 'Ver menos' : 'Ver mais';
}