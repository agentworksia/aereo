module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { type, airline, program, origin, destination, date, returnDate, route, classType } = req.query;

  if (type === 'miles') {
    const programName = program === 'latam' ? 'LATAM Pass' : program === 'smiles' ? 'Smiles' : 'Azul Fidelidade';
    const routeLabel = route || 'GRU → SSA';
    const siteUrl = program === 'latam'
      ? 'https://beta.latampass.latam.com/br/pt/'
      : program === 'smiles'
        ? 'https://www.smiles.com.br/home'
        : 'https://www.voeazul.com.br/br/pt/programa-fidelidade';

    const results = [
      {
        program: programName,
        route: routeLabel,
        summary: `${classType || 'Economy'} • disponibilidade de pontos e reembolso parcial em trechos selecionados.`,
        points: '12.500 a 24.000 pontos',
        companyClass: program === 'latam' ? 'latam' : program === 'smiles' ? 'smiles' : 'fidelidade',
        siteUrl
      },
      {
        program: programName,
        route: routeLabel,
        summary: `${classType || 'Premium'} • saídas pontuais com taxas menores e opção de upgrade.`,
        points: '16.000 a 28.000 pontos',
        companyClass: program === 'latam' ? 'latam' : program === 'smiles' ? 'smiles' : 'fidelidade',
        siteUrl
      }
    ];

    res.status(200).json({ program: programName, results });
    return;
  }

  const companyName = airline === 'latam' ? 'LATAM' : airline === 'gol' ? 'GOL' : 'Azul';
  const routeLabel = `${origin || 'GRU'} → ${destination || 'SSA'}`;
  const siteUrl = airline === 'latam'
    ? 'https://www.latam.com/pt_br/'
    : airline === 'gol'
      ? 'https://www.voegol.com.br/pt-br'
      : 'https://www.voeazul.com.br/br/pt/';

  const results = [
    {
      company: companyName,
      route: routeLabel,
      summary: `Ida ${date || 'selecionada'} • volta ${returnDate || 'não informada'} • tarifa flexível e assentos disponíveis.`,
      price: 'A partir de R$ 189',
      companyClass: airline === 'latam' ? 'latam' : airline === 'gol' ? 'gol' : 'azul',
      siteUrl
    },
    {
      company: companyName,
      route: routeLabel,
      summary: `Trecho com melhor custo-benefício para ${routeLabel} • embarque da manhã.`,
      price: 'A partir de R$ 245',
      companyClass: airline === 'latam' ? 'latam' : airline === 'gol' ? 'gol' : 'azul',
      siteUrl
    },
    {
      company: companyName,
      route: routeLabel,
      summary: `Voo com maior flexibilidade de reembolso e combo de bagagem.`,
      price: 'A partir de R$ 310',
      companyClass: airline === 'latam' ? 'latam' : airline === 'gol' ? 'gol' : 'azul',
      siteUrl
    }
  ];

  res.status(200).json({ route: routeLabel, results });
};
