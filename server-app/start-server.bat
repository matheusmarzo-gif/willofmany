@echo off
setlocal
cd /d "%~dp0"
if not exist "build\libs\will-of-many-server-1.0.0.jar" (
  echo Server JAR not found. Build it first with gradlew.bat bootJar.
  exit /b 1
)
if "%GOOGLE_CLIENT_ID%"=="" (
  set /p GOOGLE_CLIENT_ID=Google OAuth Web client ID: 
)
java -jar "build\libs\will-of-many-server-1.0.0.jar"
