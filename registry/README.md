# TDP Template Registry

Plantilla estándar corporativa de TDP Corp que implementa las mejores prácticas y estándares de desarrollo para aplicaciones internas, construida con tecnologías modernas

## Tecnologías Utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- shadcn/ui
- React Query
- Zustand

Esta solución integral garantiza consistencia, escalabilidad y mantenibilidad en todos los proyectos de desarrollo interno de la corporación.

## Instalación

### Template Completo

```bash
pnpm dlx shadcn@latest add https://github.com/tdpcorp/tpd-template
```

## Dependencias

Cada componente incluye sus dependencias específicas:

- **Radix UI**: Para componentes base accesibles
- **Class Variance Authority**: Para variantes de componentes
- **Tailwind Merge**: Para fusión de clases CSS
- **React Hook Form**: Para manejo de formularios
- **Zod**: Para validación de esquemas

## Convenciones del Template

- **Formularios**: react-hook-form + validación con Zod
- **Estado**: Zustand para estado global
- **Data Fetching**: @tanstack/react-query
- **Estilos**: Tailwind CSS + shadcn/ui
- **Autenticación**: Supabase Auth con middleware

## Estructura de Carpetas

```
src/
  app/
    (auth)/          # Rutas protegidas
  components/
    ui/               # Componentes UI reutilizables
    <feature>/        # Componentes por feature
  lib/
    supabase/         # Configuración Supabase
  hooks/              # Hooks personalizados
  types/              # Tipos TypeScript
  schemas/            # Esquemas Zod
```

## Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm format       # Formatear código con Prettier
pnpm typecheck    # Verificar tipos TypeScript
pnpm lint         # Linter ESLint
```
