@echo off
if exist "cypress\results" rmdir /s /q "cypress\results"
if exist "mochawesome-report" rmdir /s /q "mochawesome-report"

cypress run --browser chrome
