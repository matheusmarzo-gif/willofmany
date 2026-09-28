# Will of Many para Android

Este projeto empacota o [index.html](../index.html) atual em um aplicativo Android usando `WebView`.

## Abrir no Android Studio

Abra esta pasta (`android-app`) no Android Studio e aguarde a sincronização do Gradle. Execute o módulo `app` em um dispositivo ou emulador Android.

Durante o build, a tarefa `prepareWebAssets` copia automaticamente o HTML, o módulo `will-of-many-ai.js`, as imagens e os arquivos JSON da pasta principal para os assets do APK. A versão web continua sendo executada diretamente pelo `index.html`.

Importante: abra a pasta `android-app` como projeto no Android Studio e execute um novo **Build > Clean Project** seguido de **Build > Rebuild Project** antes de instalar novamente o APK. Isso garante que os assets sejam regenerados.

O jogo inicia na tela de menu. Em **Novo jogo**, escolha entre jogar contra a IA, jogar com duas pessoas no mesmo aparelho ou jogar por Bluetooth. O modo Bluetooth funciona no aplicativo Android e usa Bluetooth clássico RFCOMM; a versão aberta diretamente no navegador oferece apenas os modos sem Bluetooth.

No Android, o jogo abre em tela cheia e com orientação horizontal. No celular, o tabuleiro ocupa a área principal, os detalhes da região e as peças para compra aparecem em faixas sobrepostas, e os controles de rotação, turno, estatísticas e guerra ficam nas laterais.

## Partida por Bluetooth

1. Instale e abra o app nos dois aparelhos Android e mantenha o Bluetooth ligado.
2. No aparelho anfitrião, escolha **Novo jogo > Bluetooth**, selecione a velocidade e toque em **Criar sala Bluetooth**. Conceda as permissões solicitadas e aceite deixar o aparelho visível.
3. No outro aparelho, escolha **Novo jogo > Bluetooth > Buscar partidas**, selecione o anfitrião encontrado e aceite o pareamento/conexão do Android, se solicitado.
4. O anfitrião joga como Laranja e começa; o convidado joga como Azul. A visão acompanha a região de cada ação, e compra, movimento, promoção e rotação são enviados imediatamente para que o outro aparelho os acompanhe. O estado do turno também é sincronizado ao passar a vez.

O Android pede permissões de dispositivos próximos (e localização em versões Android 11 ou anteriores, necessária para descoberta Bluetooth). A permissão de visibilidade do anfitrião é temporária; se a busca não encontrar o aparelho, toque novamente em **Buscar partidas** enquanto a sala ainda estiver visível.

**Continuar jogo** usa o salvamento local do WebView. Uma partida Bluetooth ativa depende de ambos os aparelhos permanecerem conectados; se a conexão cair, a partida atual é bloqueada e será necessário reiniciar o app e criar uma nova sala.

## Gerar APK

No Android Studio, use **Build > Build App Bundle(s) / APK(s) > Build APK(s)**.
