export interface CategoryDetection {
  category: string
  confidence: number
  matchedKeyword?: string
}

const CATEGORY_KEYWORDS = {
  // Alimentação - PRIORIDADE ALTA
  'Alimentação': [
    'mercado', 'supermercado', 'padaria', 'restaurante', 'almoço', 'almoco',
    'janta', 'lanche', 'hamburguer', 'açai', 'acai', 'sushi', 'pizza',
    'café', 'cafe', 'ifood', 'rappi', 'hortifruti', 'açougue', 'acougue',
    'comida', 'feira', 'carne', 'fruta', 'verdura', 'legume', 'alimentação',
    'alimentacao', 'atacadão', 'atacado', 'armazém', 'armazem', 'mercearia',
    'lanchonete', 'açougueiro', 'acougueiro'
  ],
  
  // Transporte - PRIORIDADE ALTA
  'Transporte': [
    'uber', '99', 'taxi', 'táxi', 'ônibus', 'onibus', 'metro', 'metrô',
    'gasolina', 'combustível', 'combustivel', 'pedágio', 'pedagio', 'estacionamento',
    'posto', 'viagem', 'passagem', 'bicicleta', 'moto', 'carro', 'transporte',
    'corrida', 'aplicativo', 'app transporte', 'uber eats', '99 taxi'
  ],
  
  // Saúde - PRIORIDADE ALTA
  'Saúde': [
    'farmácia', 'farmacia', 'remédio', 'remedio', 'consulta', 'médico', 'medico',
    'hospital', 'insulina', 'glicose', 'sensor', 'libre', 'exame', 'medicamento',
    'saúde', 'saude', 'dental', 'dentista', 'psicólogo', 'psicologo', 'psiquiatra',
    'terapia', 'vacina', 'laboratório', 'laboratorio', 'clínica', 'clinica',
    'oftalmologista', 'ortopedista', 'nutricionista', 'fisioterapeuta', 'farmacêutico',
    'farmaceutico'
  ],
  
  // Assinaturas - PRIORIDADE ALTA
  'Assinaturas': [
    'netflix', 'spotify', 'prime', 'disney', 'disney+', 'hbo', 'hbo max',
    'globoplay', 'assinatura', 'streaming', 'mensalidade', 'apple music',
    'youtube premium', 'youtube music', 'deezer', 'amazon prime', 'crunchyroll',
    'canva', 'adobe', 'microsoft', 'office 365', 'icloud', 'google one',
    'mensalidade'
  ],
  
  // Moradia - PRIORIDADE ALTA
  'Moradia': [
    'aluguel', 'internet', 'luz', 'água', 'agua', 'energia', 'gás', 'gas',
    'condomínio', 'condominio', 'saneamento', 'telefone', 'fixo', 'residencial',
    'casa', 'apartamento', 'imóvel', 'imovel', 'manutenção', 'manutencao'
  ],
  
  // Lazer - PRIORIDADE ALTA
  'Lazer': [
    'bar', 'cinema', 'festa', 'praia', 'show', 'passeio', 'balada', 'jogo',
    'teatro', 'concerto', 'parque', 'clube', 'feriado', 'viagem', 'turismo',
    'hotel', 'pousada', 'resort', 'diversão', 'diversao', 'entretenimento', 'evento'
  ],
  
  // Compras - PRIORIDADE ALTA
  'Compras': [
    'iphone', 'celular', 'roupa', 'tenis', 'tênis', 'shopping', 'amazon',
    'mercado livre', 'eletrônico', 'eletronico', 'sapato', 'calçado', 'calcado',
    'computador', 'notebook', 'tv', 'loja', 'compra', 'presente', 'móvel', 'moveis',
    'decoração', 'decoracao', 'cama', 'mesa', 'sofá', 'sofa'
  ],
  
  // Educação - PRIORIDADE ALTA
  'Educação': [
    'faculdade', 'curso', 'livro', 'material', 'mensalidade faculdade', 'escola',
    'colégio', 'colegio', 'universidade', 'pós', 'pos', 'mestrado', 'doutorado',
    'graduação', 'graduacao', 'pós-graduação', 'pos-graduacao', 'especialização',
    'especializacao', 'livraria', 'didático', 'didatico', 'aula'
  ],
  
  // Trabalho/Receita - PRIORIDADE ALTA
  'Trabalho': [
    'cliente', 'freela', 'job', 'filmagem', 'produção', 'producao', 'drone',
    'serviço', 'servico', 'projeto', 'consultoria', 'design', 'desenvolvimento',
    'escritório', 'escritorio', 'equipamento', 'ferramenta', 'material de trabalho'
  ],
  
  // Beleza - PRIORIDADE ALTA
  'Beleza': [
    'corte', 'cabelo', 'barba', 'salão', 'salao', 'estética', 'estetica',
    'manicure', 'pedicure', 'maquiagem', 'perfume', 'creme', 'cosmético',
    'cosmetico', 'spa', 'massagem', 'cabelereiro'
  ]
}

export function detectCategory(message: string): CategoryDetection {
  const lowerMessage = message.toLowerCase().trim()
  
  console.log('[AI CATEGORY DETECTION]', message)

  // Check each category in priority order
  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        console.log('[AI CATEGORY MATCH]', { category: categoryName, matchedKeyword: keyword })
        return {
          category: categoryName,
          confidence: 0.9,
          matchedKeyword: keyword
        }
      }
    }
  }

  console.log('[AI CATEGORY FALLBACK]', 'Geral')
  return {
    category: 'Geral',
    confidence: 0.3,
    matchedKeyword: undefined
  }
}

export function getCategoryConfidence(text: string, description: string): CategoryDetection[] {
  const combinedText = `${text} ${description}`.toLowerCase()
  const matches: CategoryDetection[] = []

  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchedKeywords = keywords.filter(keyword => 
      combinedText.includes(keyword.toLowerCase())
    )
    
    if (matchedKeywords.length > 0) {
      matches.push({
        category: categoryName,
        confidence: matchedKeywords.length / keywords.length,
        matchedKeyword: matchedKeywords[0]
      })
    }
  }

  // Sort by confidence
  matches.sort((a, b) => b.confidence - a.confidence)

  return matches
}
