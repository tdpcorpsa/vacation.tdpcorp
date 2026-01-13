# TDP Template

Plantilla oficial de TDP Corp que implementa estándares corporativos de desarrollo, siguiendo las mejores prácticas de la industria para garantizar consistencia, mantenibilidad y escalabilidad en todos los proyectos de la organización. Esta plantilla establece un marco de trabajo unificado que cumple con los lineamientos de arquitectura empresarial, patrones de diseño establecidos, y estándares de calidad de código definidos por TDP Corp.

## Tecnologías

- Next.js + TypeScript
- Supabase (Base de datos y Auth)
- shadcn/ui + Tailwind CSS
- React Hook Form + Zod
- React Query
- Zustand
- React Table

## Instalación

1. **Clonar el template:**

   ```bash
   git clone https://github.com/tdpcorpsa/tdp-template.git <nombre-proyecto>
   ```

2. **Navegar al directorio del proyecto:**

   ```bash
   cd <nombre-proyecto>
   ```

3. **Eliminar el historial de git existente e inicializar uno nuevo:**

   ```bash
   # En Windows (PowerShell/CMD)
   rm -force -R .git
   git init

   # En Unix/Mac/Linux
   rm -rf .git
   git init
   ```

4. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

5. **Configurar variables de entorno:**

   Copia el archivo de ejemplo y configura las variables:

   ```bash
   cp env.example .env.local
   ```

   Luego edita `.env.local` con tus valores reales:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

   NEXT_PUBLIC_DOMAIN=tu_dominio
   # Auth Configuration
   NEXT_PUBLIC_LOGIN=tu_configuracion_login
   ```

   > **Nota**: Puedes encontrar las credenciales de Supabase en tu dashboard del proyecto bajo Settings > API

## Comandos

```bash
pnpm dev        # Desarrollo
pnpm build      # Construir
pnpm lint       # Linting
pnpm typecheck  # Verificar tipos
pnpm format     # Formatear código con Prettier
```

## 🔧 Personalización del Template

> **⚠️ IMPORTANTE**: Esta es una plantilla base que **DEBE ser personalizada** para cada proyecto específico.

### Archivos que REQUIEREN modificación:

1. **`package.json`**: Actualizar nombre, descripción y repositorio del proyecto
2. **`.env.local`**: Configurar variables de entorno específicas del proyecto
3. **`src/app/layout.tsx`**: Personalizar metadata, título y descripción
4. **`README.md`**: Reemplazar con documentación específica del proyecto

### Pasos iniciales de personalización:

1. Cambiar el nombre del proyecto en `package.json`
2. Configurar variables de entorno de Supabase
3. Definir esquemas de base de datos en `schemas/`
4. Crear componentes específicos del dominio en `components/`
5. Implementar rutas y páginas según funcionalidad requerida

## 📁 Estructura de Desarrollo

### Organización de Features

```
src/
├── components/
│   └── <feature>/
│       ├── <feature>-form.tsx
│       ├── <feature>-list.tsx
│       ├── <feature>-create.tsx
│       ├── <feature>-edit.tsx
│       ├── <feature>-delete.tsx
│       └── <feature>-actions.tsx
```

### Hooks y Lógica de Negocio

```
src/
├── hooks/
│   └── <feature>/
│       ├── use-<feature>-create.ts
│       ├── use-<feature>-update.ts
│       ├── use-<feature>-delete.ts
│       └── use-<feature>-list.ts
```

### Esquemas y Tipos

```
src/
├── schemas/
│   └── <feature>.schema.ts
└── types/
    ├── supabase.types.ts
```

### Rutas y Páginas

```
src/
└── app/
    └── (auth)/
        └── <feature>/
            ├── page.tsx
            ├── create/
            │   └── page.tsx
            └── [id]/
                └── edit/
                    └── page.tsx
```
