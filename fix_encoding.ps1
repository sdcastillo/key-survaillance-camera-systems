$file = 'c:\Users\casti\Downloads\installation-and-setup-manual-main\installation-and-setup-manual-main\book.md'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Fix corrupted characters
$content = $content -replace '[€¯‡¢†™âœ]', ''
$content = $content -replace '"', '"'
$content = $content -replace '"', '"'
$content = $content -replace ''', "'"
$content = $content -replace '–', '-'
$content = $content -replace '—', '--'
$content = $content -replace '\s+–\s+', ' -> '
$content = $content -replace '\s+—\s+', ' -> '

# Clean up formatting
$content = $content -replace '\*{2,}', '**'
$content = $content -replace '\s{2,}', ' '
$content = $content -replace '\n{3,}', "`n`n"
$content = $content -replace '> \s*\n', ''

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Encoding fixed successfully"
