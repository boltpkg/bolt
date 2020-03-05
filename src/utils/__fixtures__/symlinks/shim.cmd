@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\shim_target.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\shim_target.js" %*
)