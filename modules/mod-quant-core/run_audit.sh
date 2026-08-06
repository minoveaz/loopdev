#!/bin/bash
# LoopDev Quant Core - Suite de Auditoría de Regresión
# Este script valida que toda la lógica de trading sea correcta.

echo "🚀 Iniciando Auditoría de Lógica de Trading..."
export PYTHONPATH=$PYTHONPATH:.

# Ejecutar pytest
python3 -m pytest tests/ -v

if [ $? -eq 0 ]; then
    echo "✅ AUDITORÍA EXITOSA: Toda la lógica es correcta y segura."
else
    echo "❌ AUDITORÍA FALLIDA: Se detectaron errores en la lógica. Revisar antes de desplegar."
    exit 1
fi
