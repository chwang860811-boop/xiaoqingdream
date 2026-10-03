$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot
if (Get-Command py -ErrorAction SilentlyContinue) {
  Start-Process "http://localhost:5500"
  py -m http.server 5500
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  Start-Process "http://localhost:5500"
  python -m http.server 5500
} else {
  Write-Host "找不到 Python。請安裝 Python 後再試。" -ForegroundColor Yellow
  Read-Host "按 Enter 關閉"
}
