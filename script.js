const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach((item) => {
      item.classList.toggle('active', item.dataset.tab === target);
      item.setAttribute('aria-selected', item.dataset.tab === target ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== target;
      panel.classList.toggle('active', panel.id === target);
    });
  });
}

for (const button of document.querySelectorAll('[data-tab-target]')) {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-tab-target');
    const matchingTab = document.querySelector(`.tab[data-tab="${target}"]`);
    if (matchingTab) {
      matchingTab.click();
    }
  });
}

document.querySelectorAll('.search-card').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Buscando...';
    setTimeout(() => {
      button.textContent = originalText;
      alert('Busca simulada concluída. A interface está pronta para integrar com dados reais.');
    }, 700);
  });
});
