$GpuMemTotal = (((Get-Counter "\GPU Process Memory(*)\Local Usage").CounterSamples | where CookedValue).CookedValue | measure -sum).sum
    Write-Output "$([math]::Round($GpuMemTotal/1MB,2)) MB"
$GpuUseTotal = (((Get-Counter "\GPU Engine(*engtype_3D)\Utilization Percentage").CounterSamples | where CookedValue).CookedValue | measure -sum).sum
    Write-Output "$([math]::Round($GpuUseTotal,2)) %"