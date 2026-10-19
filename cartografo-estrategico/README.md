# Cartógrafo Estratégico - Gerador de Mapas Quadrilaterais

Aplicação web interativa para geração, edição, rotação por anel/linear e exportação de topologias de mapas modulares com blocos quadrilaterais (BQ), ranks de regiões (L1 a L8), povoados, fazendas e pontos de partida balanceados.

## 🚀 Como Executar no seu Computador

### 1. Pré-requisitos
- **Node.js** (versão 18 ou superior): [Baixe aqui](https://nodejs.org/)
- **npm** (já incluso com o Node.js)

### 2. Instalação
No terminal da sua máquina (dentro da pasta do projeto):
```bash
npm install
```

Para gerar o bundle usado pelo jogo web, Android e servidor:
```bash
npm run build:game-generator
```
O comando compila o núcleo TypeScript do gerador e grava `random-map-generator.js`
na raiz do repositório do jogo. O bundle exporta blocos no formato quadrilateral
do jogo e usa os níveis de fazenda e povoado definidos pelo próprio jogo.

### 3. Rodar o Servidor Local
```bash
npm run dev
```

Abra seu navegador em:
```
http://localhost:3000
```

### 4. Funcionalidades
- **Geração de Topologias Quadrilaterais**: Distribuição em camadas concêntricas (L8 a L1), regras de não-adjacência, posicionamento econômico de fazendas e povoados.
- **Rotação de Setores e Anéis**: Teste dinâmico de rotações perimetrais e matriciais 90°.
- **Exportação JSON Quadrilateral**: Exporta blocos `BQ` com coordenadas centrais geográficas $C_{\text{inicial}}$ de ancoragem para $M(1,1)$, níveis de fazendas/povoados e identificadores únicos de regiões.
- **Importação de JSON**: Carregamento instantâneo de mapas salvos.
- **Estatísticas & Economia**: Cálculo de pontuação e produtividade de recursos em tempo real.
- **Download do Código**: Botão integrado para baixar o código fonte a qualquer momento.
