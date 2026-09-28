# Hospedar o Will of Many grátis na internet (Render + Neon)

Este guia escolhe o **Render** para hospedar o servidor Java e o **Neon** para guardar contas e Elo em PostgreSQL. Ambos têm planos gratuitos. Depois da configuração, o computador de quem criou a partida não precisa ficar ligado: o jogo roda no Render, e todos abrem o mesmo endereço público.

> **É grátis para testes, não é hospedagem de produção.** Os planos, cotas e requisitos dos provedores podem mudar; confirme as condições atuais nas páginas de [planos gratuitos do Render](https://render.com/docs/free) e [preços do Neon](https://neon.com/pricing) ao seguir este guia.

## O que será configurado

- **Render Web Service:** compila o projeto Java e serve o jogo, a API e o WebSocket no endereço HTTPS que o Render fornecer.
- **Neon PostgreSQL:** guarda os perfis e ratings Elo fora do disco temporário do Render.
- **Google OAuth:** permite que os jogadores entrem usando uma conta Google.

O projeto inclui [um Dockerfile](./Dockerfile) preparado para compilar o jogo e iniciar o servidor no Render. Não é preciso instalar Java no seu computador para implantar pela integração com GitHub.

## Antes de começar

1. Crie uma conta no [GitHub](https://github.com/) e coloque **o projeto inteiro** em um repositório. O repositório precisa conter `index.html`, `will-of-many-ai.js`, os arquivos de imagem, `server-app` e este `Dockerfile`.
2. Crie contas gratuitas em [Render](https://render.com/) e [Neon](https://neon.com/).
3. Mantenha o projeto privado, se desejar: conecte o Render à sua conta GitHub e conceda acesso ao repositório. Nunca inclua senhas, arquivos `.env`, Client Secrets ou dados de acesso do banco no repositório.

## 1. Criar o banco PostgreSQL grátis no Neon

1. No [console do Neon](https://console.neon.tech/), crie um projeto PostgreSQL.
2. Escolha uma região próxima à região onde pretende hospedar o servidor no Render; isso reduz a latência.
3. Abra **Connect** e escolha a branch, o banco de dados e a role que serão usados pelo jogo.
4. Copie e guarde os dados de conexão: host, nome do banco, role/usuário e senha. Não publique esses dados.
5. Na tela **Connect**, escolha a conexão **pooled** do Neon (o hostname geralmente contém `-pooler`) e copie a URL PostgreSQL completa. O servidor agora aceita a URL no formato `postgresql://...` copiado do Neon e a converte automaticamente para JDBC, preservando parâmetros de conexão como `sslmode=require` e `channel_binding=require`.

   > A URL completa inclui a senha. Guarde-a como segredo no Render; não a envie em mensagens, não a coloque neste guia e não a salve no GitHub.
   >
   > Se você compartilhou a URL/senha, redefina a senha da role no Neon antes de usar a conexão: em **Roles & databases**, abra o menu da role e escolha **Reset password**. Depois copie do **Connect** uma URL atualizada com a senha nova.

O aplicativo cria/atualiza sua tabela de jogadores ao conectar pela primeira vez. O banco Neon é separado do H2 que o servidor usa localmente: contas e Elo já gravados no H2 **não** são copiados automaticamente para o Neon.

## 2. Criar o serviço gratuito no Render

1. No [Dashboard do Render](https://dashboard.render.com/), clique em **New → Web Service**.
2. Conecte o GitHub, autorize o acesso ao repositório e selecione o repositório completo do jogo.
3. Configure o serviço:
   - **Name:** escolha um nome ainda disponível, por exemplo `will-of-many-seu-nome`.
   - **Region:** selecione uma região próxima à escolhida no Neon.
   - **Root Directory:** deixe em branco, para usar a raiz do repositório. O Dockerfile precisa enxergar tanto `server-app` quanto os arquivos do jogo na raiz.
   - **Runtime/Language:** **Docker**.
   - **Dockerfile Path:** `server-app/Dockerfile`.
   - **Instance Type:** **Free**.
4. Antes de criar ou após o primeiro deploy, abra **Environment** do serviço e adicione as variáveis descritas na etapa seguinte.
5. Clique em **Create Web Service**. Aguarde o deploy terminar e confira a página **Logs**. Copie o endereço HTTPS que o Render mostra, normalmente:

   ```text
   https://NOME-DO-SERVICO.onrender.com
   ```

O Render termina HTTPS na borda e encaminha a conexão para o contêiner. Por isso, **não** defina `TLS_ENABLED=true`, certificado PKCS#12 ou senha de certificado no serviço: essa configuração era para iniciar TLS diretamente no servidor local.

## 3. Configurar as variáveis de ambiente do Render

Em **Environment → Add Environment Variable**, adicione:

| Chave | Valor |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID OAuth Web, configurado na etapa 4. |
| `DATABASE_URL` | URL PostgreSQL **pooled completa** copiada do Neon, incluindo senha e opções TLS. Marque-a como **Secret**/sensível no Render. |

Para essa configuração, não defina `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` nem `SPRING_DATASOURCE_PASSWORD`; o servidor lê usuário, senha e JDBC URL diretamente de `DATABASE_URL`.

Não é necessário definir `PORT`: o Render fornece essa variável automaticamente, e o servidor a utiliza. Também deixe `TLS_ENABLED` ausente ou com `false`.

Ao salvar variáveis, o Render pode reiniciar ou publicar novamente o serviço. Se o banco ainda não existir ou os dados de conexão estiverem incorretos, o servidor não iniciará; confira o log do deploy e valide URL, usuário, senha e região.

## 4. Configurar login Google para o endereço do Render

O jogo precisa do **Client ID OAuth do tipo Web application**. Nesta implementação, não precisa de Client Secret nem de URI de redirecionamento.

1. Abra o [Google Cloud Console](https://console.cloud.google.com/) e selecione/crie um projeto.
2. Em **Google Auth Platform → Branding**, configure o nome do aplicativo e o e-mail de suporte.
3. Em **Audience**, escolha **External** para permitir contas Google pessoais. Durante o desenvolvimento, mantenha o app em **Testing** e inclua todas as contas dos participantes em **Test users**.
4. Em **Google Auth Platform → Clients**, crie uma credencial **OAuth client ID → Web application**.
5. Em **Authorized JavaScript origins**, adicione o endereço base exato do Render, por exemplo:

   ```text
   https://NOME-DO-SERVICO.onrender.com
   ```

   Use o nome verdadeiro do serviço, sem caminho (`/`, `/api` ou `/ws/game`) e sem barra final. Não use o endereço `http://` de teste nem o endereço do painel Render.
6. Crie a credencial, copie o Client ID terminado em `apps.googleusercontent.com` e salve-o como `GOOGLE_CLIENT_ID` nas variáveis do Render, conforme a etapa 3.
7. Espere o novo deploy. Abra o endereço público do serviço, escolha **Novo jogo → Online** e teste o login com uma conta listada em **Test users**.

> Se o Google Cloud recusar `onrender.com` como origem/domínio autorizado, exigir comprovação de domínio ou o botão apresentar erro de origem, o URL gratuito compartilhado do Render pode não ser suficiente para a política de OAuth aplicada ao seu projeto. Nesse caso, é necessário usar um domínio próprio validado e configurá-lo como domínio personalizado no Render; **a hospedagem do Render pode continuar no plano gratuito, mas registrar/comprar o domínio pode ter custo**. Não tente contornar a verificação usando HTTP ou um domínio de outra pessoa.

## 5. Publicar atualizações e compartilhar

- O primeiro deploy já deve publicar o conteúdo do repositório. Para atualizar o jogo depois, envie as alterações ao branch conectado ao serviço no GitHub; o Render inicia outro deploy.
- Compartilhe somente o endereço HTTPS público do Render com os jogadores.
- Cada jogador abre o mesmo endereço, seleciona **Online** e autentica com sua própria conta Google.
- O WebSocket da partida usa o mesmo host. Não é necessário abrir portas no roteador nem deixar o seu computador ligado.

## Como testar e diagnosticar

1. Abra `https://NOME-DO-SERVICO.onrender.com/api/config`. A resposta precisa incluir o `googleClientId` configurado.
2. Abra a página inicial e confirme que o navegador mostra uma conexão HTTPS válida.
3. Teste o login com uma conta adicionada a **Test users**. Se aparecer mensagem de origem não autorizada, confira o endereço exato em **Authorized JavaScript origins**.
4. Entre na fila em dois navegadores/dispositivos com contas diferentes. Confira **Logs** do Render se o serviço falhar ao acessar o Neon ou se uma conexão WebSocket não puder ser estabelecida.
5. Ao primeiro acesso depois de um período sem uso, aguarde o serviço acordar e tente novamente se o Render mostrar sua página de inicialização. O compute do Neon também pode suspender por inatividade e demorar um pouco para responder à primeira consulta.

## Limitações importantes do plano gratuito

- **O Render pode suspender o serviço por inatividade:** após cerca de 15 minutos sem tráfego de entrada, um Web Service gratuito pode parar. Um novo pedido HTTP ou uma conexão WebSocket pode acordá-lo, mas isso pode levar cerca de um minuto. Uma suspensão/reinicialização encerra processos e partidas em andamento. O Render também impõe uma cota de horas gratuitas por workspace; consulte o saldo no painel.
- **O sistema de arquivos do serviço é temporário:** por isso, o H2 local não serve para guardar dados no Render. Este guia configura PostgreSQL externo para que perfis e Elo sobrevivam a reinicializações.
- **Neon gratuito tem limites e suspensão por inatividade:** confirme cotas de armazenamento, computação, transferência e políticas no painel. A primeira conexão depois de suspender pode demorar mais.
- **Fila, sessões e partidas são mantidas em memória:** se o Render reiniciar/suspender o processo, jogadores precisam entrar novamente na fila; uma partida que estava em andamento não é restaurada.
- **Uso gratuito não significa disponibilidade garantida:** cotas mensais do Render, tempos de build, suspensão por inatividade e limites do banco se aplicam. Não há compromisso de serviço permanente.
- **O jogo não foi desenhado como servidor público resistente a trapaças ou ataques:** o servidor repassa snapshots do cliente e não valida autoritativamente todas as regras. Hospedá-lo no Render o torna acessível pela internet; use apenas partidas casuais e compartilhe o endereço com pessoas de confiança.

## Referências oficiais

- [Planos e limites grátis do Render](https://render.com/docs/free)
- [Web Services e Docker no Render](https://render.com/docs/web-services)
- [Conexão PostgreSQL/JDBC do Neon](https://neon.com/docs/connect/connect-from-any-app)
- [Google Identity Services: criar Client ID e configurar origens](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
