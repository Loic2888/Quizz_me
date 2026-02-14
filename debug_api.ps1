# Load .env file
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

Write-Host "Key loaded (first 5 chars): $($apiKey.Substring(0,5))..."

# List Models
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey"
Write-Host "Listing models from: $url"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "Available Models:"
    $response.models | ForEach-Object { Write-Host $_.name }
} catch {
    Write-Host "Error listing models:"
    Write-Host $_.Exception.Message
     if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
