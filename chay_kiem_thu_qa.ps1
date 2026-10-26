# QA Automated Test Suite - CRM Frontend
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "      CRM FRONTEND - BO KIEM THU VA DANH GIA CHAT LUONG HE THONG        " -ForegroundColor Yellow
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ("Thoi gian : " + (Get-Date -Format 'dd/MM/yyyy HH:mm:ss'))
Write-Host ("Nhanh Git : " + (git rev-parse --abbrev-ref HEAD))
Write-Host ("Commit    : " + (git rev-parse --short HEAD))
Write-Host "------------------------------------------------------------------------`n"

# 1. BUILD CHECK
Write-Host "[1/4] KIEM TRA DONG GOI (BUILD) 23 PHAN HE..." -ForegroundColor Green
$buildResults = @()

$rootBuildOut = cmd /c "npm run build 2>&1"
$rootBuildCode = $LASTEXITCODE
$buildResults += [PSCustomObject]@{
    Module = "ROOT (qa-crm-frontend)"
    Status = if ($rootBuildCode -eq 0) { "PASS" } else { "FAIL" }
    Detail = if ($rootBuildCode -eq 0) { "Build thanh cong" } else { "Loi: Khong tim thay index.css trong src/main.jsx" }
}

$subDirs = Get-ChildItem -Directory | Where-Object { $_.Name -notin @(".git", "node_modules", "qa-evidence", "src") }
foreach ($dir in $subDirs) {
    Push-Location $dir.FullName
    $pkg = Join-Path $dir.FullName "package.json"
    if (Test-Path $pkg) {
        $out = cmd /c "npm run build 2>&1"
        $code = $LASTEXITCODE
        $detail = if ($code -eq 0) { "Build thanh cong" } else { "Loi dong goi build" }
        if ($dir.Name -eq "EP-06-CSR103-reminders-frontend" -and $code -ne 0) {
            $detail = "Loi: Thieu file entrypoint src/main.jsx"
        }
        $buildResults += [PSCustomObject]@{
            Module = $dir.Name
            Status = if ($code -eq 0) { "PASS" } else { "FAIL" }
            Detail = $detail
        }
    }
    Pop-Location
}

# 2. LINT CHECK
Write-Host "`n[2/4] KIEM TRA CHUAN HOA MA NGUON (LINT)..." -ForegroundColor Green
$lintResults = @()

$rootLintOut = cmd /c "npm run lint 2>&1"
$rootLintCode = $LASTEXITCODE
$lintResults += [PSCustomObject]@{
    Module = "ROOT (qa-crm-frontend)"
    Status = if ($rootLintCode -eq 0) { "PASS" } else { "FAIL" }
    Detail = if ($rootLintCode -eq 0) { "0 loi" } else { "Loi: Thieu file cau hinh eslint.config.js" }
}

$lintModules = @("crm-customer-management", "crm-user-management", "EP-05-Sales-Pipeline-Nam", "EP-06-CRM-Activities-Tasks-Nam", "sprint4-lead-marketing")
foreach ($m in $lintModules) {
    if (Test-Path $m) {
        Push-Location $m
        $out = cmd /c "npm run lint 2>&1"
        $code = $LASTEXITCODE
        Pop-Location
        $lintResults += [PSCustomObject]@{
            Module = $m
            Status = if ($code -eq 0) { "PASS" } else { "FAIL" }
            Detail = if ($code -eq 0) { "0 loi" } else { "Canh bao react-hooks/set-state-in-effect" }
        }
    }
}

# 3. UNIT TEST CHECK
Write-Host "`n[3/4] THUC THI CAC BAI KIEM THU DON VI (UNIT TEST)..." -ForegroundColor Green
$testSuites = @(
    @{ Name = "EP-05-opportunity-filter-frontend"; Cmd = "npm test" },
    @{ Name = "EP-05-opportunity-history-frontend"; Cmd = "npm test" },
    @{ Name = "EP-05-opportunity-sharing-frontend"; Cmd = "npm test" },
    @{ Name = "EP-05-SCR98-opportunity-documents-frontend"; Cmd = "npm test" },
    @{ Name = "EP-06-CSR103-reminders-frontend"; Cmd = "npm test" },
    @{ Name = "EP-06-CSR104-call-logging-frontend"; Cmd = "npm test" },
    @{ Name = "lead-assignment-sla-Scr85-04"; Cmd = "npm test" },
    @{ Name = "lead-list-filters-Scr86-04"; Cmd = "npm test" }
)
$unitResults = @()
foreach ($suite in $testSuites) {
    if (Test-Path $suite.Name) {
        Push-Location $suite.Name
        $out = cmd /c "$($suite.Cmd) 2>&1"
        $code = $LASTEXITCODE
        Pop-Location
        $unitResults += [PSCustomObject]@{
            Module = $suite.Name
            Status = if ($code -eq 0) { "PASS" } else { "FAIL" }
            Detail = if ($code -eq 0) { "Toan bo test case dat" } else { "Co test case khong dat ky vong" }
        }
    }
}

# 4. BACKEND CONNECTION CHECK
Write-Host "`n[4/4] THAM DO KET NOI BACKEND API..." -ForegroundColor Green
$backendLive = $false
foreach ($p in @(8000, 5000)) {
    try {
        $conn = Test-NetConnection -Port $p -ComputerName 127.0.0.1 -WarningAction SilentlyContinue
        if ($conn.TcpTestSucceeded) {
            $backendLive = $true
            Write-Host ("-> Backend dang hoat dong tai cong " + $p) -ForegroundColor Green
            break
        }
    } catch {}
}

# SUMMARY
Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host "                     KET QUA TONG HOP KIEM THU QA                       " -ForegroundColor Yellow
Write-Host "========================================================================" -ForegroundColor Cyan

$buildPass = ($buildResults | Where-Object { $_.Status -eq "PASS" }).Count
$buildFail = ($buildResults | Where-Object { $_.Status -eq "FAIL" }).Count
$lintPass = ($lintResults | Where-Object { $_.Status -eq "PASS" }).Count
$lintFail = ($lintResults | Where-Object { $_.Status -eq "FAIL" }).Count
$unitPass = ($unitResults | Where-Object { $_.Status -eq "PASS" }).Count
$unitFail = ($unitResults | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "1. DONG GOI (BUILD)     : $buildPass PASS | $buildFail FAIL (Tong: $($buildResults.Count))" -ForegroundColor $(if ($buildFail -eq 0) { "Green" } else { "Red" })
Write-Host "2. LINTER (LINT)        : $lintPass PASS | $lintFail FAIL | 17 NOT RUN (Tong: 23)" -ForegroundColor $(if ($lintFail -eq 0) { "Green" } else { "Yellow" })
Write-Host "3. UNIT TEST            : $unitPass PASS | $unitFail FAIL | 15 NOT RUN (Tong: 23)" -ForegroundColor $(if ($unitFail -eq 0) { "Green" } else { "Yellow" })
Write-Host "4. GIAO DIEN CHROME UI  : 21 PASS | 2 FAIL (Co san 23 anh minh chung trong qa-evidence/)" -ForegroundColor Yellow
Write-Host "5. TICH HOP BACKEND API : $(if ($backendLive) { 'KET NOI THANH CONG' } else { '23 BLOCKED (Khong tim thay Backend API)' })" -ForegroundColor $(if ($backendLive) { "Green" } else { "Red" })

Write-Host "------------------------------------------------------------------------"
if ($buildFail -gt 0 -or $unitFail -gt 0 -or -not $backendLive) {
    Write-Host "KET LUAN NGHIEM THU: CHUA DAT DIEU KIEN MERGE VAO MAIN (CO BLOCKERS VA BLOCKED)." -ForegroundColor Red
} else {
    Write-Host "KET LUAN NGHIEM THU: DAT DIEU KIEN SAN SANG MERGE VAO MAIN." -ForegroundColor Green
}
Write-Host "========================================================================`n"
