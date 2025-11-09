# Script PowerShell per Testare l'API StackMoneyUp
# ================================================
# 
# Questo script ti guida passo-passo per testare l'API
#
# Uso:
#   1. Apri PowerShell nella cartella del progetto
#   2. Esegui: .\test-api.ps1
#   3. Segui le istruzioni!

Write-Host ""
Write-Host "🚀 Test API StackMoneyUp" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Chiedi il token
Write-Host "STEP 1: Token di Autenticazione" -ForegroundColor Yellow
Write-Host ""
Write-Host "Per ottenere il token:" -ForegroundColor White
Write-Host "  1. Apri https://stackmoneyup.com/en/login nel browser" -ForegroundColor Gray
Write-Host "  2. Fai login" -ForegroundColor Gray
Write-Host "  3. Premi F12 (apre DevTools)" -ForegroundColor Gray
Write-Host "  4. Vai su Application → Cookies → stackmoneyup.com" -ForegroundColor Gray
Write-Host "  5. Cerca: sb-qhxettplmhkwmmcgrcef-auth-token" -ForegroundColor Gray
Write-Host "  6. Copia tutto il valore (è molto lungo!)" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Incolla qui il tuo token (o premi Invio per saltare e inserirlo dopo)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "⚠️  Nessun token inserito. Puoi inserirlo manualmente nel comando cURL." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comando da eseguire:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host 'curl -X POST https://stackmoneyup.com/api/blog/create \' -ForegroundColor Green
    Write-Host '  -H "Content-Type: application/json" \' -ForegroundColor Green
    Write-Host '  -H "Authorization: Bearer TUO_TOKEN_QUI" \' -ForegroundColor Green
    Write-Host '  -d @test-simple.json' -ForegroundColor Green
    Write-Host ""
    exit
}

# Step 2: Verifica che il file JSON esista
Write-Host ""
Write-Host "STEP 2: Verifica File JSON" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "test-simple.json") {
    Write-Host "✅ File test-simple.json trovato!" -ForegroundColor Green
} else {
    Write-Host "❌ File test-simple.json NON trovato!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Il file dovrebbe essere nella stessa cartella di questo script." -ForegroundColor Yellow
    Write-Host "Assicurati di essere nella cartella del progetto." -ForegroundColor Yellow
    exit
}

# Step 3: Esegui la richiesta
Write-Host ""
Write-Host "STEP 3: Creazione Post via API" -ForegroundColor Yellow
Write-Host ""
Write-Host "Eseguo la richiesta..." -ForegroundColor White
Write-Host ""

try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }
    
    $body = Get-Content "test-simple.json" -Raw
    
    $response = Invoke-RestMethod -Uri "https://stackmoneyup.com/api/blog/create" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop
    
    # Success!
    Write-Host "✅ SUCCESSO! Post creato!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dettagli:" -ForegroundColor Cyan
    Write-Host "  Post ID: $($response.post.id)" -ForegroundColor White
    Write-Host "  Slug: $($response.post.slug)" -ForegroundColor White
    Write-Host "  Published: $($response.post.published) (DRAFT)" -ForegroundColor White
    Write-Host ""
    Write-Host "Prossimi passi:" -ForegroundColor Cyan
    Write-Host "  1. Vai su: https://stackmoneyup.com/en/dashboard" -ForegroundColor White
    Write-Host "  2. Trova il post nella lista" -ForegroundColor White
    Write-Host "  3. Clicca per modificarlo" -ForegroundColor White
    Write-Host "  4. Preview per vedere il risultato" -ForegroundColor White
    Write-Host "  5. Pubblica quando pronto!" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Edit URL: https://stackmoneyup.com/dashboard/edit/$($response.post.slug)" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "❌ ERRORE!" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorBody = $_.ErrorDetails.Message
        
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        Write-Host ""
        
        if ($statusCode -eq 401) {
            Write-Host "❌ 401 Unauthorized" -ForegroundColor Red
            Write-Host "   Il token non è valido o è scaduto." -ForegroundColor Yellow
            Write-Host "   Soluzione: Ottieni un nuovo token dal browser (vedi STEP 1)" -ForegroundColor Yellow
        }
        elseif ($statusCode -eq 403) {
            Write-Host "❌ 403 Forbidden" -ForegroundColor Red
            Write-Host "   Il tuo account non ha i permessi necessari." -ForegroundColor Yellow
            Write-Host "   Soluzione: Contatta un admin per aggiornare il tuo ruolo a 'editor' o 'admin'" -ForegroundColor Yellow
        }
        elseif ($statusCode -eq 400) {
            Write-Host "❌ 400 Bad Request" -ForegroundColor Red
            Write-Host "   Dati mancanti o invalidi." -ForegroundColor Yellow
            Write-Host "   Controlla il file JSON." -ForegroundColor Yellow
        }
        else {
            Write-Host "Errore: $errorBody" -ForegroundColor Red
        }
    } else {
        Write-Host "Errore di connessione:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Per più dettagli, controlla:" -ForegroundColor Yellow
    Write-Host "  - GUIDA_PASSO_PASSO.md" -ForegroundColor Cyan
    Write-Host "  - CURL_EXAMPLES.md" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Premi un tasto per uscire..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

