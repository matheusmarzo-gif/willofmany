# Instruções de trabalho — Will of Many

## Leia este arquivo primeiro

Antes de investigar, editar, testar, compilar ou publicar qualquer coisa neste
repositório, leia este `AGENTS.md` por inteiro. Depois leia
[`ARCHITECTURE.md`](./ARCHITECTURE.md) para o mapa de arquivos e dependências.
Estas instruções são destinadas a qualquer pessoa ou agente de programação que
retomar o projeto, inclusive em uma nova conversa ou usando outra IA.

Se a ferramenta não carregar `AGENTS.md` automaticamente, abra-o explicitamente
antes de começar. Em caso de conflito, não presuma qual cópia do projeto é a mais
nova: confira a branch, o commit e o estado do Git conforme abaixo.

## Localizar a cópia correta

1. Localize a raiz ativa com `git rev-parse --show-toplevel`.
2. Confira `git branch --show-current`, `git status --short`, `git log -1
   --oneline` e `git remote -v` antes de editar ou publicar.
3. A versão-fonte atualizada nesta retomada está em:
   `C:\Users\MATHEUS\.copilot\session-state\786adb26-53cc-4e67-bc60-2df110b036be\files\willofmany-main-publish-20261001b`
   na branch `main`, commit `5e577f9` (verifique o hash/estado atual em vez de
   assumir que continuam iguais).
4. A pasta
   `C:\Users\MATHEUS\Desktop\matheus - the will of many` é uma cópia de trabalho
   separada. No momento destas notas, ela está na branch `master`, contém
   alterações locais e **não contém** os módulos novos (`game-client.js`,
   `game-rules.js`, `game.css`) nem esta nota. Não a sobrescreva, não faça
   checkout/reset e não copie o workspace inteiro para ela. Se o usuário quiser
   atualizar essa pasta, compare e integre cada arquivo explicitamente,
   preservando as mudanças locais.
5. O APK entregue é uma saída de build, não a fonte do código. Seu caminho usual é
   `C:\Users\MATHEUS\Desktop\matheus - the will of many\android-app\app\build\outputs\apk\debug\app-debug.apk`.

## Ordem de leitura do código

Leia somente os arquivos/ranges necessários à tarefa, seguindo esta ordem:

1. `AGENTS.md` — estas regras, locais e precauções.
2. `ARCHITECTURE.md` — responsabilidades, fluxo de dados, símbolos importantes e
   validações por plataforma.
3. Estado do Git e branch da cópia ativa.
4. Busque os símbolos envolvidos com `rg`/busca do editor; abra as regiões
   relevantes de `game-client.js`, `game-rules.js` ou arquivos de plataforma.
   Evite despejar ou ler o arquivo todo sem necessidade.
5. Leia os JSONs do tabuleiro ou dados de região envolvidos antes de alterar
   valores codificados. O tabuleiro de campanha é configurado em
   `tabuleiro-01.json` e `tabuleiro-02.json`.
6. Leia os testes relacionados e procure consumidores da regra em IA, campanha,
   Android, servidor, save e protocolos antes de mudar comportamento.

## Arquivos principais

- `index.html`: entrada HTML; carrega os arquivos de estilo e JavaScript na ordem
  definida. Não contém mais o snapshot regional JSON de 700 KB.
- `game.css`: estilos e layouts responsivos.
- `game-client.js`: estado de partida, interface, mecânicas ainda não extraídas,
  campanha, renderização e integrações do cliente.
- `game-rules.js`: regras puras de composição, contagem e custo; exporta
  `window.WillOfManyRules` no navegador e CommonJS nos testes.
- `will-of-many-ai.js`: decisões da IA.
- `tabuleiro-01.json` / `tabuleiro-02.json`: dados específicos dos níveis de
  campanha.
- `regioes-will-of-many-circular.json`: dados-base carregados para o tabuleiro
  misto/circular padrão.
- `android-app/app/src/main/java/com/willofmany/app/MainActivity.java`: WebView,
  Bluetooth, leitura segura de assets e login Android.
- `android-app/app/build.gradle`: lista os recursos web copiados para o APK.
- `server-app/src/main/java/com/willofmany/server/`: API e protocolo online.
- `server-app/build.gradle`: recursos web que o servidor inclui precisam estar
  explicitamente declarados nesta tarefa.
- `ARCHITECTURE.md`: mapa ampliado, dependências, pontos de entrada por mecânica e
  roteiro incremental para modularizar.
- `tests/`: testes do módulo de regras e dos caminhos/empacotamento dos assets.

## Regras para editar com segurança

- Faça uma mecânica por vez; identifique primeiro sua fonte de verdade e os modos
  afetados. Não reescreva `game-client.js` inteiro em uma única mudança.
- Preserve o comportamento existente fora do escopo. Não altere a cópia suja do
  Desktop para “sincronizar” fontes sem comparar os conflitos.
- Ao introduzir/remover arquivo web, confira `index.html`, a tarefa
  `prepareWebAssets` do Android e `server-app/build.gradle`. O jogo precisa manter
  os mesmos caminhos tanto no navegador, quanto no WebView e no servidor.
- A ordem do cliente é importante: `game.css`, `game-rules.js`,
  `will-of-many-ai.js`, depois `game-client.js`.
- Tabuleiros usam JSONs externos. Se o carregamento falhar, exiba/trate o erro;
  não reintroduza fallback silencioso com snapshot antigo.
- Preserve os contratos de save, Bluetooth e WebSocket. Confira os clientes e
  servidor quando modificar mensagens ou estado sincronizado.
- Não inclua APK, `build/`, `.gradle/`, IDE state, screenshots ou arquivos de
  diagnóstico em commits. Faça stage somente de caminhos explícitos; nunca use
  `git add .` neste projeto.
- Não faça commit, push, deploy ou troca de branch sem pedido explícito. Antes de
  publicar, atualize `origin/main` com fast-forward seguro; se houver divergência,
  pare e consulte o usuário. Nunca force-push.

## Validação

Execute os testes relevantes para os arquivos alterados:

```powershell
node --test tests\game-rules.test.js tests\asset-entrypoints.test.js
```

Para qualquer alteração de HTML, JavaScript do jogo, Android, manifesto ou
dependências Android:

```powershell
Set-Location android-app
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
.\gradlew.bat --no-daemon assembleDebug
```

Verifique se o APK inclui todos os novos arquivos e copie-o para a pasta de saída
do Desktop indicada acima somente como artefato solicitado. Não afirme que o APK
está atualizado sem conferir build, timestamp e tamanho/hash.

Para o servidor, execute:

```powershell
Set-Location server-app
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:JAVA_TOOL_OPTIONS = '-Dnet.bytebuddy.experimental=true'
.\gradlew.bat --no-daemon test
```

Use `git diff --check` (com atenção a CRLF no Windows), revise o diff completo e
teste no navegador qualquer mudança de interface/fluxo. Para publicar, siga também
as regras de branch, stage explícito, commit e sincronização registradas na
documentação do projeto.
