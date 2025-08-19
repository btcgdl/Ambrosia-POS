[Setup]
AppName=Instalador de Debian WSL
AppVersion=0.1.0
DefaultDirName={autopf}\DebianWSLInstaller
PrivilegesRequired=admin
OutputDir=.\
OutputBaseFilename=Debian_WSL_Installer

[Files]
Source: "install_debian_wsl.ps1"; DestDir: "{tmp}"

[Run]
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{tmp}\install_debian_wsl.ps1"""; Flags: runhidden