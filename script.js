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

function formatRoute(origin, destination) {
  const normalizedOrigin = origin.trim() || 'origem';
  const normalizedDestination = destination.trim() || 'destino';
  return `${normalizedOrigin} → ${normalizedDestination}`;
}

function buildPriceUrl(origin, destination, date) {
  const query = [
    'Flights',
    'from',
    origin.trim() || 'origem',
    'to',
    destination.trim() || 'destino',
    'on',
    date || 'today'
  ].join(' ');
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
}

function buildCompanySearchUrl(company, origin, destination, date) {
  const query = `${company} ${origin.trim() || 'origem'} ${destination.trim() || 'destino'} ${date || ''}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function renderFlights(origin, destination, date) {
  const resultsContainer = document.getElementById('flight-results');
  const status = document.getElementById('flight-status');
  status.textContent = `Consultando voos reais para ${formatRoute(origin, destination)}.`;

  const airlines = [
    { name: 'Azul', className: 'azul', key: 'azul' },
    { name: 'LATAM', className: 'latam', key: 'latam' },
    { name: 'GOL', className: 'gol', key: 'gol' }
  ];

  resultsContainer.innerHTML = airlines.map((airline) => {
    const priceUrl = buildPriceUrl(origin, destination, date);
    const companyUrl = buildCompanySearchUrl(airline.name, origin, destination, date);
    return `
      <article class="result-card">
        <div class="airline-pill ${airline.className}">${airline.name}</div>
        <h3>${formatRoute(origin, destination)}</h3>
        <p>Busca real para preços e disponibilidade na companhia.</p>
        <div class="action-row">
          <a class="link-btn" href="${priceUrl}" target="_blank" rel="noopener noreferrer">Ver preços</a>
          <a class="link-btn" href="${companyUrl}" target="_blank" rel="noopener noreferrer">Abrir busca</a>
        </div>
      </article>
    `;
  }).join('');
}

function renderMiles(program, route) {
  const resultsContainer = document.getElementById('miles-results');
  const status = document.getElementById('miles-status');
  status.textContent = `Consultando o programa ${program} para ${route || 'a rota selecionada'}.`;

  const programs = [
    { name: 'Azul Fidelidade', className: 'fidelidade', search: 'site:azul.com.br fidelidade' },
    { name: 'LATAM Pass', className: 'latam', search: 'site:latam.com.br pass' },
    { name: 'Smiles', className: 'smiles', search: 'site:smiles.com.br' }
  ];

  resultsContainer.innerHTML = programs.map((item) => {
    const query = `${item.search} ${route || 'rota'}`.trim();
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return `
      <article class="result-card">
        <div class="airline-pill ${item.className}">${item.name}</div>
        <h3>${route || 'Rota em análise'}</h3>
        <p>Consulte a disponibilidade de milhas e regras de resgate.</p>
        <div class="action-row">
          <a class="link-btn" href="${url}" target="_blank" rel="noopener noreferrer">Abrir busca</a>
        </div>
      </article>
    `;
  }).join('');
}

document.getElementById('flight-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('date').value;
  renderFlights(origin, destination, date);
});

document.getElementById('miles-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const program = document.getElementById('program').value;
  const route = document.getElementById('route').value;
  renderMiles(program, route);
});
