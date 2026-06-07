# PRUNplanner Unit Price Calculator - 安装脚本
# 此脚本帮助你在Edge浏览器中加载扩展

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PRUNplanner Unit Price Calculator" -ForegroundColor Cyan
Write-Host "Edge 扩展安装助手" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
$manifestPath = Join-Path $PSScriptRoot "manifest.json"
if (-not (Test-Path $manifestPath)) {
    Write-Host "❌ 错误: 未找到 manifest.json" -ForegroundColor Red
    Write-Host "请在此脚本所在目录运行此脚本" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 找到扩展配置文件" -ForegroundColor Green
Write-Host ""

# 显示扩展信息
$manifest = Get-Content $manifestPath | ConvertFrom-Json
Write-Host "扩展信息:" -ForegroundColor Yellow
Write-Host "  名称: $($manifest.name)" -ForegroundColor White
Write-Host "  版本: $($manifest.version)" -ForegroundColor White
Write-Host "  描述: $($manifest.description)" -ForegroundColor White
Write-Host ""

# 检查图标
$iconsPath = Join-Path $PSScriptRoot "icons"
$iconFiles = @("icon16.png", "icon48.png", "icon128.png")
$missingIcons = @()

foreach ($icon in $iconFiles) {
    $iconPath = Join-Path $iconsPath $icon
    if (-not (Test-Path $iconPath)) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host "⚠️  警告: 缺少以下图标文件:" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "   - $icon" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "图标不影响功能，但建议生成图标。" -ForegroundColor Yellow
    Write-Host "请打开 generate-icons.html 生成图标" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "是否继续安装? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host "安装已取消" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✅ 所有图标文件已就绪" -ForegroundColor Green
    Write-Host ""
}

# 提供安装说明
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "安装步骤:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 打开Edge浏览器" -ForegroundColor White
Write-Host "2. 在地址栏输入: edge://extensions/" -ForegroundColor White
Write-Host "3. 打开左侧的 '开发人员模式' 开关" -ForegroundColor White
Write-Host "4. 点击 '加载解压缩的扩展' 按钮" -ForegroundColor White
Write-Host "5. 选择以下目录:" -ForegroundColor White
Write-Host "   $PSScriptRoot" -ForegroundColor Green
Write-Host "6. 确认加载成功" -ForegroundColor White
Write-Host ""

# 打开文件夹
$openFolder = Read-Host "是否打开扩展文件夹? (Y/N)"
if ($openFolder -eq "Y" -or $openFolder -eq "y") {
    Invoke-Item $PSScriptRoot
    Write-Host "✅ 已打开文件夹" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试扩展:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "方法1: 访问 https://prunplanner.org" -ForegroundColor White
Write-Host "方法2: 打开 test-page.html 进行测试" -ForegroundColor White
Write-Host ""

$openTest = Read-Host "是否打开测试页面? (Y/N)"
if ($openTest -eq "Y" -or $openTest -eq "y") {
    $testPage = Join-Path $PSScriptRoot "test-page.html"
    Invoke-Item $testPage
    Write-Host "✅ 已打开测试页面" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "安装完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "如有问题，请查看 README.md 或 INSTALL.md" -ForegroundColor Yellow
Write-Host ""
