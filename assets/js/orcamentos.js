document.addEventListener('DOMContentLoaded', function() {
    TagOrcamento();
    TotalizarValores();
});

const select = document.getElementById("statusSelect");

function aplicarCor() {
  select.className = "status";                    // reset
  select.classList.add(select.value);             // adiciona cor certa
}

aplicarCor();                                     // cor inicial
select.addEventListener("change", aplicarCor); 

function ExibirCriarOrcamento () {
    
}



function CriarOrcamento () {

}

function TagOrcamento () {
    const items = document.querySelectorAll('.container-orcamento nav ul li');
    const cards = document.querySelectorAll('.container-orcamento .orcamento-display .card-orcamento')
    
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tagSelecionada = item.id.replace('nav-', '');

            cards.forEach(card => {
                const tagCard = card.querySelector('.tag-orcamento');

                if(tagSelecionada == 'geral') {
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
        const s = String(str).replace(/R\$\s?/g, '').replace(/\s/g,'').trim();
        const cleaned = s.replace(/\./g,'').replace(/,/g, '.').replace(/[^\d.\-]/g,'');
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

function ArquivarOrcamento () {

}

function ConfirmarOrcamento () {

}
