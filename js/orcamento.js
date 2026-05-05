/* =========================================================
   ERICtrevisan — Orçamento Builder (calculadora)
   Sem backend: estado em memória, deeplink pro WhatsApp.
   Mantém a navegação intacta no mobile.
   ========================================================= */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5542998617310'; // Eric — pode trocar por outro cliente
  const STORAGE_KEY = 'erictrevisan-orcamento-v1';

  // ---------- Estado ----------
  /** @type {Array<{id:string,name:string,price:number,group:string}>} */
  let items = [];

  // Tenta restaurar do localStorage (se o usuário voltar depois)
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) items = JSON.parse(saved) || [];
  } catch (_) { /* ignore */ }

  // ---------- Helpers ----------
  function formatBRL(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }

  function formatDateBR(isoDate) {
    // isoDate: "YYYY-MM-DD"
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  }

  function formatDateBRLong(isoDate) {
    // "DD de MÊS de YYYY"
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${parseInt(d, 10)} de ${meses[parseInt(m, 10) - 1]} de ${y}`;
  }

  function getSelectedDate() {
    const $date = document.querySelector('[data-orcamento-date]');
    return $date && $date.value ? $date.value : '';
  }

  function getTotal() {
    return items.reduce((acc, item) => acc + item.price, 0);
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
  }

  function isInList(id) {
    return items.some((i) => i.id === id);
  }

  // ---------- Lógica de adição ----------
  // Pacotes de fotografia são mutualmente exclusivos (radio behavior)
  function toggleItem(id, name, price, group) {
    if (isInList(id)) {
      // Remove
      items = items.filter((i) => i.id !== id);
    } else {
      // Adiciona — se for pacote de foto, remove os outros antes
      if (group === 'foto') {
        items = items.filter((i) => i.group !== 'foto');
      }
      items.push({ id, name, price, group });
    }
    persist();
    render();
  }

  function clearAll() {
    items = [];
    persist();
    render();
  }

  // ---------- Render ----------
  const $bar = document.querySelector('[data-orcamento-bar]');
  const $count = document.querySelector('[data-orcamento-count]');
  const $totalBar = document.querySelector('[data-orcamento-total]');
  const $modal = document.querySelector('[data-orcamento-modal]');
  const $list = document.querySelector('[data-orcamento-list]');
  const $totalModal = document.querySelector('[data-orcamento-modal-total]');
  const $hint = document.querySelector('[data-orcamento-hint]');

  function render() {
    const count = items.length;
    const total = getTotal();

    // Atualiza botões "Adicionar" -> "Adicionado"
    document.querySelectorAll('[data-add-item]').forEach((btn) => {
      const id = btn.getAttribute('data-id');
      const isActive = isInList(id);
      btn.classList.toggle('is-active', isActive);
      const label = btn.querySelector('.add-to-orcamento__label');
      if (label) {
        label.textContent = isActive ? 'Adicionado' : (btn.classList.contains('add-to-orcamento--ghost') ? 'Adicionar' : 'Adicionar ao orçamento');
      }
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Atualiza barra flutuante
    if ($bar) {
      const visible = count > 0;
      $bar.classList.toggle('is-visible', visible);
      $bar.setAttribute('aria-hidden', String(!visible));
      document.body.classList.toggle('has-orcamento-bar', visible);
      if ($count) $count.textContent = count === 1 ? '1 item' : `${count} itens`;
      if ($totalBar) $totalBar.textContent = formatBRL(total);
    }

    // Atualiza modal (se aberto)
    if ($list) {
      if (count === 0) {
        $list.innerHTML = '<li class="orcamento-list--empty">Nenhum item selecionado ainda.</li>';
      } else {
        $list.innerHTML = items.map((item) => `
          <li class="orcamento-list__item" data-item-id="${item.id}">
            <span class="orcamento-list__name">${item.name}</span>
            <span class="orcamento-list__price">${formatBRL(item.price)}</span>
            <button class="orcamento-list__remove" type="button" data-remove="${item.id}" aria-label="Remover ${item.name}">×</button>
          </li>
        `).join('');
      }
    }
    if ($totalModal) $totalModal.textContent = formatBRL(total);

    // Hint sobre adicionais sem filme
    if ($hint) {
      const hasAdicional = items.some((i) => i.group === 'adicional');
      const hasFilme = items.some((i) => i.group === 'filme');
      const showHint = hasAdicional && !hasFilme;
      $hint.hidden = !showHint;
    }
  }

  // ---------- Modal (abre/fecha) ----------
  function openModal() {
    if (!$modal) return;
    $modal.classList.add('is-open');
    $modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!$modal) return;
    $modal.classList.remove('is-open');
    $modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---------- WhatsApp ----------
  function sendToWhatsApp() {
    if (items.length === 0) return;

    const lines = [
      'Olá, Eric! Tenho interesse no orçamento abaixo:',
      '',
    ];

    // Agrupa por categoria pra ficar elegante
    const fotoItems = items.filter((i) => i.group === 'foto');
    const filmeItems = items.filter((i) => i.group === 'filme');
    const adicionalItems = items.filter((i) => i.group === 'adicional');

    if (fotoItems.length > 0) {
      lines.push('📸 *Fotografia*');
      fotoItems.forEach((i) => lines.push(`• ${i.name} — ${formatBRL(i.price)}`));
      lines.push('');
    }
    if (filmeItems.length > 0) {
      lines.push('🎬 *Filme*');
      filmeItems.forEach((i) => lines.push(`• ${i.name} — ${formatBRL(i.price)}`));
      lines.push('');
    }
    if (adicionalItems.length > 0) {
      lines.push('✨ *Serviços Adicionais*');
      adicionalItems.forEach((i) => lines.push(`• ${i.name} — ${formatBRL(i.price)}`));
      lines.push('');
    }

    lines.push(`*Total estimado:* ${formatBRL(getTotal())}`);
    lines.push('');

    // Data desejada (opcional)
    const selectedDate = getSelectedDate();
    if (selectedDate) {
      lines.push(`📅 *Data desejada:* ${formatDateBRLong(selectedDate)}`);
      lines.push('Por favor, confirme se essa data está disponível.');
    } else {
      lines.push('Ainda não defini uma data específica. Podemos conversar melhor sobre disponibilidade e detalhes do evento.');
    }

    lines.push('');
    lines.push('Obrigada!');

    const message = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank', 'noopener');
  }

  // ---------- Data desejada (input) ----------
  function setupDateField() {
    const $date = document.querySelector('[data-orcamento-date]');
    const $clear = document.querySelector('[data-orcamento-date-clear]');
    const $wrapper = document.querySelector('.orcamento-date');
    if (!$date) return;

    // Min = hoje (não permite data passada)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    $date.min = `${yyyy}-${mm}-${dd}`;

    function updateState() {
      const hasValue = !!$date.value;
      if ($wrapper) $wrapper.classList.toggle('has-date', hasValue);
      if ($clear) $clear.hidden = !hasValue;
    }

    $date.addEventListener('change', updateState);
    $date.addEventListener('input', updateState);

    if ($clear) {
      $clear.addEventListener('click', () => {
        $date.value = '';
        updateState();
      });
    }

    updateState();
  }

  // ---------- Event Listeners ----------
  // Click nos botões "Adicionar"
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-item]');
    if (addBtn) {
      const id = addBtn.getAttribute('data-id');
      const name = addBtn.getAttribute('data-name');
      const price = parseFloat(addBtn.getAttribute('data-price')) || 0;
      const group = addBtn.getAttribute('data-group') || 'adicional';
      toggleItem(id, name, price, group);
      return;
    }

    // Remove item da lista no modal
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      const id = removeBtn.getAttribute('data-remove');
      const item = items.find((i) => i.id === id);
      if (item) toggleItem(item.id, item.name, item.price, item.group);
      return;
    }

    // Abrir modal
    if (e.target.closest('[data-orcamento-open]')) {
      openModal();
      return;
    }

    // Fechar modal (X ou backdrop)
    if (e.target.closest('[data-orcamento-close]')) {
      closeModal();
      return;
    }

    // Enviar via WhatsApp
    if (e.target.closest('[data-orcamento-send]')) {
      sendToWhatsApp();
      return;
    }

    // Limpar seleção
    if (e.target.closest('[data-orcamento-clear]')) {
      clearAll();
      return;
    }
  });

  // ESC fecha o modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modal && $modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // ---------- Init ----------
  setupDateField();
  render();
})();
