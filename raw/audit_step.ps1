param(
    [string]$Action, # "next", "done", "fixme"
    [string]$Path,
    [string]$NewName
)

$tracker = "d:\llm-wiki-en\raw\RECONSTRUCTION_TRACKER.md"
$content = Get-Content $tracker -Raw

if ($Action -eq "next") {
    $pending = $content -split "`n" | Select-String "Pending" | Select-Object -First 1
    if ($pending) {
        Write-Host "Next Target: $pending"
    } else {
        Write-Host "All files processed!"
    }
}
elseif ($Action -eq "done") {
    $oldLine = $content -split "`n" | Select-String [regex]::Escape($Path)
    $newLine = $oldLine -replace "Pending", "Done"
    $newLine = $newLine -replace "\|  \|", "| $NewName |"
    $newContent = $content -replace [regex]::Escape($oldLine), $newLine
    $newContent | Out-File $tracker -Encoding UTF8
    Write-Host "Marked as Done: $Path"
}
elseif ($Action -eq "fixme") {
    $oldLine = $content -split "`n" | Select-String [regex]::Escape($Path)
    $newLine = $oldLine -replace "Pending", "Fixme"
    $newContent = $content -replace [regex]::Escape($oldLine), $newLine
    $newContent | Out-File $tracker -Encoding UTF8
    Write-Host "Marked as Fixme: $Path"
}
