const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let springBootProcess;

// Spring Boot 서버 실행
function startSpringBoot() {
    const javaPath = path.join(
        process.resourcesPath,
        'jre/amazon-corretto-17.0.17.10.1-windows-x64-jdk/jdk17.0.17_10/bin/java.exe',
    );
    const jarPath = path.join(process.resourcesPath, 'server/build/libs/meeting-0.0.1-SNAPSHOT.jar');

    springBootProcess = spawn(javaPath, ['-jar', jarPath], {
        cwd: path.dirname(jarPath),
    });

    springBootProcess.stdout.on('data', (data) => {
        console.log(`Spring Boot: ${data}`);
    });

    springBootProcess.stderr.on('data', (data) => {
        console.error(`Spring Boot Error: ${data}`);
    });
}

// Electron 윈도우 생성
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // 개발 모드: Vite 개발 서버
    // 프로덕션 모드: 빌드된 파일
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../../dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    // 개발자 도구 열기 (테스트 빌드일 때만)
    if (process.env.ENABLE_DEV_TOOLS === 'true') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('close', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    startSpringBoot();

    // 서버 5초 대기
    setTimeout(() => {
        createWindow();
    }, 5000);
});

app.on('window-all-closed', () => {
    if (springBootProcess) {
        springBootProcess.kill();
    }
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
