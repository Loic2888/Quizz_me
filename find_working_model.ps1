# Load API Key
$envFile = ".env"
$apiKey = ""
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^GEMINI_API_KEY=(.*)$") {
            $apiKey = $matches[1].Trim()
        }
    }
}

if (-not $apiKey) {
    Write-Host "Error: GEMINI_API_KEY not found"
    exit 1
}

# 1. List Available Models
$listUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey"
Write-Host "Fetching available models from: $listUrl"

try {
    $listResponse = Invoke-RestMethod -Uri $listUrl -Method Get
} catch {
    Write-Host "Failed to list models. Check API Key."
    Write-Host $_.Exception.Message
    exit 1
}

$candidates = $listResponse.models | Where-Object { $_.supportedGenerationMethods -contains "generateContent" }

Write-Host "Found $($candidates.Count) candidate models supporting generateContent."

# 2. Test Each Candidate
$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Hello" }
            )
        }
    )
} | ConvertTo-Json -Depth 5

foreach ($model in $candidates) {
    $modelName = $model.name # e.g. "models/gemini-1.5-flash"
    # URL construction: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
    # Note: $modelName already includes "models/" prefix, so we use string replacement if needed or just append correctly.
    
    # The endpoint expects: .../v1beta/{model=models/*}:generateContent
    # So if $modelName is "models/gemini-1.5-flash", the URL should be .../v1beta/models/gemini-1.5-flash:generateContent? NO.
    # It should be .../v1beta/models/gemini-1.5-flash:generateContent works if we strip "models/"?
    # Actually, the docs say the resource name is "models/..."
    # Let's try constructing the URL by simply appending ":generateContent" to the full resource name path.
    
    # Try 1: Using full name from ListModels (models/foo)
    $testUrl = "https://generativelanguage.googleapis.com/v1beta/$($modelName):generateContent?key=$apiKey"
    
    Write-Host "Testing $modelName..."
    try {
        $response = Invoke-RestMethod -Uri $testUrl -Method Post -Body $body -ContentType "application/json"
        Write-Host ">>> SUCCESS! Working model found: $modelName"
        # Extract stripped name for Rust (e.g., gemini-1.5-flash)
        $shortName = $modelName -replace "models/", ""
        Write-Host ">>> API Name for Rust: $shortName"
        $shortName | Out-File "model_found.txt" -Encoding utf8
        exit 0
    } catch {
        Write-Host "   Failed: $($_.Exception.Message)"
        # Check for 404 specifically
        if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::NotFound) {
             # Maybe double "models/" issue? let's try stripping it.
             $shortName = $modelName -replace "models/", ""
             $retryUrl = "https://generativelanguage.googleapis.com/v1beta/models/$($shortName):generateContent?key=$apiKey"
             try {
                $response = Invoke-RestMethod -Uri $retryUrl -Method Post -Body $body -ContentType "application/json"
                Write-Host ">>> SUCCESS (Retry with standard path)! Working model: $shortName"
                exit 0
             } catch {
                Write-Host "   Retry Failed: $($_.Exception.Message)"
             }
        }
    }
}

Write-Host "No working model found."
exit 1
