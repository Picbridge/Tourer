@echo off
setlocal

:: Start the emulator
start "" "%ANDROID_HOME%\emulator\emulator.exe" @Pixel_8_Pro_API_30

:: Wait for the specific log message to appear
echo "Emulator Booting started..."

:loop
"%ANDROID_HOME%\platform-tools\adb" logcat -d | findstr /C:"boot_complete"
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto loop
)
:: Print a log message
echo "Emulator Booted Successfully!"

:: Run the React Native app
npx react-native run-android

echo "React Native app started!"