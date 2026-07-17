Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "StrFunc.nsh"
${StrRep}

Name "La Vigie"
OutFile "Installer-Diagnostic-Sante.exe"
InstallDir "$LOCALAPPDATA\DiagnosticSante"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "La Vigie — pilotage financier"

!define MUI_ICON "app.ico"
!define MUI_UNICON "app.ico"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Lancer le diagnostic maintenant"
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchApp"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "French"

Var Browser      ; chemin exe navigateur (vide si aucun)
Var AppArgs      ; arguments --app="file:///..."

; Détecte Edge puis Chrome, prépare la commande de lancement en mode fenêtre
Function DetectBrowser
  StrCpy $Browser ""
  ${If} ${FileExists} "$PROGRAMFILES32\Microsoft Edge\Application\msedge.exe"
    StrCpy $Browser "$PROGRAMFILES32\Microsoft Edge\Application\msedge.exe"
  ${ElseIf} ${FileExists} "$PROGRAMFILES64\Microsoft Edge\Application\msedge.exe"
    StrCpy $Browser "$PROGRAMFILES64\Microsoft Edge\Application\msedge.exe"
  ${ElseIf} ${FileExists} "$PROGRAMFILES64\Google\Chrome\Application\chrome.exe"
    StrCpy $Browser "$PROGRAMFILES64\Google\Chrome\Application\chrome.exe"
  ${ElseIf} ${FileExists} "$PROGRAMFILES32\Google\Chrome\Application\chrome.exe"
    StrCpy $Browser "$PROGRAMFILES32\Google\Chrome\Application\chrome.exe"
  ${ElseIf} ${FileExists} "$LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    StrCpy $Browser "$LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  ${EndIf}
  ; chemin html en URL file:/// (slashes avant)
  ${StrRep} $0 "$INSTDIR" "\" "/"
  StrCpy $AppArgs '--app="file:///$0/Diagnostic-Sante-Resto-Hotel.html" --user-data-dir="$INSTDIR\profil" --window-size=1180,860'
FunctionEnd

Function LaunchApp
  ${If} $Browser != ""
    Exec '"$Browser" $AppArgs'
  ${Else}
    ExecShell "open" "$INSTDIR\Diagnostic-Sante-Resto-Hotel.html"
  ${EndIf}
FunctionEnd

Section "Application"
  SetOutPath "$INSTDIR"
  File /oname=Diagnostic-Sante-Resto-Hotel.html "app.html"
  File /oname=app.ico "app.ico"
  Call DetectBrowser

  ${If} $Browser != ""
    CreateShortCut "$DESKTOP\La Vigie.lnk" "$Browser" "$AppArgs" "$INSTDIR\app.ico" 0
    CreateDirectory "$SMPROGRAMS\La Vigie"
    CreateShortCut "$SMPROGRAMS\La Vigie\La Vigie.lnk" "$Browser" "$AppArgs" "$INSTDIR\app.ico" 0
  ${Else}
    CreateShortCut "$DESKTOP\La Vigie.lnk" "$INSTDIR\Diagnostic-Sante-Resto-Hotel.html" "" "$INSTDIR\app.ico" 0
    CreateDirectory "$SMPROGRAMS\La Vigie"
    CreateShortCut "$SMPROGRAMS\La Vigie\La Vigie.lnk" "$INSTDIR\Diagnostic-Sante-Resto-Hotel.html" "" "$INSTDIR\app.ico" 0
  ${EndIf}
  CreateShortCut "$SMPROGRAMS\La Vigie\Désinstaller.lnk" "$INSTDIR\uninstall.exe"

  WriteUninstaller "$INSTDIR\uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante" "DisplayName" "La Vigie — Pilotage financier"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante" "DisplayIcon" "$INSTDIR\app.ico"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante" "Publisher" "La Vigie"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante" "NoRepair" 1
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\Diagnostic-Sante-Resto-Hotel.html"
  Delete "$INSTDIR\app.ico"
  Delete "$INSTDIR\uninstall.exe"
  RMDir /r "$INSTDIR\profil"
  RMDir "$INSTDIR"
  Delete "$DESKTOP\La Vigie.lnk"
  Delete "$SMPROGRAMS\La Vigie\La Vigie.lnk"
  Delete "$SMPROGRAMS\La Vigie\Désinstaller.lnk"
  RMDir "$SMPROGRAMS\La Vigie"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\DiagnosticSante"
SectionEnd
