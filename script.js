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

async function fetchFlights(origin, destination, date, returnDate) {
  const params = new URLSearchParams({ origin, destination, date, returnDate, type: 'flights' });
  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar voos');
  }
  return response.json();
}

async function fetchMiles(program, route, date) {
  const params = new URLSearchParams({ type: 'miles', program, route, date });
  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar milhas');
  }
  return response.json();
}

async function renderFlights(origin, destination, date, returnDate) {
  const resultsContainer = document.getElementById('flight-results');
  const status = document.getElementById('flight-status');
  status.textContent = `Buscando voos reais para ${formatRoute(origin, destination)}...`;
  resultsContainer.innerHTML = '<p class="status-text">Carregando opções...</p>';

  try {
    const data = await fetchFlights(origin, destination, date, returnDate);
    resultsContainer.innerHTML = data.flights.map((flight) => `
      <article class="result-card">
        <div class="airline-pill azul">${flight.airline}</div>
        <h3>${formatRoute(origin, destination)}</h3>
        <p>${flight.flightNumber} • Ida: ${flight.departure || 'não informado'} • Volta: ${returnDate || 'não informada'}</p>
        <div class="action-row">
          <span class="link-btn">${flight.price}</span>
          <a class="link-btn" href="${flight.searchUrl}" target="_blank" rel="noopener noreferrer">Abrir busca</a>
        </div>
      </article>
    `).join('');
    status.textContent = `Resultados para ${formatRoute(origin, destination)} com ida ${date || 'não informada'} e volta ${returnDate || 'não informada'}.`;
  } catch (error) {
    resultsContainer.innerHTML = '<p class="status-text">Não foi possível carregar os resultados neste momento.</p>';
    status.textContent = 'Não foi possível consultar os voos no momento.';
  }
}

async function renderMiles(program, route, date) {
  const resultsContainer = document.getElementById('miles-results');
  const status = document.getElementById('miles-status');
  status.textContent = `Buscando programas de milhas para ${route || 'a rota selecionada'}...`;
  resultsContainer.innerHTML = '<p class="status-text">Carregando opções...</p>';

  try {
    const data = await fetchMiles(program, route, date);
    resultsContainer.innerHTML = data.programs.map((item) => `
      <article class="result-card">
        <div class="airline-pill fidelidade">${item.name}</div>
        <h3>${route || 'Rota em análise'}</h3>
        <p>Disponibilidade de pontos e regras de resgate.</p>
        <div class="action-row">
          <a class="link-btn" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir busca</a>
        </div>
      </article>
    `).join('');
    status.textContent = `Consulta enviada para ${program} com a rota ${route || 'selecionada'}.`;
  } catch (error) {
    resultsContainer.innerHTML = '<p class="status-text">Não foi possível carregar as opções de milhas no momento.</p>';
    status.textContent = 'Não foi possível consultar as milhas neste momento.';
  }
}

document.getElementById('flight-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('date').value;
  const returnDate = document.getElementById('returnDate').value;
  renderFlights(origin, destination, date, returnDate);
});

document.getElementById('miles-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const program = document.getElementById('program').value;
  const route = document.getElementById('route').value;
  const date = document.getElementById('milesDate').value;
  renderMiles(program, route, date);
});
