@echo off
if "%~1"=="" (
  echo Please provide your GitHub Personal Access Token:
  echo Example: push_repo.bat ghp_yourTokenHere
  exit /b 1
)
set "PATH=C:\Users\shaur\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;%PATH%"
node "C:\Users\shaur\.gemini\antigravity\scratch\tools\push_to_github.js" %1
