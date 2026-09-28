# Will of Many — configurar o login Google e jogar pela rede local

Este guia explica como configurar o login Google e permitir que outros computadores e celulares da mesma rede joguem no servidor. O servidor é um aplicativo Java com banco de dados local; o executável para Windows inclui seu próprio runtime Java.

> Não pode manter o servidor ligado no seu computador? Veja o guia separado para publicar uma versão gratuita na nuvem: [hospedagem grátis com Render e Neon](./README-HOSTING-GRATUITA.md).

## O que você vai precisar

- A pasta completa `server-app\dist\WillOfManyServer` (incluindo `app` e `runtime`), ou o JAR em `server-app\build\libs\will-of-many-server-1.0.0.jar`.
- Uma conta Google para configurar o projeto no Google Cloud.
- O computador que executará o servidor conectado à rede local.
- Para login Google em outros dispositivos: um nome de domínio, HTTPS com certificado confiável e um nome que os dispositivos da rede resolvam para o IP local do servidor.

> O **Client ID** do Google não é uma senha. Não crie nem compartilhe um Client Secret para esta configuração: o jogo usa um cliente OAuth do tipo **Aplicativo da Web** e o Client ID.

## 1. Criar e configurar o cliente OAuth do Google

1. Entre no [Google Cloud Console](https://console.cloud.google.com/) e crie um projeto para o jogo, ou selecione um projeto existente.
2. Abra [Google Auth Platform — Branding](https://console.cloud.google.com/auth/branding). Configure o nome do aplicativo, o e-mail de suporte e os campos solicitados.
3. Em **Audience/Público**, selecione **External/Externo** se os jogadores usarem contas Google pessoais. Durante os testes, mantenha o aplicativo em **Testing/Teste** e adicione em **Test users/Usuários de teste** cada conta Google que poderá entrar. Só usuários adicionados poderão autenticar enquanto o app estiver em teste.
4. Se o Console pedir domínios autorizados ou comprovação de propriedade, informe o domínio que será usado na etapa 2 e siga a solicitação de verificação do Google. Não informe um IP local (`192.168.x.x`) como domínio.
5. Abra [Google Auth Platform — Clients](https://console.cloud.google.com/auth/clients), clique em **Create client/Criar cliente** e escolha **Web application/Aplicativo da Web**.
6. Em **Authorized JavaScript origins/Origens JavaScript autorizadas**, adicione a origem exata que os jogadores abrirão no navegador:
   - Teste somente neste computador: `http://localhost:8080`
   - Rede local com HTTPS, usando os exemplos deste guia: `https://jogo.seudominio.com:8080`
7. Uma origem contém o protocolo, o nome e, se houver, a porta. **Não** acrescente caminho, como `/`, `/api` ou `/ws/game`. Não use um endereço `http://192.168...` para tentar autenticar a partir de outros dispositivos. O login do Google exige um contexto seguro; `localhost` é a exceção de desenvolvimento.
8. Não é necessário preencher **Authorized redirect URIs/URIs de redirecionamento** para o fluxo de login usado pelo jogo.
9. Crie o cliente e copie seu **Client ID**, que termina em `apps.googleusercontent.com`. Ele será configurado como `GOOGLE_CLIENT_ID`.

O jogo solicita somente os dados básicos de perfil e e-mail necessários para identificar o jogador. Não habilite APIs Google adicionais para este servidor.

## 2. Preparar um endereço HTTPS que funcione só dentro da LAN

Para testes rápidos, acesse o jogo como `http://localhost:8080` no próprio computador do servidor. **Não** compartilhe esse endereço com os outros dispositivos: neles, `localhost` aponta para o próprio celular ou computador. Também não basta trocar `localhost` pelo IP local usando HTTP; o login Google não funcionará assim.

Para jogar pela rede local e usar o login Google:

1. Escolha um domínio que você controla, por exemplo `seudominio.com`, e um nome para o servidor, por exemplo `jogo.seudominio.com`.
2. Reserve um IP para o computador do servidor no roteador (reserva DHCP). Isso evita que o endereço mude depois.
3. Obtenha um certificado HTTPS válido para `jogo.seudominio.com`, usando um provedor de certificados confiável pelo navegador. Uma opção para manter o serviço **restrito à LAN** é validar o domínio pelo desafio DNS-01 de uma autoridade ACME, como Let's Encrypt. Esse método comprova que você controla o domínio por um registro DNS temporário e não exige abrir o servidor para a internet.
4. Configure o DNS **local** da rede para que `jogo.seudominio.com` aponte para o IP privado reservado no passo 2. Use a função de DNS local do roteador, se disponível. Configure o mesmo nome no DNS de cada dispositivo ou, se necessário, no arquivo `hosts` de cada computador.
5. Exporte o certificado e sua chave privada para um arquivo PKCS#12 (`.p12` ou `.pfx`), com uma senha. Por exemplo, se sua ferramenta gerou `fullchain.pem` e `privkey.pem`, você pode gerar o arquivo com OpenSSL:

   ```powershell
   openssl pkcs12 -export -in "C:\certificados\fullchain.pem" -inkey "C:\certificados\privkey.pem" -out "C:\certificados\will-of-many.p12" -name server
   ```

   Guarde esse arquivo e a senha em local protegido. Se o certificado ou a chave forem substituídos/renovados, atualize o arquivo PKCS#12 e reinicie o servidor.

> Este arranjo usa um nome de domínio válido e um certificado confiável, mas o DNS local aponta para o endereço privado. Não configure redirecionamento de portas no roteador: para uma partida restrita à LAN, os jogadores não precisam acessar o servidor pela internet. A renovação automática por DNS-01 depende do provedor DNS e do cliente ACME que você escolher.

## 3. Abrir a porta do servidor somente para a rede privada

O servidor escuta por padrão na porta `8080` e em todas as interfaces de rede do computador. No Windows, abra o PowerShell **como administrador** e crie uma regra limitada ao perfil de rede privada e à sub-rede local:

```powershell
New-NetFirewallRule `
  -DisplayName "Will of Many — rede local" `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort 8080 `
  -Profile Private `
  -RemoteAddress LocalSubnet
```

No Windows, confira se a rede doméstica está marcada como **Privada**, e não como **Pública**. Não desligue o firewall e não crie uma regra para todos os perfis ou para todas as redes.

O servidor e os jogadores também precisam estar na mesma rede local e na mesma sub-rede. Uma rede Wi-Fi de convidados, ou uma opção de isolamento de dispositivos no roteador, pode impedir a comunicação entre eles.

## 4. Iniciar o servidor

No PowerShell, abra a pasta que contém `WillOfManyServer.exe` (normalmente `server-app\dist\WillOfManyServer`) e execute:

```powershell
$env:GOOGLE_CLIENT_ID = "COLE_AQUI_O_CLIENT_ID.apps.googleusercontent.com"
$env:TLS_ENABLED = "true"
$env:TLS_KEY_STORE = "C:\certificados\will-of-many.p12"
$env:TLS_KEY_STORE_TYPE = "PKCS12"
$env:TLS_KEY_STORE_PASSWORD = [System.Net.NetworkCredential]::new(
  "",
  (Read-Host "Senha do certificado" -AsSecureString)
).Password

.\WillOfManyServer.exe
```

Substitua o Client ID e o caminho do certificado pelos valores reais. A senha é solicitada sem aparecer enquanto você digita. Os valores definidos com `$env:` valem para essa janela do PowerShell; inicie o servidor novamente dessa mesma janela após reiniciar o computador. **Mantenha a janela aberta** enquanto estiver jogando.

Se preferir executar o JAR, use Java 17 ou superior e defina as mesmas variáveis de ambiente antes de iniciar `start-server.bat` na pasta `server-app`. Esse script inicia o JAR; ele não inicia o executável independente.

O endereço para os jogadores será:

```text
https://jogo.seudominio.com:8080
```

O endereço deve usar o mesmo nome incluído no certificado e na origem JavaScript autorizada do Google. Não distribua o arquivo `.p12`, a chave privada ou a senha do certificado aos jogadores.

## 5. Conectar os jogadores

1. No computador de cada jogador, confira que `jogo.seudominio.com` resolve para o IP privado do servidor. Por exemplo, no PowerShell:

   ```powershell
   Resolve-DnsName jogo.seudominio.com
   ```

2. Com o servidor em execução, abra `https://jogo.seudominio.com:8080` no navegador.
3. Na tela de novo jogo, selecione **Online** e entre com uma conta incluída como usuária de teste no Google Auth Platform.
4. Aguarde o matchmaking encontrar outro jogador.

Todos devem abrir exatamente o mesmo endereço HTTPS. O jogo e a partida em tempo real (WebSocket) usam esse mesmo host e porta.

## 6. Conferir se está funcionando

- Abra `https://jogo.seudominio.com:8080/api/config`. A resposta deve conter o `googleClientId` configurado.
- A página do jogo deve carregar com uma conexão segura, sem aviso de certificado inválido.
- No navegador, a opção de entrar com Google deve aparecer e permitir autenticação de um usuário de teste.
- Depois que dois jogadores entrarem na fila, ambos devem encontrar a mesma partida.
- Em outro computador da LAN, teste a porta com:

  ```powershell
  Test-NetConnection jogo.seudominio.com -Port 8080
  ```

  O resultado esperado é `TcpTestSucceeded : True`.

## Solução de problemas

- **O jogo informa que falta `GOOGLE_CLIENT_ID`:** encerre e inicie o servidor de novo na janela em que definiu `$env:GOOGLE_CLIENT_ID`. Confira também `/api/config`.
- **“origin is not allowed” no login:** adicione ao cliente OAuth a origem exata aberta no navegador, incluindo `https://` e `:8080`, sem caminho; reinicie o servidor após mudar a configuração.
- **O Google diz que o usuário não pode entrar:** enquanto o público estiver em modo de teste, adicione a conta em **Test users/Usuários de teste**.
- **Aviso de certificado ou erro de contexto seguro:** confira se o nome do endereço corresponde ao certificado, se a cadeia do certificado é confiável e se a data/hora do dispositivo estão corretas. Não prossiga ignorando o aviso.
- **A página abre no servidor, mas não em outro dispositivo:** confira a rede Wi-Fi, o IP reservado, o DNS local, o perfil Privado do Windows e a regra de firewall.
- **A página abre, mas a partida não conecta:** confirme que todos abriram o mesmo endereço e porta e que nenhum proxy, firewall ou roteador está bloqueando WebSockets.
- **Alterou uma variável de ambiente:** reinicie o processo do servidor; as configurações são lidas na inicialização.

## Dados e observações

- Os perfis e o Elo são guardados no banco H2 em `data\will-of-many.mv.db`, relativo à pasta de trabalho de onde o servidor foi iniciado. Mantenha essa pasta entre inicializações e faça cópias de segurança com o servidor parado.
- Fila, partidas e sessões de login ficam em memória. Elas são reiniciadas quando o processo do servidor é encerrado; perfis e Elo continuam salvos no banco.
- Esta versão valida a identidade Google e retransmite as ações de jogo para partidas casuais em LAN. O servidor não valida todas as regras do tabuleiro de forma autoritativa e não deve ser exposto publicamente como proteção contra trapaça.
