# FinEdu — ajustes do frontend

## Como aplicar

1. Guarde uma cópia da sua pasta atual.
2. Extraia este ZIP em uma pasta separada. Para atualizar um checkout existente, copie o conteúdo sobre o projeto (sem apagar o seu `.git` ou `.env`).
3. No terminal da pasta do frontend, execute `npm ci`.
4. Se necessário, copie `.env.example` para `.env` e ajuste apenas `VITE_API_URL`.
5. Execute `npm run build` e depois `npm run dev`.
6. Mantenha o backend funcionando em `http://localhost:3333` e entre com uma conta existente.

O ZIP não inclui node_modules, dist, histórico Git ou credenciais. O build agora executa a checagem de TypeScript antes do Vite.

## O que mudou

- Metas e Simulador usam `src/app/utils/goalDeadline.ts`: meses completos com aportes no fim de cada período mensal. Datas inválidas, prazo vencido, prazo no dia e fim de mês são tratados. Em 23/10/2026, a meta com prazo de 01/01/2028 tem 14 períodos completos.
- O botão de simulação preserva os valores da meta e não grava projeções no saldo real. A navegação comum abre uma simulação independente.
- O Dashboard consulta as metas reais, os cursos e os dados do usuário. O gráfico patrimonial fictício foi substituído pelo total atual informado nas metas, identificado como tal. Não é um histórico nem o patrimônio total.
- O Perfil consulta o usuário e as trilhas. Aulas, perguntas e questionários respondidos vêm dos registros retornados pela API. Cursos concluídos não são apresentados como certificados emitidos.
- Os marcos do Perfil são indicadores calculados da situação atual, não recompensas históricas gravadas no banco. Uma meta excluída deixa de contar no marco de meta cadastrada.
- Removidas estatísticas fictícias de horas, acerto por tentativa, datas de certificados, conquistas de sequência e previsão de XP para o próximo nível. XP, nível e sequência continuam sendo exibidos conforme fornecidos pelo backend.
- Poupança, CDB e LCI/LCA continuam usando o endpoint de mercado existente. Tesouro e ações não foram adicionados.
- Cada consulta tem carregamento e erro próprios; falha de consulta não é apresentada como saldo zero ou ausência de registros.
- Corrigidos erros de tipos em Configurações e no ponto de entrada. Adicionados os tipos de React/React DOM e testes para as datas.

## Backend necessário — nenhuma rota nova

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` → `data.user`
- `GET /api/v1/trails` → `data.trails`
- `GET /api/v1/goals` → `data.goals`
- `POST /api/v1/goals` → `data.goal`
- `PATCH /api/v1/goals/:goalId` → `data.goal`
- `DELETE /api/v1/goals/:goalId`
- `GET /api/v1/market/rates` → `data.rates` com cdb, lci e poupanca

O contrato de trilhas inclui completedLessons, status, hasFinalQuiz, totalQuestions, answeredQuestions e correctQuestions. Endpoints protegidos usam o token do sessionStorage. Mantidos os fluxos existentes de autenticação, recuperação de senha, aulas e questionários.

## Verificação

- `npm run typecheck`: tipos do projeto.
- `npm test`: cinco testes de datas (incluindo fim de mês e ano bissexto). O script usa execução nativa de TypeScript do Node; utilize Node 24, como no ambiente informado.
- `npm run build`: TypeScript e empacotamento Vite.
- Validação no navegador com respostas controladas de API: Dashboard sem exemplos, Perfil com contagens reais do contrato, estado vazio, falha de consulta sem falso zero, criação de meta, preenchimento de 14 meses, navegação de volta, simulação independente e Perfil em 390 px sem rolagem horizontal. Nenhum erro JavaScript nesse percurso.
- O backend e o banco locais não estavam no ZIP; a integração com eles deve ser confirmada no seu computador.

## Limites que continuam dependendo do backend

- A sequência de dias é apenas o valor retornado pela API; este frontend não implementa atualização diária de streak.
- Regras de evolução de nível, histórico de conquistas, tempo efetivo de estudo, emissão de certificados e evolução patrimonial histórica não são criados nesta entrega.
- Configurações, onboarding e autenticação Google conservam suas funcionalidades anteriores. A tipagem de Configurações foi corrigida, mas isso não implementa ações que ainda eram demonstrativas.
- As taxas são referências da última consulta do backend, respeitando o cache de mercado. A simulação é bruta, com taxa constante, sem impostos, tarifas ou inflação.
