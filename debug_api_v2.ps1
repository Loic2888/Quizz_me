# Load .env file
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^GEMINI_API_KEY=(.*)$") {
            $global:API_KEY = $matches[1].Trim()
        }
    }
}

if (-not $global:API_KEY) {
    Write-Host "Error: GEMINI_API_KEY not found"
    exit 1
}

$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Hello" }
            )
        }
    )
} | ConvertTo-Json -Depth 5

function Test-Model($modelName) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/$($modelName):generateContent?key=$global:API_KEY"
    Write-Host "Testing $modelName..."
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        Write-Host "Success ($modelName)"
        return $true
    } catch {
        Write-Host "Failed ($modelName): $($_.Exception.Message)"
        if ($_.Exception.Response) {
             Write-Host "Status: $($_.Exception.Response.StatusCode)"
             $stream = $_.Exception.Response.GetResponseStream()
             $reader = New-Object System.IO.StreamReader($stream)
             $body = $reader.ReadToEnd()
             Write-Host "Body: $body"
             $body | Out-File "api_error.json" -Encoding utf8
        }
        return $false
    }
}

function Test-ModelVersion($modelName, $version) {
    $url = "https://generativelanguage.googleapis.com/$version/models/$($modelName):generateContent?key=$global:API_KEY"
    Write-Host "Testing $modelName ($version)..."
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        Write-Host "Success ($modelName $version)"
        return $true
    } catch {
        Write-Host "Failed ($modelName $version): $($_.Exception.Message)"
        if ($_.Exception.Response) {
             $stream = $_.Exception.Response.GetResponseStream()
             $reader = New-Object System.IO.StreamReader($stream)
             $errBody = $reader.ReadToEnd()
             Write-Host "Error Body: $errBody"
        }
        return $false
    }
}

Test-ModelVersion "gemini-1.5-flash" "v1beta"
Test-ModelVersion "gemini-1.5-flash" "v1"
Test-ModelVersion "gemini-pro" "v1beta"

