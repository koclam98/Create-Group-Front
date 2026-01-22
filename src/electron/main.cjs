const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let springBootProcess;
let logFilePath;

// Spring Boot 서버 실행
function startSpringBoot() {
    // 로그 파일 경로 설정
    const logDir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    logFilePath = path.join(logDir, 'spring-boot.log');

    // 로그 파일 초기화
    fs.writeFileSync(logFilePath, `=== Spring Boot Log (${new Date().toISOString()}) ===\n`);

    const javaPath = path.join(
        process.resourcesPath,
        'jre/amazon-corretto-17.0.17.10.1-windows-x64-jdk/jdk17.0.17_10/bin/java.exe',
    );
    const jarPath = path.join(process.resourcesPath, 'server/build/libs/meeting-0.0.1-SNAPSHOT.jar');

    const writeLog = (message) => {
        const logMessage = `[${new Date().toISOString()}] ${message}\n`;
        fs.appendFileSync(logFilePath, logMessage);
        console.log(message);
    };

    writeLog(`Java Path: ${javaPath}`);
    writeLog(`JAR Path: ${jarPath}`);
    writeLog(`Resources Path: ${process.resourcesPath}`);
    writeLog(`Java exists: ${fs.existsSync(javaPath)}`);
    writeLog(`JAR exists: ${fs.existsSync(jarPath)}`);
    writeLog(`Log file path: ${logFilePath}`);

    springBootProcess = spawn(javaPath, ['-jar', jarPath], {
        cwd: path.dirname(jarPath),
    });

    springBootProcess.on('error', (error) => {
        writeLog(`Failed to start Spring Boot: ${error.message}`);
        writeLog(`Error stack: ${error.stack}`);
    });

    springBootProcess.stdout.on('data', (data) => {
        writeLog(`Spring Boot: ${data.toString()}`);
    });

    springBootProcess.stderr.on('data', (data) => {
        writeLog(`Spring Boot Error: ${data.toString()}`);
    });

    springBootProcess.on('close', (code) => {
        writeLog(`Spring Boot process exited with code ${code}`);
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

    // 개발자 도구 열기 (환경 변수로 제어)
    if (process.env.ENABLE_DEV_TOOLS === 'true') {
        mainWindow.webContents.openDevTools();
    }

    // 윈도우가 로드되면 로그 파일 경로를 콘솔에 표시
    mainWindow.webContents.on('did-finish-load', () => {
        // 페이지 로드 후 포커스 설정
        setTimeout(() => {
            mainWindow.focus();
            mainWindow.webContents.focus();
        }, 100);

        if (logFilePath) {
            const escapedPath = logFilePath.replace(/\\/g, '\\\\');
            mainWindow.webContents.executeJavaScript(`
                console.log('%c===========================================', 'color: blue; font-weight: bold;');
                console.log('%c📋 서버 로그 파일 위치', 'color: blue; font-weight: bold; font-size: 16px;');
                console.log('%c===========================================', 'color: blue; font-weight: bold;');
                console.log('%c${escapedPath}', 'color: green; font-size: 14px; background: #f0f0f0; padding: 5px;');
                console.log('%c===========================================', 'color: blue; font-weight: bold;');
                console.log('%c탐색기에서 위 경로를 열어서 spring-boot.log 파일을 확인하세요.', 'color: orange; font-size: 12px;');
                console.log('%c===========================================', 'color: blue; font-weight: bold;');
            `).catch(err => console.error('Failed to show log path:', err));
        }
    });

    // 페이지 네비게이션 시에도 포커스 복구
    mainWindow.webContents.on('did-navigate', () => {
        setTimeout(() => {
            mainWindow.focus();
            mainWindow.webContents.focus();
        }, 100);
    });

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
