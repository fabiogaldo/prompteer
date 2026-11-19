/**
 * Brazilian Portuguese (pt-BR) UI string dictionary for Prompteer.
 * TypeScript puro — Zero textos hardcoded dentro de componentes JSX.
 */

import { I18nDictionary } from './en';

export const pt: I18nDictionary = {
  app: {
    name: 'Prompteer',
    badge: 'v1.0 MVP',
    tagline: 'Gerador de Prompts Sem Complicação',
    description:
      'Transforme suas intenções cotidianas em prompts estruturados e verificados para as melhores IAs.',
    github: 'GitHub',
    footerDisclaimer:
      '100% Execução no Navegador (Client-Side) & Sem Cadastro. Nenhum dado é salvo em servidor ou banco de dados.',
  },
  header: {
    languageLabel: 'Idioma',
    howItWorks: 'Como funciona?',
  },
  banner: {
    title: 'Como o Prompteer funciona:',
    text: 'O Prompteer NÃO é um chat de IA. Ele é um assistente de engenharia de prompts que constrói instruções estruturadas e verificadas para você enviar a modelos externos de IA (ChatGPT, Claude, Gemini, Perplexity).',
    learnMore: 'Entenda como funciona',
  },
  onboardingModal: {
    title: 'Como o Prompteer Funciona',
    subtitle: 'Geração de prompts descomplicada e orientada ao seu objetivo real',
    step1Title: '1. Escolha seu Objetivo',
    step1Desc:
      'Selecione contextos práticos do dia a dia: comunicados de trabalho, anúncios de vendas ou visuais de campanhas.',
    step2Title: '2. Insira Detalhes e Nível de Rigor',
    step2Desc:
      'Preencha poucos dados e defina o nível de verificação factual para educar a IA e prevenir alucinações.',
    step3Title: '3. Abra na Melhor IA com 1 Clique',
    step3Desc:
      'O Prompteer formata o prompt otimizado e o copia ou abre diretamente no ChatGPT, Claude, Gemini ou Perplexity.',
    coreNoticeTitle: 'Conceito Fundamental:',
    coreNoticeBody:
      'Você não está conversando com um robô nesta tela. O Prompteer é a ponte que molda o prompt perfeito para você obter a resposta ideal nos principais chats de IA do mercado.',
    dismissButton: 'Entendi, vamos começar!',
    closeAriaLabel: 'Fechar',
  },
  wizard: {
    stepIndicator: 'Etapa {current} de {total}',
    steps: {
      category: 'Categoria',
      objective: 'Objetivo',
      details: 'Detalhes',
      rigor: 'Tom & Rigor',
      result: 'Resultado',
    },
    navigation: {
      back: 'Voltar',
      next: 'Avançar',
      generate: 'Gerar Prompt',
      startOver: 'Recomeçar',
      reset: 'Redefinir',
      edit: 'Editar Dados',
    },
  },
  stepCategory: {
    title: 'O que você quer realizar hoje?',
    subtitle:
      'Escolha um contexto inicial para calibrar a estrutura e a inteligência do seu prompt.',
    selectButton: 'Selecionar Categoria',
    exampleUseCasesLabel: 'Ideal para:',
  },
  stepObjective: {
    title: 'Escolha seu objetivo específico',
    subtitle:
      'Selecione o formato de entrega desejado. Veja o exemplo real de pré-visualização abaixo de cada opção.',
    previewLabel: 'Exemplo do que será gerado:',
    recommendedAgentLabel: 'Otimizado para:',
  },
  stepDetails: {
    title: 'Forneça detalhes rápidos do contexto',
    subtitle:
      'Preencha 2 a 3 informações essenciais. Campos opcionais deixados em branco serão preenchidos automaticamente com marcadores [ENTRE COLCHETES].',
    requiredTag: 'Obrigatório',
    optionalTag: 'Opcional (gera marcador editável)',
    tipNotice:
      'Se não tiver todas as informações agora, deixe os campos opcionais vazios: o prompt final incluirá marcadores práticos como [INSERIR DATA] para você preencher depois.',
  },
  stepRigor: {
    title: 'Defina o Tom e o Rigor de Checagem',
    subtitle:
      'Configure como a IA deve se comunicar e o nível de exigência na verificação de dados antes de gerar o prompt.',
    toneSectionTitle: 'Tom de Voz',
    toneSectionSubtitle:
      'Escolha como o seu texto deve soar (pré-selecionado de acordo com o objetivo).',
    tones: {
      formal: {
        label: 'Formal & Corporativo',
        description:
          'Comunicação polida e institucional, ideal para lideranças e comunicados oficiais da empresa.',
      },
      direct: {
        label: 'Direto & Claro',
        description:
          'Texto conciso e de alta eficiência, sem rodeios ou preâmbulos vazios.',
      },
      friendly: {
        label: 'Acolhedor & Amigável',
        description:
          'Tom próximo, caloroso e empático, perfeito para mensagens de equipe e eventos sociais.',
      },
      persuasive: {
        label: 'Persuasivo & Atraente',
        description:
          'Redação focada em conversão, que evidencia o valor prático e incentiva uma ação imediata.',
      },
    },
    rigorSectionTitle: 'Factualidade e Rigor de Verificação',
    rigorSectionSubtitle:
      'Controle se a IA tem liberdade para criar ou se deve confrontar inconsistências e premissas.',
    rigorLevels: {
      creative: {
        label: 'Criativo / Aberto',
        badge: 'Alta Liberdade',
        description:
          'A IA pode criar livremente, sugerir ideias originais e enriquecer a mensagem com detalhes imaginativos.',
      },
      balanced: {
        label: 'Equilibrado (Padrão)',
        badge: 'Recomendado',
        description:
          'Mantém fidelidade estrita aos fatos fornecidos sem inventar dados, preços ou datas não informadas.',
      },
      strict: {
        label: 'Checagem Estrita',
        badge: 'Alto Rigor',
        description:
          'Instrui a IA a checar premissas, alertar sobre conflitos de datas/dias da semana e destacar dúvidas em vez de alucinar.',
      },
    },
    strictNotice: {
      title: 'Aviso Educativo sobre Alucinações de IA',
      body: 'Modelos de linguagem podem alucinar erros convincentes ou amplificar dados errados fornecidos pelo próprio usuário (como datas que não batem com dias da semana). No modo Estrito, o prompt força a IA a cruzar cronologias, apontar incoerências e alertar incertezas em vez de inventar respostas.',
    },
  },
  stepResult: {
    title: 'Seu Prompt está Pronto!',
    subtitle:
      'Revise o prompt estruturado abaixo e envie-o com 1 clique para o modelo de IA recomendado.',
    promptBoxTitle: 'Prompt Estruturado',
    charCount: '{count} caracteres',
    copyPrompt: 'Copiar Prompt',
    copiedPrompt: 'Copiado!',
    recommendedAgentCardTitle: 'Modelo de IA Recomendado',
    whyAgent: 'Por que esta IA:',
    openDirectCTA: 'Abrir no {agent} ↗',
    copyAndOpenCTA: 'Copiar Prompt & Abrir no {agent} ↗',
    openDirectToast:
      'Abrindo o {agent}... (Prompt copiado para a área de transferência por garantia)',
    copyAndOpenToast:
      'Prompt copiado com sucesso! Abrindo o {agent} em uma nova aba...',
    copySuccessToast: 'Prompt copiado para a área de transferência!',
    copyErrorToast:
      'Não foi possível copiar automaticamente. Selecione e copie o texto manualmente.',
    createAnother: 'Criar Outro Prompt',
    editSettings: 'Modificar Parâmetros',
  },
};

