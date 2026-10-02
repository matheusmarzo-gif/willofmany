# Arquitetura e mapa do Will of Many

Este documento registra a arquitetura atual do repositório e serve como guia para
localizar e alterar mecânicas com menos risco de regressão. É um mapa da situação
existente, não uma proposta para reescrever o jogo de uma vez.

Antes de iniciar qualquer trabalho neste repositório, leia primeiro
[`AGENTS.md`](./AGENTS.md), que registra a ordem de leitura, a localização das
cópias do projeto, as precauções e as validações obrigatórias.

## Resumo do projeto

O jogo tem três partes que compartilham ou complementam a experiência:

1. **Cliente web**: `index.html` contém a estrutura e o ponto de entrada.
   `game.css` mantém os estilos, `game-client.js` contém a lógica de interação,
   `game-rules.js` contém funções puras de regras/composição e
   `will-of-many-ai.js` implementa as decisões da IA.
2. **Aplicativo Android**: um `WebView` usa o mesmo jogo web e integra recursos
   nativos como Bluetooth e login Google. O Gradle copia os arquivos web e os
   dados da raiz para os assets do APK.
3. **Servidor Spring Boot**: oferece os modos online, matchmaking, persistência e
   recursos de autenticação. Ele também empacota a página web para servir o jogo.

O cliente foi dividido em arquivos de entrada, estilos, regras puras e lógica da
partida. `game-client.js` ainda concentra estado, renderização, eventos, campanha
e protocolos no mesmo escopo. O antigo JSON de região incorporado foi removido:
os tabuleiros são carregados de arquivos externos, e uma falha agora é informada
em vez de recorrer silenciosamente a um snapshot antigo. Extrações futuras devem
continuar pequenas e cobertas por testes.

## Mapa de arquivos

| Caminho | Responsabilidade | Quando consultar |
| --- | --- | --- |
| `index.html` | Entrada e marcação do jogo web. | Alterar a estrutura da página ou a ordem dos recursos do cliente. |
| `game.css` | Estilos de desktop, mobile, campanha e tabuleiro. | Alteração visual ou responsiva. |
| `game-client.js` | Estado de partida, interações, desenho do tabuleiro, menus, campanha e integrações web. Carregado depois dos módulos de regras/IA. | Mecânica ou fluxo do cliente ainda não extraído. |
| `game-rules.js` | Funções puras compartilhadas de composição, contagem, custo, reembolso e agrupamento de conflitos. Expõe `WillOfManyRules` no navegador e CommonJS para testes. | Alterar regras determinísticas sem acesso ao DOM. |
| `will-of-many-ai.js` | Escolha de ações da IA; exporta `window.WillOfManyAI.chooseAction(snapshot)`. | Comportamento do oponente automático. |
| `tests/game-rules.test.js` | Testes de caracterização do módulo de regras, usando `node:test` sem dependências adicionais. | Validar composição, conversões de unidades, custos e reembolsos. |
| `tests/asset-entrypoints.test.js` | Garante a ordem dos recursos de entrada e sua inclusão nos builds Android e servidor. | Alterar caminhos, módulos web externos ou configurações de empacotamento. |
| `tabuleiro-01.json`, `tabuleiro-02.json`, `tabuleiro-03.json` | Configuração de campanha por nível: regiões, blocos, peças iniciais, moedas, objetivo, escala de exibição/foco, rotação e limite de turnos. `preserveCoinsBetweenTurns` mantém o saldo ao passar o turno; `aiActionsEnabled: false` faz a IA passar automaticamente. Regiões de blocos circulares declaram também `disco`; blocos quadriculares podem definir `rotationArea` para girar uma submatriz específica em vez de toda a matriz. | Criar ou ajustar um nível de campanha e a qual disco cada região pertence. |
| `regioes-will-of-many-circular.json`, `regioes-will-of-many.json`, `will-of-many-final.json` | Máscaras/regiões usadas para compor o tabuleiro e derivar geometria e vizinhança. O tabuleiro circular é a fonte padrão para todos os modos não campanha; os outros JSONs são apenas fallbacks de carregamento inicial. No tabuleiro circular atual, `disco` identifica o anel rotativo de cada região. | Geometria, regiões, dados-base e vizinhança do tabuleiro padrão. |
| `regioes-will-of-many-l8.json` | Dados auxiliares de regiões L8 usados por ferramentas/edição. Confirme os pontos de leitura antes de tratá-lo como fonte do tabuleiro ativo. | Investigação de geometria e edição de regiões L8. |
| `editor-regioes.html` | Ferramenta visual de edição/inspeção de regiões e dados auxiliares. | Ajustar ou depurar máscaras e caixas de região. |
| `peca_*.png`, `l1.png`–`l8.png`, `final*.png`, `tutorial-*.svg` | Imagens de peças, camadas, telas finais e tutorial. | Arte, ícones e recursos empacotados. |
| `android-app/app/src/main/java/com/willofmany/app/MainActivity.java` | WebView e pontes Android para Bluetooth, leitura de assets e login Google. | Integração nativa ou comportamento exclusivo do aplicativo. |
| `android-app/app/build.gradle` | Configura o módulo e a tarefa `prepareWebAssets`, que copia arquivos da raiz para o APK. | Alterar a lista ou o processo de assets/build Android. |
| `android-app/README.md` | Instruções específicas para abrir e compilar o aplicativo. | Fluxo de build e configuração do Android. |
| `server-app/src/main/java/com/willofmany/server/` | API, autenticação, matchmaking, sessão, banco de dados e WebSocket online. | Funcionalidade online ou regras de protocolo do servidor. |
| `server-app/src/test/java/com/willofmany/server/` | Testes JUnit do servidor. | Validar mudanças no servidor. |
| `server-app/build.gradle` | Dependências, testes e empacotamento dos recursos web no servidor. | Alterar recursos entregues pela aplicação Java. |
| `server-app/Dockerfile` | Build da imagem de servidor; o contexto esperado é a raiz do repositório. | Build/deploy do servidor. |
| `server-app/README*.md` | Instruções de execução, hosting e configuração de rede/Google. | Operação e publicação do servidor. |

Os arquivos `will-of-many-debug-*.json` são exportações de depuração, não
configurações normais de nível. Evite usá-los como fonte de verdade ou atualizá-los
junto com uma mecânica sem necessidade.

## Mapa do cliente

`index.html` carrega `game.css`, `game-rules.js`, `will-of-many-ai.js` e
`game-client.js`, nessa ordem. Preserve a ordem: o cliente depende de
`window.WillOfManyRules` e `window.WillOfManyAI`. As máscaras principais são
carregadas de `regioes-will-of-many-circular.json` no Android e como primeiro
candidato nos demais clientes; arquivos externos alternativos são tentados se
esse carregamento falhar. O módulo de regras é CommonJS no Node para testes e
`window.WillOfManyRules` no navegador.

Para encontrar um ponto de entrada, use a busca do editor pelo nome da função:

| Área | Funções e estado para localizar | Observação |
| --- | --- | --- |
| Configuração e estado | `regionPiecesByRegion`, `regionForceStats`, `currentBoardData`, `campaignLevelFiles` em `game-client.js`; pesos e ordem de peça em `game-rules.js` | Estado vivo permanece no cliente; regras puras compartilhadas ficam no módulo. |
| Carregamento de tabuleiro | `loadRegionMasks`, `loadBoardFile`, `applyRegionData`, `normalizeImportedRegionGeometry` | Carregamento inicial das máscaras e carregamento explícito de níveis. |
| Geometria e vizinhança | `regionGeometryByCode`, `regionNeighborCache`, `recomputeNeighborCacheForLayer`, `getRegionCalculationOrder` | Geometria, rotação e vizinhança também alimentam regras e destaques. |
| Compra e composição | `renderPiecePurchaseButtons`, `addPiece`, `mergeRegionTeam`, `refreshRegionVisuals` | A compra altera o estado lógico e depois atualiza peças, forças e painéis. |
| Economia da campanha | `getCampaignCoinsPerTurn`, `passTurnToNextPlayer`, `activeCampaignLevel.preserveCoinsBetweenTurns` | Configure renda, moedas iniciais e persistência do saldo nos metadados do JSON do nível. |
| Sacos de moedas | `regionGeometryByCode[regionCode].bagCoins`, `campaignCollectedBags`, `updateSelectedRegionPanel`, `collectCampaignBagAtRegion` | O painel da região selecionada mostra o valor de um saco ainda não coletado; ao coletá-lo, o indicador some junto com o ícone do tabuleiro. |
| Movimento e descarte | `beginPieceDrag`, `finishPieceDrag`, `getDragTargets`, `performRelegation`, `performRecycle` | O arraste usa hit-testing, alvos válidos e uma camada visual própria. |
| Promoção e guerra | `refreshPromotionControls`, `startWar`, `recalculateRegionForces`, `updateWarAvailability` | Promoção, propriedade, força, guerra e condição de vitória são interdependentes. Em todos os tabuleiros, a guerra visita primeiro o maior rank (L1), seguindo em ordem decrescente do número de região dentro de cada rank; cada região pode participar de um único bloco por guerra. Cada bloco mantém sua animação antes de ser resolvido, e a marcação de participação é reiniciada no começo da próxima guerra. |
| Rotação | `getRotatableCircularBlocks`, `getRotatableQuadrilateralBlocks`, `renderCircularRotationControls`, `rotateCircularDisk`, `rotateQuadrilateralBlock`, `rotateQuadrilateralMatrix` | Blocos circulares selecionam o bloco e o `disco`; cada bloco quadricular rotativo também é selecionado individualmente. A matriz gira seus anéis exteriores e internos recursivamente. |
| Renderização do tabuleiro | `renderBoardLayers`, `refreshRegionVisuals`, `updateBoardFocusOverlay` | As regiões são desenhadas em SVG; peças são elementos separados sobre o tabuleiro. |
| Campanha e guia | `beginConfiguredGame`, `showCampaignGuide`, `hideCampaignGuide`, `continueCampaignGuide`, `maybeAdvanceLevel2Guide`, `maybeAdvanceLevelThreeGuide` | O guia depende de eventos da partida e estados persistidos; no Level 3, a introdução percorre L8-1 → L8-16 → L8-1 em seis segundos. A mensagem sobre rótulos centraliza instantaneamente L8-1, redesenha tabuleiro/realces e usa essa região como exemplo. As duas mensagens não chamam `scrollIntoView` para SVGs ampliados: isso poderia rolar o conteúdo interno do painel e deslocar o tabuleiro/controle ×. As outras dicas avançam por ações do jogador. |
| Turno e IA | `passTurnToNextPlayer`, `scheduleAiTurn`, `getGameSnapshot` | A IA escolhe ações com um snapshot do estado; a aplicação das ações permanece no cliente. |
| Salvamento e retomada | `saveGame`, `loadSavedGame`, `continueSavedGame` | Alterações no estado persistente precisam ser compatíveis com saves existentes. |
| Bluetooth | `publishBluetoothAction`, `applyBluetoothAction` e mensagens tratadas em `MainActivity.java` | Cliente, ponte nativa e protocolo precisam continuar alinhados. |
| Online | Funções de `sendOnlineMessage`, matchmaking e sessão WebSocket | O cliente e `OnlineGameHandler` compartilham o contrato de mensagens. |

As funções acima são referências de busca, não fronteiras de módulos: muitas
acessam variáveis e elementos DOM declarados no mesmo script.

## Fluxo de dados da partida

1. A página carrega as máscaras de região e aplica os dados com `applyRegionData`.
   Para uma partida nova, qualquer modo fora de campanha deve carregar
   `regioes-will-of-many-circular.json`; campanha carrega o arquivo indicado por
   `campaignLevelFiles`. Mantenha essa decisão centralizada em
   `getNewGameBoardFile` e atualize os testes se a configuração mudar.
2. Ao selecionar um modo não campanha no fluxo **Jogo novo**, o cliente carrega o
   tabuleiro circular e volta a confirmá-lo em `beginConfiguredGame`; isso cobre
   também os caminhos diretos de início por Bluetooth e Online.
3. No modo campanha, `beginConfiguredGame` carrega o JSON do nível antes de
   preparar peças iniciais, objetivo e estado do guia.
   O mapa `campaignLevelFiles` mantém a ordem de desbloqueio dos níveis. Configure
   `initialCoins`, `coinsPerTurn`, `preserveCoinsBetweenTurns` e
   `aiActionsEnabled` no bloco `campaign`, sem criar exceções por número de
   level no fluxo de turnos.
4. Ações como comprar, mover, promover, descartar, girar ou resolver uma guerra
   atualizam `regionPiecesByRegion` e estruturas relacionadas.
5. As ações que alteram a composição/posição atualizam forças, visuais, controles
   e painel da região; muitas também salvam e publicam a ação para Bluetooth ou
   online.
   Ao iniciar uma guerra, `game-rules.js` ordena todas as regiões por rank
   ascendente (L1→L8) e número descendente dentro do rank, e agrupa vizinhos
   aliados/inimigos ainda não participantes em blocos de conflito. O cliente
   anima e resolve cada bloco nessa ordem; a lista de participantes é local à
   guerra e começa vazia na próxima iteração.
6. A rotação circular usa a identidade do bloco e o campo `disco` para mover as
   regiões do mesmo disco juntas; se houver mais de um bloco circular rotativo,
   o seletor pede primeiro o bloco. Geometria, peças e vizinhança são atualizadas
   em conjunto. Blocos quadriculares rotativos são selecionados um por vez e
   aplicam a rotação recursiva dos anéis da matriz apenas ao bloco escolhido.
   `rotateQuadrilateralBlocksForLayer` reaplica o tabuleiro após atualizar a
   matriz; `applyRegionData` recompõe máscaras e recalcula as vizinhanças de
   todas as camadas. Regiões quadriculares de blocos distintos também podem ser
   vizinhas quando suas células compartilham uma borda física após as rotações.
   `game-rules.js` fornece `areAxisAlignedCellsNeighbors` para a mesma verificação
   dentro e entre blocos quadriculares. O helper de rotação usa a matriz inteira
   por padrão; `rotationArea` (linha, coluna e tamanho, com índices iniciando em
   1) restringe a rotação recursiva a uma submatriz, como em BQ04 no Level 3.
   `displayScale` maior que 1 amplia a geometria para além da área usada no
   hit-testing; em tabuleiros extensos, mantenha o valor em 1 e use
   `regionFocusScale` para ampliar apenas a região em foco. No Level 3, o foco
   usa escala 5.2 e cada região quadricular dispõe até oito posições de peça em
   uma grade 4×2; os ícones mantêm 30 px visuais durante o zoom.
   Etiquetas temporárias de custo são posicionadas na camada do painel para
   manter o tamanho visual durante o zoom; a transição de turno do Level 3 dura
   metade do tempo padrão (1,75 s). Os contornos de foco e guerra usam traços
   estreitos para não encobrir regiões ampliadas. Saves anteriores à troca dos
   códigos L8-8…L8-11 têm seus códigos de região remapeados ao retomar a partida.
   Reiniciar um level também reinicia o passo do guia e limpa bloqueios e
   animações de rotação pendentes.
7. O JSON de nível descreve dados da campanha; o estado vivo da partida e seu save
   ficam no cliente. O servidor online mantém estado/mensagens da partida online.

Não confunda `regionPiecesByRegion` (composição de peças) com `regionStats`
(contagens auxiliares) ou `regionForceStats` (resultado calculado). Ao adicionar
uma mecânica, identifique qual estrutura é a fonte de verdade e mantenha as
derivadas sincronizadas pelo fluxo existente.

## Guia para modificar uma mecânica

Antes de editar:

1. Escreva o comportamento esperado e os modos afetados: tabuleiro padrão,
   campanha Level 1, Level 2, IA, dois jogadores, Bluetooth, online, navegador e
   Android.
2. Busque a função que recebe a ação e siga o fluxo até onde o estado é salvo,
   renderizado e sincronizado. Pesquise também os consumidores da mesma regra no
   módulo da IA e no servidor.
3. Procure dados configuráveis nos JSONs antes de codificar exceções por nome de
   região ou por nível.
4. Anote invariantes que a mecânica deve preservar, como limite de peças,
   propriedade da região, custo, força, vizinhos, progresso do guia e estado
   persistido.

Durante a mudança:

1. Faça a alteração no ponto de domínio e reutilize helpers existentes.
2. Atualize as superfícies dependentes: estado derivado, renderização, painel,
   botões/guia, save, IA e protocolos quando aplicável.
3. Se a regra for exclusiva de um tabuleiro ou modo, use a configuração de nível
   ou um predicado de modo já existente; evite alterar silenciosamente a regra
   geral.
4. Não atualize somente a apresentação se a ação também muda o estado lógico, nem
   somente o estado se há UI ou clientes remotos que precisam refletir a mudança.
5. Preserve saves antigos ou introduza uma migração/versão explícita se o formato
   salvo precisar mudar.

Depois da mudança:

1. Execute `git diff --check` e revise o diff completo.
2. Para as regras puras e os pontos de entrada do cliente, execute
   `node --test tests/game-rules.test.js tests/asset-entrypoints.test.js`.
3. Para o servidor, execute `server-app\gradlew.bat test`.
4. Para qualquer alteração em HTML, JavaScript do jogo, código Android, manifesto
   ou dependências Android, compile o APK a partir de `android-app` com
   `.\gradlew.bat --no-daemon assembleDebug` e verifique os assets gerados.
5. Teste no navegador e, quando a alteração for visual ou de interação,
   confira os tamanhos de tela e orientação em que o problema pode ocorrer.
6. Exercite pelo menos um fluxo existente adjacente à mecânica. Alterações em
   rotação, vizinhança, forças ou guerra devem ser conferidas juntas; alterações
   de campanha devem ser testadas nos dois níveis se afetarem lógica compartilhada.

Os testes JUnit cobrem o servidor; `node:test` cobre as regras puras extraídas do
cliente. As demais mecânicas ainda não têm um runner de testes de integração do
cliente, então mantenha testes de caracterização e validação manual dos fluxos
afetados antes de remover qualquer comportamento legado.

## Estratégia segura para reduzir o monólito

Não transforme todo o `game-client.js` em módulos numa única alteração. O cliente
atual depende de estado global compartilhado, ordem de carregamento, DOM e
inclusão dos arquivos em três distribuições (web, Android e servidor). Uma
extração ampla dificultaria distinguir regressões de regras, carregamento de
assets e diferenças entre plataformas.

Uma sequência recomendada para trabalhos futuros:

1. **Ampliar os testes de caracterização** para funções puras de promoção,
   vizinhança e cálculo de força. Primeiro documentar o resultado existente;
   depois mudar a regra.
2. **Continuar extraindo funções puras** para módulos pequenos, sem acesso ao
   DOM. `game-rules.js` é o primeiro módulo desse tipo: define pesos e operações
   de composição/custo, é carregado antes do script principal e tem testes
   executáveis sem bibliotecas extras.
3. **Separar dados e apresentação**: manter configuração nos JSONs e concentrar
   desenho/atualização de componentes em módulos que recebam estado e dependências
   explícitas.
4. **Separar integrações** de IA, Bluetooth, online e Android atrás de interfaces
   pequenas; conservar o formato de mensagens até haver testes de compatibilidade.
5. **Migrar uma mecânica por vez**, validar modos e plataformas, e só então remover
   a implementação antiga.

Uma extração que introduza `import`/ES modules precisa atualizar e testar o modo
de servir os arquivos no navegador, o `prepareWebAssets` do Android e os recursos
incluídos pelo Spring Boot. Não basta o módulo funcionar em um único ambiente.

## Regras de distribuição e cautelas

- A versão web parte de `index.html` e dos arquivos estáticos na raiz. O CSS e a
  lógica principal são arquivos externos carregados em ordem explícita.
- A tarefa `prepareWebAssets` em `android-app/app/build.gradle` copia HTML,
  CSS, JavaScript, PNG, JSON e SVG da raiz; confira o filtro ao adicionar outro
  tipo de arquivo.
- `server-app/build.gradle` empacota explicitamente `index.html`, `game.css`,
  `game-client.js`, `game-rules.js`, `will-of-many-ai.js`, PNG e SVG. Ao adicionar
  outro recurso web, avalie também esse filtro.
- `MainActivity.java` contém mais de uma integração nativa. Alterações de WebView
  podem afetar carregamento local, URL online, Bluetooth e login Google.
- Os dados do tabuleiro são arquivos externos. Se o carregamento falhar, o cliente
  informa o erro e permite carregar um JSON manualmente; não existe mais um
  snapshot de regiões embutido no HTML.
- Os arquivos `.json` da raiz são consumidos por nome. Renomear um arquivo exige
  atualizar referências no cliente e nas listas de assets/bridge correspondentes.
- Alterações locais existentes podem ser relacionadas a uma correção em curso.
  Não as descarte ao organizar ou extrair código.
