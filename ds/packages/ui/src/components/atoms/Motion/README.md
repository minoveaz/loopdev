# Motion Tokens (Foundation)

El sistema **Loop Momentum** define la coreografía visual de la plataforma. Este módulo exporta constantes inmutables para asegurar que toda animación sea funcional y coherente.

## 📐 Especificaciones
- **Easing:** No utilizamos animaciones lineales. Todas las transiciones siguen la curva `standard` (bezier v3.8) para simular inercia natural.
- **Duraciones:** 
  - `quick` (150ms): Feedback instantáneo (hovers).
  - `standard` (300ms): Entradas de componentes y transiciones de estado.
  - `ai_loop` (4000ms): Ciclos de procesamiento generativo.

## 🚀 Uso
Los tokens deben consumirse preferiblemente a través de variables CSS o clases de Tailwind extendidas para mantener el multitenancy.
