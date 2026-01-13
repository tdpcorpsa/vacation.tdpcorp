# Reglas del pryecto

Proyecto basado en la plantilla `tdp-template` con el framework `next` y `pnpm`

Para formatear el documento debes de usar prettier

```bash
pnpm run format
pnpm run typecheck
```

Siempre ejecuta `pnpm typecheck` antes de terminar.

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/ # todas las rutas que requieren autenticación, pero son independientes de tenant
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── <feature>/
│   │   ├── <feature>-form.tsx # Dentro de form solo debe de tener los field necesarios para el formulario, no la logica del formulario.
│   │   ├── <feature>-list.tsx
│   │   ├── <feature>-<edit/create>.tsx
│   │   ├── <feature>-delete.tsx  # debe de usar ui/alert-confirmation
│   │   ├── <feature>-actions.tsx # debe de ser un dropdown con las acciones disponibles
│   │   ├── <feature>-create-button.tsx
│   │   └── <feature>-select.tsx # solo cuando se necesita
│   └── ui/ # componentes reutilizables no deben de ser modificados salvo escepciones.
├── lib/
├── types/ # Siempre usar los tipos de supabase
│   └── supabase.types.ts # tipos de supabase
├── schemas/
│   └── <feature>.schema.ts # esquema de la forms
└── hooks/ # hooks reutilizables
    └── <feature>/
        └── use-<feature>-<action>.ts
```

## Auth

Para el sistema de autenticación se usara supabase auth

- Documentación: https://supabase.com/docs/guides/auth/server-side/nextjs

## Base de datos

Para la base de datos se usara supabase

- los tipos de supabase estaran en `types/supabase.types.ts`

**types**

- Siempre usar los tipos de supabase

```typescript
// esquema public
type<Feature> = Tables<'features'>
// otro esquema
type<Feature> = Tables<{ schema: 'auth' }, 'users'>
```

## fetch

Para las consultas y mutaciones de la base de datos se debe de usar react-query en `use-<feature>-<action>.ts`

```typescript
// ejemplo de query
const useFeatureList = ({
  pagination,
  search,
}: {
  pagination: {
    page: number
    pageSize: number
  }
  search?: string
}) => {
  return useQuery({
    queryKey: ['features'],
    queryFn: () => {
      return {
        data: [],
        total: 0,
        pagination,
      }
    },
  })
}
```

## Table

- Para tablas o listas debe de usarse react-table, se mostrara en 3 vistas, de tabla, de lista y de cards.
  - En la vista de tabla se usara table.tsx
  - En la vista de lista se usara item.tsx
  - En la vista de cards se usara card.tsx
  - para el selector se usara select-view.tsx
- Busquedas, filtros, ordenamiento y paginación se usaran desde el servidor.

## Delete Form

- Para formularios de eliminación debe de usarse ui/alert-confirmation, y se pedira ingresar una palabra de confirmación

## style

- Se usara los componentes de ui.shadcn y se instalaran los componentes usando `pnpm dlx shadcn@latest add <component>`
- Los estilos de los componentes seran por defecto, solo se modificara en algunas escepciones

## Estados

- Para los estados se usara zustand
- Solo se usara estados globales, unicamente cuando sea necesario

## Forms

- Para los formularios se usara `react-hook-form`
- Para la validación se usara `zod`

**Correcto**

```typescript
z.email('Formato de email inválido') // para validar correo electronico  y que no este vacio
z.email('Formato de email inválido').optional().or(z.literal('')) // para validar correo electronico y que pueda estar vacio
z.nonempty('El campo es requerido') // para validar que no este vacio
```

**Incorrecto**

```typescript
z.string().email('Formato de email inválido') // para validar correo electronico  y que no este vacio
```

- `<feature>-form.tsx` debe de tener solo los campos necesarios para el formulario, no la logica del formulario.

**correcto**

```typescript
export function FeatureForm() {
  // context
  const { form } = useFormContext();
  // watcher para validar el campo username
  const username = form.watch('username');
  useEffect(() => {
    // en caso se requiera
  }, [username]);
  return (
    <div>
      <Field>
        <FieldLabel htmlFor="date_of_birth">Fecha de Nacimiento</FieldLabel>
        <FieldContent>
          <Input
            id="date_of_birth"
            type="date"
            {...control.register('date_of_birth')}
          />
          <FieldError errors={[errors.date_of_birth]} />
        </FieldContent>
      </Field>
    </div>
  );
}
```

**Incorrecto**

```typescript
export function FeatureForm() {
  // esto debe de ir a la acción como <feature>-<create/edit>
  const form = useForm<FeatureSchema>({
    resolver: zodResolver(FeatureSchema),
  });
  return (
    <Form {...form}> // esto debe de ir a la acción como <feature>-<create/edit>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> // esto debe de ir a la acción como <feature>-<create/edit>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

Las acciones que tienen un formulario com <edit/create> o cualquier otra accion que requiere un formulario dentro de un Drawer `drawer.tsx`

## Componentes

- Cuando se crea un componente reutilizable, se debe de agregar la forma de uso en `/app/demo`, solo y unicamente de los componentes reutilizables que esten dentro de `../ui`.
- los demos deben de enlazarse a la pagina principal de `/app/demo`
- las features no deben de estar dentro de `demo`.

## Readme

- El readme solo debe de tener un:
  - resumen: corto de no mas de 5 lineas
  - las variables de entorno: una lista con todas las variables de entorno
  - como iniciar: un ejemplo de como iniciar el proyecto
  - los módulos: una lista con todos los módulos y sus permisos, debe de estar el subdomain:recurso:accion los permisos deben de ser unicamente los declarados en CanAccess
