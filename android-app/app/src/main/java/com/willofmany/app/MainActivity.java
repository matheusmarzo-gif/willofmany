package com.willofmany.app;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialException;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private static final String TAG = "WillOfManyBluetooth";
    private static final String ONLINE_GAME_URL = "https://willofmany-game.onrender.com/?mode=online";
    private static final int REQUEST_ENABLE_BLUETOOTH = 1001;
    private static final int REQUEST_DISCOVERABLE = 1002 ;
    private static final int REQUEST_BLUETOOTH_PERMISSIONS = 1003;
    private static final int MAX_MESSAGE_LENGTH = 1_000_000;
    private static final UUID GAME_UUID = UUID.fromString("a81656dc-c28f-4c8a-a2b7-2a180a5f47d1");

    private final Object connectionLock = new Object();
    private final Map<String, JSONObject> discoveredDevices = new LinkedHashMap<>();
    private final ExecutorService bluetoothSendExecutor = Executors.newSingleThreadExecutor();
    private CredentialManager credentialManager;
    private WebView webView;
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothServerSocket serverSocket;
    private BluetoothSocket bluetoothSocket;
    private BufferedWriter bluetoothWriter;
    private String pendingBluetoothAction;
    private String pendingDeviceAddress;
    private boolean discoveryReceiverRegistered;
    private volatile boolean destroyed;
    private volatile boolean bluetoothRoomRequested;

    private final BroadcastReceiver discoveryReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice.class);
                } else {
                    device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                }
                if (device != null) addDiscoveredDevice(device);
            } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                emitStatus("Busca concluída.");
                emitDiscoveredDevices();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideSystemUi();
        credentialManager = CredentialManager.create(this);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        webView.addJavascriptInterface(new BluetoothBridge(), "AndroidBluetooth");
        webView.addJavascriptInterface(new GoogleSignInBridge(), "AndroidGoogleSignIn");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (isBundledGameUrl(url)) {
                    view.addJavascriptInterface(new BluetoothBridge(), "AndroidBluetooth");
                } else if (!isHostedGameUrl(url)) {
                    view.stopLoading();
                    view.loadUrl("file:///android_asset/index.html");
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                String url = request.getUrl().toString();
                return !isBundledGameUrl(url) && !isHostedGameUrl(url);
            }
        });
        webView.setWebChromeClient(new WebChromeClient());
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    private boolean isBundledGameUrl(String url) {
        return url != null && url.startsWith("file:///android_asset/");
    }

    private boolean isHostedGameUrl(String url) {
        if (url == null) return false;
        Uri uri = Uri.parse(url);
        return "https".equals(uri.getScheme()) &&
            "willofmany-game.onrender.com".equals(uri.getHost()) &&
            (uri.getPort() == -1 || uri.getPort() == 443) &&
            uri.getUserInfo() == null;
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemUi();
    }

    private void hideSystemUi() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );
    }

    private final class BluetoothBridge {
        @JavascriptInterface
        public void closeApp() {
            runOnUiThread(() -> {
                if (!destroyed) finish();
            });
        }

        @JavascriptInterface
        public void openOnlineGame() {
            runOnUiThread(() -> {
                if (webView != null && !destroyed) {
                    webView.loadUrl(ONLINE_GAME_URL);
                }
            });
        }

        @JavascriptInterface
        public String readGameAsset(String fileName) {
            if (!"regioes-will-of-many-circular.json".equals(fileName) &&
                !"tabuleiro-01.json".equals(fileName) &&
                !"tabuleiro-02.json".equals(fileName) &&
                !"tabuleiro-03.json".equals(fileName) &&
                !"tabuleiro-04.json".equals(fileName) &&
                !"tabuleiro-05.json".equals(fileName) &&
                !"tabuleiro-06.json".equals(fileName) &&
                !"tabuleiro-07.json".equals(fileName)) {
                Log.w(TAG, "Rejeitando arquivo de tabuleiro não permitido: " + fileName);
                return "";
            }
            try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(getAssets().open(fileName), StandardCharsets.UTF_8)
            )) {
                StringBuilder contents = new StringBuilder();
                char[] buffer = new char[4096];
                int length;
                while ((length = reader.read(buffer)) != -1) {
                    contents.append(buffer, 0, length);
                }
                return contents.toString();
            } catch (IOException error) {
                Log.e(TAG, "Não foi possível ler o JSON do tabuleiro empacotado.", error);
                return "";
            }
        }

        @JavascriptInterface
        public void createRoom() {
            runOnUiThread(() -> beginBluetoothAction("create", null));
        }

        @JavascriptInterface
        public void discover() {
            runOnUiThread(() -> beginBluetoothAction("discover", null));
        }

        @JavascriptInterface
        public void connect(String address) {
            runOnUiThread(() -> beginBluetoothAction("connect", address));
        }

        @JavascriptInterface
        public void send(String message) {
            if (message == null || message.length() > MAX_MESSAGE_LENGTH) {
                emitError("A mensagem Bluetooth excede o tamanho permitido.");
                return;
            }
            bluetoothSendExecutor.execute(() -> writeMessage(message));
        }

        @JavascriptInterface
        public void disconnect() {
            runOnUiThread(() -> {
                pendingBluetoothAction = null;
                pendingDeviceAddress = null;
                closeConnection(true);
            });
        }
    }

    private final class GoogleSignInBridge {
        @JavascriptInterface
        public void signInWithGoogle(String serverClientId) {
            if (serverClientId == null ||
                serverClientId.length() > 256 ||
                !serverClientId.endsWith(".apps.googleusercontent.com")) {
                emitGoogleSignInResult("error", null, "A configuração de login Google do servidor é inválida.");
                return;
            }
            runOnUiThread(() -> requestGoogleCredential(serverClientId));
        }
    }

    private void requestGoogleCredential(String serverClientId) {
        if (destroyed || webView == null || !isHostedGameUrl(webView.getUrl())) return;

        GetSignInWithGoogleOption googleOption =
            new GetSignInWithGoogleOption.Builder(serverClientId).build();
        GetCredentialRequest request = new GetCredentialRequest.Builder()
            .addCredentialOption(googleOption)
            .build();
        credentialManager.getCredentialAsync(
            this,
            request,
            null,
            getMainExecutor(),
            new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override
                public void onResult(GetCredentialResponse response) {
                    Credential credential = response.getCredential();
                    if (!(credential instanceof CustomCredential) ||
                        !GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(
                            ((CustomCredential) credential).getType()
                        )) {
                        emitGoogleSignInResult("error", null, "O Android retornou uma credencial Google incompatível.");
                        return;
                    }
                    try {
                        GoogleIdTokenCredential googleCredential =
                            GoogleIdTokenCredential.createFrom(credential.getData());
                        emitGoogleSignInResult("success", googleCredential.getIdToken(), null);
                    } catch (Exception error) {
                        Log.e(TAG, "Could not read Google ID token credential", error);
                        emitGoogleSignInResult("error", null, "Não foi possível ler a credencial Google.");
                    }
                }

                @Override
                public void onError(GetCredentialException error) {
                    String message = error.getMessage();
                    boolean cancelled = error.getClass().getSimpleName().toLowerCase()
                        .contains("cancel");
                    emitGoogleSignInResult(
                        cancelled ? "cancelled" : "error",
                        null,
                        cancelled ? null : (message == null || message.isBlank()
                            ? "O Android não conseguiu autenticar a conta Google."
                            : message)
                    );
                }
            }
        );
    }

    private void emitGoogleSignInResult(String type, String idToken, String message) {
        runOnUiThread(() -> {
            if (webView == null || destroyed || !isHostedGameUrl(webView.getUrl())) return;
            JSONObject result = new JSONObject();
            try {
                result.put("type", type);
                if (idToken != null) result.put("idToken", idToken);
                if (message != null) result.put("message", message);
            } catch (JSONException error) {
                Log.e(TAG, "Could not create Google sign-in result", error);
                return;
            }
            webView.evaluateJavascript(
                "window.onAndroidGoogleSignIn && window.onAndroidGoogleSignIn(" +
                    JSONObject.quote(result.toString()) + ");",
                null
            );
        });
    }

    private void beginBluetoothAction(String action, String address) {
        if (bluetoothAdapter == null) {
            emitError("Este aparelho não possui Bluetooth.");
            return;
        }
        pendingBluetoothAction = action;
        pendingDeviceAddress = address;
        if (!hasBluetoothPermissions()) {
            requestPermissions(requiredBluetoothPermissions(), REQUEST_BLUETOOTH_PERMISSIONS);
            emitStatus("Permita o acesso ao Bluetooth para continuar.");
            return;
        }
        continueBluetoothAction();
    }

    private String[] requiredBluetoothPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return new String[] {
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN,
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.BLUETOOTH_ADVERTISE
            };
        }
        return new String[] {
            Manifest.permission.BLUETOOTH,
            Manifest.permission.BLUETOOTH_ADMIN,
            Manifest.permission.ACCESS_FINE_LOCATION
        };
    }

    private boolean hasBluetoothPermissions() {
        for (String permission : requiredBluetoothPermissions()) {
            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) return false;
        }
        return true;
    }

    private void continueBluetoothAction() {
        if (bluetoothAdapter == null || pendingBluetoothAction == null) return;
        try {
            if (!bluetoothAdapter.isEnabled()) {
                startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), REQUEST_ENABLE_BLUETOOTH);
                return;
            }
            if ("create".equals(pendingBluetoothAction)) {
                Intent discoverableIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
                discoverableIntent.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
                startActivityForResult(discoverableIntent, REQUEST_DISCOVERABLE);
            } else if ("discover".equals(pendingBluetoothAction)) {
                startDiscovery();
            } else if ("connect".equals(pendingBluetoothAction)) {
                connectToDevice(pendingDeviceAddress);
            }
        } catch (SecurityException error) {
            pendingBluetoothAction = null;
            emitError("Não foi possível acessar o Bluetooth: " + error.getMessage());
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != REQUEST_BLUETOOTH_PERMISSIONS) return;
        for (int result : grantResults) {
            if (result != PackageManager.PERMISSION_GRANTED) {
                pendingBluetoothAction = null;
                pendingDeviceAddress = null;
                emitError("A permissão de Bluetooth foi negada.");
                return;
            }
        }
        if (!hasBluetoothPermissions()) {
            pendingBluetoothAction = null;
            pendingDeviceAddress = null;
            emitError("As permissões de Bluetooth necessárias não foram concedidas.");
            return;
        }
        continueBluetoothAction();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_ENABLE_BLUETOOTH) {
            if (resultCode == Activity.RESULT_OK) {
                continueBluetoothAction();
            } else {
                pendingBluetoothAction = null;
                emitError("O Bluetooth precisa estar ligado para jogar.");
            }
        } else if (requestCode == REQUEST_DISCOVERABLE) {
            if (resultCode > 0 && "create".equals(pendingBluetoothAction)) {
                pendingBluetoothAction = null;
                startServer();
            } else {
                pendingBluetoothAction = null;
                emitError("A visibilidade Bluetooth foi recusada.");
            }
        }
    }

    private void startServer() {
        closeConnection(false);
        bluetoothRoomRequested = true;
        new Thread(() -> {
            boolean roomReadyReported = false;
            while (!destroyed && bluetoothRoomRequested) {
                BluetoothServerSocket listeningSocket;
                try {
                    listeningSocket = bluetoothAdapter.listenUsingRfcommWithServiceRecord("Will of Many", GAME_UUID);
                } catch (IOException | SecurityException error) {
                    bluetoothRoomRequested = false;
                    Log.e(TAG, "Could not create Bluetooth RFCOMM server socket", error);
                    if (!destroyed) {
                        String message = error instanceof SecurityException
                            ? "Permissão Bluetooth ausente. Atualize/reinstale o app e permita Dispositivos próximos nas configurações."
                            : "Não foi possível abrir a sala Bluetooth: " + error.getMessage();
                        emitError(message);
                    }
                    return;
                }
                synchronized (connectionLock) {
                    serverSocket = listeningSocket;
                }
                if (!roomReadyReported) {
                    roomReadyReported = true;
                    emitStatus("Sala criada. Deixe este aparelho visível enquanto o outro jogador busca partidas.");
                }
                try {
                    BluetoothSocket acceptedSocket = listeningSocket.accept();
                    bluetoothRoomRequested = false;
                    closeServerSocket(listeningSocket);
                    attachConnection(acceptedSocket);
                    return;
                } catch (IOException error) {
                    closeServerSocket(listeningSocket);
                    if (!bluetoothRoomRequested || destroyed) return;
                    Log.w(TAG, "Bluetooth room accept interrupted; restarting listener", error);
                    emitStatus("Uma tentativa de conexão foi interrompida. A sala continua ativa; tentando novamente.");
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException interrupted) {
                        Thread.currentThread().interrupt();
                        bluetoothRoomRequested = false;
                        return;
                    }
                } catch (SecurityException error) {
                    bluetoothRoomRequested = false;
                    closeServerSocket(listeningSocket);
                    emitError("Não foi possível abrir a sala Bluetooth: " + error.getMessage());
                    return;
                }
            }
        }, "Bluetooth-server").start();
    }

    private void startDiscovery() {
        try {
            stopDiscovery();
            discoveredDevices.clear();
            for (BluetoothDevice device : bluetoothAdapter.getBondedDevices()) {
                addDiscoveredDevice(device);
            }
            IntentFilter filter = new IntentFilter();
            filter.addAction(BluetoothDevice.ACTION_FOUND);
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(discoveryReceiver, filter, Context.RECEIVER_EXPORTED);
            } else {
                registerReceiver(discoveryReceiver, filter);
            }
            discoveryReceiverRegistered = true;
            emitDiscoveredDevices();
            if (!bluetoothAdapter.startDiscovery()) {
                pendingBluetoothAction = null;
                stopDiscovery();
                emitError("O aparelho não conseguiu iniciar a busca Bluetooth.");
                return;
            }
            pendingBluetoothAction = null;
            emitStatus("Buscando aparelhos próximos...");
        } catch (SecurityException error) {
            emitError("Falha ao buscar aparelhos Bluetooth: " + error.getMessage());
        }
    }

    private void addDiscoveredDevice(BluetoothDevice device) {
        try {
            String address = device.getAddress();
            JSONObject entry = new JSONObject();
            String name = device.getName();
            entry.put("address", address);
            entry.put("name", name == null || name.trim().isEmpty() ? address : name);
            discoveredDevices.put(address, entry);
            emitDiscoveredDevices();
        } catch (JSONException | SecurityException error) {
            emitError("Não foi possível ler um aparelho encontrado: " + error.getMessage());
        }
    }

    private void emitDiscoveredDevices() {
        JSONArray devices = new JSONArray();
        for (JSONObject device : discoveredDevices.values()) devices.put(device);
        JSONObject event = new JSONObject();
        try {
            event.put("type", "devices");
            event.put("devices", devices);
        } catch (JSONException error) {
            Log.e(TAG, "Could not create Bluetooth device list event", error);
            return;
        }
        emit(event);
    }

    private void connectToDevice(String address) {
        if (address == null || address.trim().isEmpty()) {
            emitError("Selecione um aparelho válido.");
            return;
        }
        pendingBluetoothAction = null;
        pendingDeviceAddress = null;
        stopDiscovery();
        emitStatus("Conectando ao anfitrião...");
        new Thread(() -> {
            BluetoothSocket clientSocket = null;
            try {
                BluetoothDevice device = bluetoothAdapter.getRemoteDevice(address);
                clientSocket = device.createRfcommSocketToServiceRecord(GAME_UUID);
                bluetoothAdapter.cancelDiscovery();
                clientSocket.connect();
                attachConnection(clientSocket);
            } catch (IOException | SecurityException error) {
                if (clientSocket != null) {
                    try {
                        clientSocket.close();
                    } catch (IOException closeError) {
                        Log.e(TAG, "Could not close failed Bluetooth socket", closeError);
                    }
                }
                emitError("Não foi possível conectar ao anfitrião: " + error.getMessage());
            }
        }, "Bluetooth-client").start();
    }

    private void attachConnection(BluetoothSocket connectedSocket) {
        try {
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(connectedSocket.getInputStream(), StandardCharsets.UTF_8));
            BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(connectedSocket.getOutputStream(), StandardCharsets.UTF_8));
            synchronized (connectionLock) {
                bluetoothSocket = connectedSocket;
                bluetoothWriter = writer;
            }
            emitSimpleEvent("connected");
            emitStatus("Bluetooth conectado.");
            new Thread(() -> readMessages(connectedSocket, reader), "Bluetooth-reader").start();
        } catch (IOException error) {
            try {
                connectedSocket.close();
            } catch (IOException closeError) {
                Log.e(TAG, "Could not close uninitialized Bluetooth socket", closeError);
            }
            emitError("Não foi possível preparar a conexão Bluetooth: " + error.getMessage());
        }
    }

    private void readMessages(BluetoothSocket sourceSocket, BufferedReader reader) {
        try {
            String line;
            while (!destroyed && (line = reader.readLine()) != null) {
                if (line.length() > MAX_MESSAGE_LENGTH) {
                    emitError("O outro aparelho enviou uma mensagem grande demais.");
                    break;
                }
                JSONObject event = new JSONObject();
                event.put("type", "message");
                event.put("message", line);
                emit(event);
            }
        } catch (IOException | JSONException error) {
            if (!destroyed) emitError("A conexão Bluetooth foi interrompida: " + error.getMessage());
        } finally {
            boolean wasCurrent;
            synchronized (connectionLock) {
                wasCurrent = bluetoothSocket == sourceSocket;
            }
            if (wasCurrent) closeConnection(true);
        }
    }

    private void writeMessage(String message) {
        try {
            synchronized (connectionLock) {
                if (bluetoothWriter == null || bluetoothSocket == null || !bluetoothSocket.isConnected()) {
                    emitError("Não há uma conexão Bluetooth ativa.");
                    return;
                }
                bluetoothWriter.write(message);
                bluetoothWriter.newLine();
                bluetoothWriter.flush();
            }
        } catch (IOException | SecurityException error) {
            emitError("Falha ao enviar dados pelo Bluetooth: " + error.getMessage());
            closeConnection(true);
        }
    }

    private void closeConnection(boolean notify) {
        bluetoothRoomRequested = false;
        BluetoothSocket socket;
        synchronized (connectionLock) {
            socket = bluetoothSocket;
            bluetoothSocket = null;
            bluetoothWriter = null;
        }
        if (socket != null) {
            try {
                socket.close();
            } catch (IOException error) {
                Log.e(TAG, "Could not close Bluetooth connection", error);
                emitError("Falha ao encerrar a conexão Bluetooth: " + error.getMessage());
            }
            if (notify) emitSimpleEvent("disconnected");
        }
        stopDiscovery();
        closeServerSocket();
    }

    private void closeServerSocket() {
        BluetoothServerSocket listeningSocket;
        synchronized (connectionLock) {
            listeningSocket = serverSocket;
            serverSocket = null;
        }
        closeServerSocket(listeningSocket);
    }

    private void closeServerSocket(BluetoothServerSocket listeningSocket) {
        if (listeningSocket == null) return;
        synchronized (connectionLock) {
            if (serverSocket == listeningSocket) serverSocket = null;
        }
        try {
            listeningSocket.close();
        } catch (IOException error) {
            Log.e(TAG, "Could not close Bluetooth room socket", error);
            emitError("Falha ao fechar a sala Bluetooth: " + error.getMessage());
        }
    }

    private void stopDiscovery() {
        if (bluetoothAdapter != null) {
            try {
                if (bluetoothAdapter.isDiscovering()) bluetoothAdapter.cancelDiscovery();
            } catch (SecurityException error) {
                emitError("Não foi possível parar a busca Bluetooth: " + error.getMessage());
            }
        }
        if (discoveryReceiverRegistered) {
            try {
                unregisterReceiver(discoveryReceiver);
            } catch (IllegalArgumentException error) {
                Log.e(TAG, "Bluetooth discovery receiver was not registered", error);
            }
            discoveryReceiverRegistered = false;
        }
    }

    private void emitStatus(String message) {
        emitTextEvent("status", "message", message);
    }

    private void emitError(String message) {
        emitTextEvent("error", "message", message);
    }

    private void emitSimpleEvent(String type) {
        emitTextEvent(type, null, null);
    }

    private void emitTextEvent(String type, String key, String value) {
        JSONObject event = new JSONObject();
        try {
            event.put("type", type);
            if (key != null) event.put(key, value);
        } catch (JSONException error) {
            Log.e(TAG, "Could not create Bluetooth event", error);
            return;
        }
        emit(event);
    }

    private void emit(JSONObject event) {
        runOnUiThread(() -> {
            if (webView == null || destroyed) return;
            String safeJson = JSONObject.quote(event.toString());
            webView.evaluateJavascript(
                "window.onBluetoothEvent && window.onBluetoothEvent(" + safeJson + ");",
                null
            );
        });
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        destroyed = true;
        bluetoothRoomRequested = false;
        bluetoothSendExecutor.shutdownNow();
        stopDiscovery();
        closeConnection(false);
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidBluetooth");
            webView.destroy();
        }
        super.onDestroy();
    }
}
