document.addEventListener('DOMContentLoaded', function () {
    TagOrcamento();
    TotalizarValores();
    setupArchiveButton();
    setupAddButton()
});

function getStatusSelect() {
    return select = document.getElementById("statusSelect");
}

// guarda qual card está sendo editado; null = criando novo
let currentEditingCard = null;

// procura o input/textarea/select que vem logo depois de um label com esse texto
function findInputByLabelText(text) {
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
        if (label.textContent && label.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
            const next = label.nextElementSibling;
            if (next && (next.tagName === 'INPUT' || next.tagName === 'TEXTAREA' || next.tagName === 'SELECT')) return next;
        }
    }
    return null;
}

// pega um valor do dataset do card (tenta variações de nome para não falhar)
function getData(card, key) {
    if (!card || !card.dataset) return '';
    const lower = key.toLowerCase();
    const variants = [
        key,
        lower,
        key.replace(/([A-Z])/g, '-$1').toLowerCase(),      // data-orcamento -> data-orcamento
        lower.replace(/_/g, ''),                           // data_orcamento -> dataorcamento
        key.replace(/_/g, ''),                             // dataOrcamento -> dataOrcamento
    ];
    for (const v of variants) {
        if (card.dataset[v] !== undefined) return card.dataset[v];
    }
    return '';
}

function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return dateStr; // já está formatada
}

// aplica a cor do select de status conforme o valor
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

// botão "novo orçamento": limpa, seta modo adicionar e abre modal
function ExibirCriarOrcamentoNovo() {
    setModeAdd();
    limparFormulario();
    ExibirCriarOrcamento();
}

// limpa todos os campos e volta para estado inicial de criação
function limparFormulario() {
    const ids = [
        'cliente_nome',
        'cliente_endereço',
        'cliente_telefone',
        'data_orcamento',
        'orcamento_descricao',
        'material_orcamento',
        'acabamento_orcamento',
        'cuba_orcamento',
        'vista_orcamento',
        'saia_orcamento',
        'data_entrega'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // data do orçamento = hoje
    const hoje = new Date();
    const isoHoje = hoje.toISOString().slice(0, 10);
    const dataOrcInput = document.getElementById('data_orcamento');
    if (dataOrcInput) dataOrcInput.value = isoHoje;

    const entradaInput = findInputByLabelText('Entrada');
    const restanteInput = findInputByLabelText('Restante');
    if (entradaInput) entradaInput.value = '';
    if (restanteInput) restanteInput.value = '';

    const totalEl = document.querySelector('.criarOrcamento .botoes .total');
    if (totalEl) totalEl.textContent = 'Valor Total: R$ 0,00';

    // reset status select para "Abrindo"
    const sel = getStatusSelect();
    if (sel) {
        // remove opcional "arquivado" para recomeçar limpo
        const opt = Array.from(sel.options).find(o => o.value === 'arquivado');
        if (opt) sel.remove(opt.index);
        // garante opção "abrindo"
        let idxAbrir = Array.from(sel.options).findIndex(o => o.value === 'abrindo');
        if (idxAbrir === -1) {
            sel.add(new Option('Aberto', 'abrindo'));
            idxAbrir = Array.from(sel.options).findIndex(o => o.value === 'abrindo');
        }
        sel.selectedIndex = idxAbrir >= 0 ? idxAbrir : 0;
        sel.value = 'abrindo';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        lockStatusSelect(false);
    }

    // reseta botão arquivar
    const btnArquivar = document.querySelector('.criarOrcamento .arquivar');
    if (btnArquivar) {
        btnArquivar.textContent = 'Arquivar';
        btnArquivar.dataset.archived = 'false';
        btnArquivar.style.backgroundColor = '';
        btnArquivar.style.color = '';
    }
}

// coloca o modal em modo edição (mostra "Editar")
function setModeEdit(card) {
    currentEditingCard = card;
    const btn = document.querySelector('.criarOrcamento .adicionar');
    if (btn) {
        btn.textContent = 'Editar';
        btn.dataset.mode = 'edit';
    }
}

// coloca o modal em modo criação (mostra "Adicionar")
function setModeAdd() {
    currentEditingCard = null;
    const btn = document.querySelector('.criarOrcamento .adicionar');
    if (btn) {
        btn.textContent = 'Adicionar';
        btn.dataset.mode = 'add';
    }
}

// ao clicar no status de um card, abre o modal já preenchido com esse card
function abrirOrcamentoExistente(card) {
    if (!card) return;

    // tenta usar datasets preenchidos ao criar; se não existir, usa o texto do card
    const fromDataset = (key, fallback = '') => getData(card, key) || fallback;

    const cliente = fromDataset('cliente', card.querySelector('li:nth-child(2) p')?.textContent?.trim() || '');
    const endereco = fromDataset('endereco');
    const telefone = fromDataset('telefone');
    const dataOrcamento = fromDataset('dataOrcamento');
    const material = fromDataset('material', card.querySelector('li:nth-child(3) p')?.textContent?.trim() || '');
    const acabamento = fromDataset('acabamento');
    const cuba = fromDataset('cuba');
    const vista = fromDataset('vista');
    const saia = fromDataset('saia');
    const descricao = fromDataset('descricao', card.querySelector('.descricao-limitada')?.textContent?.trim() || '');
    const dataEntrega = fromDataset('dataEntrega', card.querySelector('li:nth-child(1) p')?.textContent?.trim() || '');
    const entrada = fromDataset('entrada');
    const restante = fromDataset('restante');
    const valor = fromDataset('valor', card.querySelector('li:nth-child(5) p')?.textContent?.trim() || '');

    const statusEl = card.querySelector('.tag-orcamento');
    const statusClass = statusEl
        ? Array.from(statusEl.classList).find(c => ['aberto', 'confirmado', 'arquivado'].includes(c))
        : '';

    // preenche campos do formulário
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    setVal('cliente_nome', cliente);
    setVal('cliente_endereço', endereco);
    setVal('cliente_telefone', telefone);
    setVal('data_orcamento', dataOrcamento);
    setVal('orcamento_descricao', descricao);
    setVal('material_orcamento', material);
    setVal('acabamento_orcamento', acabamento);
    setVal('cuba_orcamento', cuba);
    setVal('vista_orcamento', vista);
    setVal('saia_orcamento', saia);
    setVal('data_entrega', dataEntrega);
    // valores parciais
    const entradaInput = findInputByLabelText('Entrada');
    const restanteInput = findInputByLabelText('Restante');
    if (entradaInput) entradaInput.value = entrada;
    if (restanteInput) restanteInput.value = restante;

    // valor total
    const totalEl = document.querySelector('.criarOrcamento .botoes .total');
    if (totalEl) {
        totalEl.textContent = 'Valor Total: ' + (valor || '');
    }

    // sincroniza select de status
    if (statusClass === 'arquivado') addStatusOption('arquivado', 'Arquivado', true);
    const sel = getStatusSelect();
    if (sel) {
        const map = { aberto: 'abrindo', confirmado: 'confirmar', arquivado: 'arquivado' };
        const val = map[statusClass] || 'abrindo';
        sel.value = val;
        aplicarCor();
    }

    setModeEdit(card);
    ExibirCriarOrcamento();
}

// junta todos os campos do formulário em um único objeto
function coletarDadosFormulario() {
    const s = getStatusSelect();
    const statusClass = s ? Array.from(s.classList).find(c => c && c !== 'status') : '';
    let status = statusClass || (s ? s.value : '');
    if (!status) status = 'abrindo'; // padrão: novo orçamento começa como aberto

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

    const entradaInput = findInputByLabelText('Entrada');
    const restanteInput = findInputByLabelText('Restante');

    return {
        status,
        status_name,
        cliente,
        descricao,
        data,
        material,
        valor,
        entrada: entradaInput ? entradaInput.value : '',
        restante: restanteInput ? restanteInput.value : '',
        endereco: document.getElementById('cliente_endereço').value,
        telefone: document.getElementById('cliente_telefone').value,
        dataOrcamento: document.getElementById('data_orcamento').value,
        acabamento: document.getElementById('acabamento_orcamento').value,
        cuba: document.getElementById('cuba_orcamento').value,
        vista: document.getElementById('vista_orcamento').value,
        saia: document.getElementById('saia_orcamento').value,
    };
}

// desenha/atualiza o card com os dados e guarda tudo no dataset
function preencherCardComDados(card, dados) {
    if (!card) return;
    // 🔑 gera um ID único para cada descrição
    const uniqueId = "descricao_" + Date.now();

    card.dataset.cliente = dados.cliente;
    card.dataset.endereco = dados.endereco;
    card.dataset.telefone = dados.telefone;
    card.dataset.dataOrcamento = dados.dataOrcamento;
    card.dataset.dataorcamento = dados.dataOrcamento; // redundante para tolerar leitura
    card.dataset.descricao = dados.descricao;
    card.dataset.material = dados.material;
    card.dataset.acabamento = dados.acabamento;
    card.dataset.cuba = dados.cuba;
    card.dataset.vista = dados.vista;
    card.dataset.saia = dados.saia;
    card.dataset.dataEntrega = dados.data;
    card.dataset.dataentrega = dados.data; // redundante para tolerar leitura
    card.dataset.entrada = dados.entrada;
    card.dataset.restante = dados.restante;
    card.dataset.valor = dados.valor;

    const dataEntregaFmt = formatDateBR(dados.data);
    const dataOrcFmt = formatDateBR(dados.dataOrcamento);

    card.innerHTML = `
   
            <ul>
                <li>
                    <img src="assets/img/calendar_4864602 1.png" alt="">
                    <p>${dataEntregaFmt}</p>
                </li>
                <li>
                    <img src="assets/img/calendar_4864602 1.png" alt="">
                    <p>Orçamento: ${dataOrcFmt}</p>
                </li>
                <li>
                    <img src="assets/img/person_13937526 1.png" alt="">
                    <p>${dados.cliente}</p>
                </li>
                <li>
                    <img src="assets/img/icons8-pedra-100 1.png" alt="">
                    <p>${dados.material}</p>
                </li>
                <li>
                    <img src="assets/img/file_1052636 1.png" alt="">
                    <div class="descricao-limitada" id="${uniqueId}">
                        ${dados.descricao}
                    </div>
                    <button type="button" class="ver-mais" onclick="toggleDescricao('${uniqueId}', this)">Ver mais</button>
                </li>
                <li>
                    <img src="assets/img/icons8-cifrão-100 1.png" alt="">
                    <p>${dados.valor}</p>
                </li>
            </ul>
            <p class="tag-orcamento ${dados.status}">${dados.status_name}</p>
        
    `;
}

// cria um novo card de orçamento a partir do formulário
function CriarOrcamento() {
    const orcamento_list = document.getElementById('orcamento_list');
    const dados = coletarDadosFormulario();

    const card_orcamento = document.createElement('div');
    card_orcamento.classList.add('card-orcamento');
    preencherCardComDados(card_orcamento, dados);

    if (orcamento_list.appendChild(card_orcamento)) {
        const div_orcamento = document.querySelector('.criarOrcamento');
        div_orcamento.style.display = 'none';
    }

    TagOrcamento();
    setModeAdd();
}

// define o que o botão "Adicionar/Editar" faz
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

        if (currentEditingCard) {
            AtualizarOrcamento();
        } else {
            CriarOrcamento();
        }
    });
}

// controla os filtros (Geral, Abertos, Confirmados, Arquivados)
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

// delegação: ao clicar no status de um card, abre modal preenchida
document.addEventListener('click', function (e) {
    const statusTag = e.target.closest('.tag-orcamento');
    if (!statusTag) return;

    const card = statusTag.closest('.card-orcamento');
    abrirOrcamentoExistente(card);
});

// soma entrada + restante e atualiza o texto "Valor Total"
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

// salva as mudanças no card que está sendo editado
function AtualizarOrcamento() {
    if (!currentEditingCard) return;
    const dados = coletarDadosFormulario();
    preencherCardComDados(currentEditingCard, dados);

    // fecha modal e volta modo adicionar
    const div_orcamento = document.querySelector('.criarOrcamento');
    if (div_orcamento) div_orcamento.style.display = 'none';
    setModeAdd();
    TagOrcamento();
}

// adiciona opção ao select de status (evita duplicar)
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

// bloqueia/desbloqueia o select de status (usado ao arquivar)
function lockStatusSelect(lock = true) {
    const sel = getStatusSelect();
    if (!sel) return;
    sel.disabled = !!lock;
    if (lock) {
        sel.classList.add('arquivar');
    } else {
        sel.classList.remove('arquivar');
    }
}

// botão Arquivar/Desarquivar dentro do modal
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