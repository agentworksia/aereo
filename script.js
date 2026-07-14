const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

const AIRPORTS = [
  { code: 'GRU', label: 'São Paulo (GRU)' },
  { code: 'GIG', label: 'Rio de Janeiro (GIG)' },
  { code: 'CNF', label: 'Belo Horizonte (CNF)' },
  { code: 'SSA', label: 'Salvador (SSA)' },
  { code: 'POA', label: 'Porto Alegre (POA)' },
  { code: 'BSB', label: 'Brasília (BSB)' },
  { code: 'REC', label: 'Recife (REC)' },
  { code: 'FOR', label: 'Fortaleza (FOR)' },
  { code: 'CWB', label: 'Curitiba (CWB)' },
  { code: 'FLN', label: 'Florianópolis (FLN)' }
];

const milesCatalog = {
  azul: [
    { label: 'GRU → SSA', value: 'GRU-SSA' },
    { label: 'GRU → CNF', value: 'GRU-CNF' },
    { label: 'GIG → FOR', value: 'GIG-FOR' }
  ],
  latam: [
    { label: 'GRU → GIG', value: 'GRU-GIG' },
    { label: 'GRU → BSB', value: 'GRU-BSB' },
    { label: 'GRU → REC', value: 'GRU-REC' }
  ],
  smiles: [
    { label: 'GRU → POA', value: 'GRU-POA' },
    { label: 'GIG → SSA', value: 'GIG-SSA' },
    { label: 'GRU → CWB', value: 'GRU-CWB' }
  ]
};

function populateAirports(select) {
  select.innerHTML = AIRPORTS.map((airport) => `<option value="${airport.code}">${airport.label}</option>`).join('');
}

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

const airlineSelect = document.getElementById('airline');
const originSelect = document.getElementById('origin');
const destinationSelect = document.getElementById('destination');
const programSelect = document.getElementById('program');

populateAirports(originSelect);
populateAirports(destinationSelect);

function renderFlightsResult(results) {
  const container = document.getElementById('flight-results');
  container.innerHTML = results.map((result) => `
    <article class="result-card">
      <div class="airline-pill ${result.companyClass}">${result.company}</div>
      <h3>${result.route}</h3>
      <p>${result.summary}</p>
      <div class="action-row">
        <span class="link-btn">${result.price}</span>
        <a class="link-btn" href="${result.siteUrl}" target="_blank" rel="noopener noreferrer">Abrir site oficial</a>
      </div>
    </article>
  `).join('');
}

function renderMilesResult(results) {
  const container = document.getElementById('miles-results');
  container.innerHTML = results.map((result) => `
    <article class="result-card">
      <div class="airline-pill ${result.companyClass}">${result.program}</div>
      <h3>${result.route}</h3>
      <p>${result.summary}</p>
      <div class="action-row">
        <span class="link-btn">${result.points}</span>
        <a class="link-btn" href="${result.siteUrl}" target="_blank" rel="noopener noreferrer">Abrir programa</a>
      </div>
    </article>
  `).join('');
}

async function searchFlights() {
  const params = new URLSearchParams({
    type: 'flights',
    airline: airlineSelect.value,
    origin: originSelect.value,
    destination: destinationSelect.value,
    date: document.getElementById('date').value,
    returnDate: document.getElementById('returnDate').value
  });
  const response = await fetch(`/api/search?${params.toString()}`);
  const data = await response.json();
  renderFlightsResult(data.results || []);
  document.getElementById('flight-status').textContent = `Exibindo ${data.results.length} opções para ${data.route}`;
}

async function searchMiles() {
  const params = new URLSearchParams({
    type: 'miles',
    program: programSelect.value,
    date: document.getElementById('milesDate').value,
    classType: document.getElementById('milesClass').value
  });
  const response = await fetch(`/api/search?${params.toString()}`);
  const data = await response.json();
  renderMilesResult(data.results || []);
  document.getElementById('miles-status').textContent = `Exibindo ${data.results.length} opções para o programa ${data.program}`;
}

document.getElementById('flight-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await searchFlights();
});

document.getElementById('miles-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await searchMiles();
});
