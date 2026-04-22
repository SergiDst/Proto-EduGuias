# Documentacion del sistema EduGuias

## 1. Todo lo que entiendo del programa

EduGuias es una plataforma web para crear, editar y gestionar actividades educativas acceisble e inclusivas, siguiendo los estanderes de UDL y WCAG.

El proyecto esta construido sobre:
- Next.js (App Router)
- React
- Zustand para estado global en cliente
- Firebase Auth para autenticacion
- Cloud Firestore para datos de negocio

La app tiene dos grandes zonas funcionales:
- Zona publica: landing, guias y plantillas
- Zona protegida: inicio del usuario autenticado, ajustes, mis actividades y flujo de edicion

El enfoque funcional del producto es:
- Permitir crear actividades por tipo (Actualmente solo cuestionario y solo caundo esta autenticado)
- Mantener actividades creadas por el usuario (Solo cuando esta autenticado)
- Ofrecer plantillas listas para reutilizar (Si el usuario esta autenticado puede crear una copia de esa plantilla para editarla, si no lo esta solo puede descargarla)
- Mostrar guias y recursos oficiales
- Aplicar criterios de accesibilidad (en las actividades creadas)

---

## 2. Como es la navegacion

### Enrutamiento principal
- Landing: /
- Login: /login
- Signup: /signup
- Inicio autenticado: /inicio
- Mis actividades: /mis-actividades
- Crear actividad (seleccion de plantilla): /mis-actividades/actividades
- Flujo editor por tipo: /mis-actividades/[tipoActividad]
- Flujo editor por seccion: /mis-actividades/[tipoActividad]/[seccion]
- Ajustes: /ajustes
- Guias: /guias
- Plantillas: /plantillas

### Comportamiento de navegacion protegida
- Rutas protegidas por prefijo: /inicio, /mis-actividades, /ajustes
- Si no hay sesion, se redirige a /login?next=...
- Si hay sesion y entra a /login o /signup, se redirige a /inicio
- Si hay sesion y entra a /, se redirige a /inicio

### Flujo de edicion por actividad existente
- Desde Inicio o desde Mis actividades/actividades se hace click en una actividad
- Se consulta por id en Firestore
- Se navega a /mis-actividades/[tipoActividad]?actividadId=...
- El index de tipo redirige a la primera seccion valida y preserva actividadId
- La pagina de seccion vuelve a consultar el id y carga la actividad seleccionada en store

---

## 4. Como es la estructura

### Estructura de carpetas (logica)
- app/: paginas, layouts y rutas
- components/: componentes de UI y pasos del editor
- constants/: catalogos, rutas de editor y colecciones
- interfaces/: contratos TypeScript por store
- services/: capa de acceso a Firebase (Auth + Firestore)
- stores/: estado global con Zustand
- lib/: inicializacion Firebase/Auth/Firestore
- utils/: utilitarios como traduccion/mapeo de errores Firebase

### Layouts
- app/layout.tsx: layout raiz, registra AuthListener y GlobalModal
- app/(public)/layout.tsx: agrega Header para la zona publica
- app/(public)/(protected)/layout.tsx: gate de cliente para proteger rutas
- app/(auth)/layout.tsx: layout simple para login/signup

### Convencion de capas
- Servicio: hace operaciones CRUD directas sobre Firebase
- Store: consume servicios, normaliza errores, mantiene loading/error/fetched y estado en memoria
- Pagina/Componente: consume store para renderizar UI y disparar acciones

---

## 3. Como es la autenticacion

### Tecnologias y estado
- Firebase Auth maneja login/signup/logout/reset
- Zustand (authStore) mantiene:
  - user
  - authReady
  - metodos de login, signup, logout, resetPassword

### Inicio de sesion y listener
- AuthListener monta un listener de token (onIdTokenChanged)
- Cuando hay usuario:
  - authStore.user se actualiza
  - se escribe cookie eduguias-auth=1
- Cuando no hay usuario:
  - cookie se elimina

### Doble proteccion de rutas
- Proxy (servidor): valida cookie para redirecciones tempranas
- ProtectedLayout (cliente): valida authReady + user en runtime

### Registro
- Signup crea usuario en Firebase Auth
- Luego crea/mergea documento base del usuario en Firestore (coleccion Usuarios)
- Envia verificacion de correo

---

## 5. Como se consumen datos de Firebase y como se utilizan

## 5.1 Modelo de datos (colecciones actuales)
- Usuarios
- Guias
- Plantillas
- MisActividades (como subcoleccion por usuario)

### Ubicaciones principales
- Usuarios/{uid}
- Usuarios/{uid}/MisActividades/{actividadId}
- Plantillas/{plantillaId}
- Guias/{guiaId}

## 5.2 Servicios (capa Firebase)

### Auth
- authServices.ts
- Responsabilidad: login, signup, logout, reset password, escucha de sesion

### Actividades
- actividadesServices.ts
- Responsabilidad:
  - getActividadesByUser(uid)
  - getActividadById(uid, actividadId)
  - createActividadByUser(uid, data)
  - updateActividadByUser(uid, actividadId, data)
  - deleteActividadByUser(uid, actividadId)

### Plantillas
- plantillasServices.ts
- Responsabilidad:
  - getPlantillas(limit?)
  - createPlantilla(data)
  - updatePlantilla(id, data)
  - deletePlantilla(id)

### Guias
- guiasServices.ts
- Responsabilidad:
  - getGuias(limit?)
  - getGuiasByTipo(tipo, limit?)
  - createGuia(data)
  - updateGuia(id, data)
  - deleteGuia(id)

## 5.3 Stores (orquestacion cliente)

### useActividadesStore
- Estado:
  - actividades
  - selectedActividad
  - loading
  - error
  - fetched
- Acciones:
  - fetchActividadesByUser
  - fetchActividadById
  - createActividad
  - updateActividad
  - deleteActividad
  - clearSelectedActividad
  - clearError
  - reset

### usePlantillasStore
- Estado: plantillas, loading, error, fetched
- Acciones: fetch/create/update/delete + clearError/reset

### useGuiasStore
- Estado: guias, loading, error, fetched
- Acciones: fetch/fetchByTipo/create/update/delete + clearError/reset

### Patron de error
- Los stores traducen errores Firebase usando getFirebaseErrorMessage
- Esto permite mostrar mensajes entendibles para usuario

## 5.4 Uso en paginas
- Las paginas disparan fetch en useEffect (cuando aplica)
- Renderizan UI condicional:
  - cargando
  - error
  - vacio
  - contenido
- En actividades recientes, al click:
  - fetchActividadById
  - navegacion al editor con actividadId

---

## 6. Funcionalidad de cada pantalla

## 6.1 Publicas

### /
- Landing de marketing
- Presenta propuesta de valor y features
- CTA principal para iniciar uso

### /guias
- Carga guias desde Firestore
- Muestra una guia destacada (tipo plataforma)
- Muestra recursos oficiales (tipo recurso-oficial)
- Cada recurso puede abrir enlace o descarga

### /plantillas
- Carga plantillas desde Firestore
- Filtro por categoria dinamica
- Busqueda por texto (titulo, descripcion, categoria)
- Render de tarjetas con estilo segun tipo de actividad
- Permite descarga de una actividad seleccionada cuando no esta autenticado y edición y descarga cuando esta autenticado

## 6.2 Autenticacion

### /login
- Formulario de acceso con recordar sesion
- Aplica persistencia local o de sesion
- Redirige al parametro next o a /inicio
- Muestra errores en modal global
- No debe permitir el ingreso hasta que el usuario verifique el email

### /signup
- Formulario de registro
- Crea cuenta en Firebase Auth + doc base de usuario en Firestore
- Envia verificacion por correo
- Muestra modal de exito/error

## 6.3 Protegidas

### /inicio
- Dashboard del usuario autenticado
- Bloque de inicio rapido para creación de actividades 
- Tabla de actividades recientes creadas por el usuario desde Firebase (maximo por mostrar 3 actividades)
- Click en columna opciones abre edición, descarga o eliminación de actividad existente

### /mis-actividades
- Vista principal de actividades creadas por el usuario
- Carga dinamica desde Firebase
- Estados de loading/error/vacio
- Click en card abre actividad existente para edición (consulta por id)
- Acceso a flujo de creacion
- Tiene un paginador en dado caso que halla mas actividades (las actividades se muestras en un grid de 2 filas X 3 columnas)

### /mis-actividades/actividades
- Selector de plantilla para crear actividad nueva (Actualmente solo debe estar cuestionario)
- Lista de tipos de actividad (cards)
- Seccion de usados recientemente desde Firebase

### /mis-actividades/[tipoActividad]
- Ruta intermedia
- Valida tipo y redirige a la seccion inicial del editor
- Preserva actividadId cuando viene en query

### /mis-actividades/[tipoActividad]/[seccion]
- Editor por secciones
- Valida tipo y seccion segun catalogo
- Si existe actividadId, carga actividad seleccionada desde Firebase
- Renderiza componentes de seccion segun tipo (actualmente solo para cuestionario)
- Aqui se debe poder crear un objeto de actividad el cual debe ser evaluado segun principios de UDL (como longitud del texto) y WCAG (contraste de colores) (tipar por union discriminada a una interfaz de actividad base y actividades de tipos en concreto)
- Funcionalidad de pantallas:
  - Objetivo: Escribir el objetivo de esa actividad, este objetivo aparece al iniciar la actividad (ej: que es lo que debe haber aprendido el usuario que resuleva la actividad)
  - Contenido: (Puede variar segun el tipo de actividad, aunque actualmente solo este cuestionario) Debe contener un formulario sencillo para poder crear el objeto del contenido de la actividad segun su tipo (crear la interfaz de la actividad)
  - Retroalimentacion: Aqui se decide si la retroalimentación se da al responder una pregunta o al finalizar la actividad, si se desea que se vean las respuestas correctas despues de responder, las explicaciones de cada respuesta y un mensaje general que sale al finalizar la actividad.
  - Paleta de colores: Se muestra una preview (de la primera pregunta unicamente) de como luce la actividad con el contenido que halla colocado el usuario y se puede personalizar la tipografia, el tamaño de los titulos, subtitulos y texto, tambien el color del texto y el color de fondo de la actividad. Tambien existe una pequeña sección con modos recomendados los cuales tienen una preselección de colores y tamaños de texto los cuales siguen los conceptos de WCAG. (ACTUALMENTE HAY UN PLACEHOLDER DE ACTIVIDAD, DEBE REEMPLAZARCE POR EL CONTENIDO REAL QUE CREA EL USUARIO)
  - Evaluación: estadisticas que indican y dan un puntaje segun los criterios cumplidos del UDL y WCAG
  - Descargar: da opciones para descargar la actividad creada en HTML+CSS+JS o SCORM para su utilización en moodle.

### /ajustes
- Perfil y preferencias del usuario
- Tabs de informacion y accesibilidad
- Actualmente mayormente UI local (sin persistencia Firebase completa aun)
- En la información debe permitir cambiar el apodo y solicitar un cambio de contraseña al correo (manejado por firebase)
- En preferencias permite cambiar el idioma en el que se ve la plataforma (Español o ingles, por defecto español )
- En preferncias permite activar el modo de daltonismo (cambios en las paletas de color para tener un alto contraste)

---

## 7. Interfaces y tipos TypeScript

### Actividad
```typescript
interface Actividad {
  id: string;
  type: string;                         // "cuestionario", "verdadero-falso", etc.
  subject: string;                      // Materia/asignatura
  title: string;                        // Nombre de la actividad
  score: number;                        // Puntuación de accesibilidad (default: 0)
  createdAt: Date | null;
  updatedAt: Date | null;
  payload?: Record<string, unknown>;    //Contenido de la actividad Datos específicos por tipo (pasos del editor)
}

interface CreateActividadInput {
  type: string;
  subject: string;
  title: string;
  score?: number;
  payload?: Record<string, unknown>;
}

type UpdateActividadInput = Partial<CreateActividadInput>;
```

### Plantilla
```typescript
interface Plantilla {
  id: string;
  title: string;
  description: string;
  category: string;                     // Categoría dinámica (ej: "Matemáticas", "Lenguaje")
  activityType: string;                 // Tipo de actividad (ej: "cuestionario")
  downloadUrl?: string;                 // URL para descargar plantilla
  previewUrl?: string;                  // URL de preview
  content?: Record<string, unknown>;    // Contenido preparado de la plantilla
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CreatePlantillaInput {
  title: string;
  description: string;
  category: string;
  activityType: string;
  downloadUrl?: string;
  previewUrl?: string;
  content?: Record<string, unknown>;
}

type UpdatePlantillaInput = Partial<CreatePlantillaInput>;
```

### Guía
```typescript
type GuiaTipo = "plataforma" | "recurso-oficial";
type GuiaAction = "download" | "link";

interface Guia {
  id: string;
  title: string;
  description: string;
  tipo: GuiaTipo;
  action: GuiaAction;                   // Si es descarga o link externo
  url: string;
  meta?: string;                        // Metadatos adicionales (ej: versión, autor)
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CreateGuiaInput {
  title: string;
  description: string;
  tipo: GuiaTipo;
  action: GuiaAction;
  url: string;
  meta?: string;
}

type UpdateGuiaInput = Partial<CreateGuiaInput>;
```

### Usuario
```typescript
interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;                 // Apodo del usuario
}

// Documento base en Firestore Usuarios/{uid}
interface UserDocument {
  email: string;
  displayName?: string;
  language: "es" | "en";               // Idioma preferido
  colorblindMode: boolean;              // Modo daltonismo activado
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 8. Constantes y catálogos

### Colecciones Firebase
```typescript
const COLECCIONES = {
  GUIAS: "Guias",                       // Colección pública
  USUARIOS: "Usuarios",                 // Raíz de usuarios
  PLANTILLAS: "Plantillas",             // Colección pública
  MIS_ACTIVIDADES: "MisActividades",    // Subcolección en Usuarios/{uid}/
};
```

### Tipos de actividad
```typescript
const ACTIVIDADES = {
  1: { Actividad: "Cuestionario", color: "bg-blue-100 text-blue-800" },
  2: { Actividad: "Verdadero/Falso", color: "bg-green-100 text-green-800" },
  // Potenciales futuros: "union-conceptos", "lectura", "video-guia"
};
```

### Secciones del editor
```typescript
const EDITOR_SECTION_CATALOG = {
  objetivo: "Objetivo",
  contenido: "Contenido",
  retroalimentacion: "Retroalimentacion",
  paleta: "Paleta de colores",
  evaluacion: "Evaluacion",
  descargar: "Descargar",
} as const;

type EditorSectionId = keyof typeof EDITOR_SECTION_CATALOG;
```

### Configuración de tipos de actividad
```typescript
const EDITOR_ACTIVITY_CONFIG: Record<string, ActivityEditorConfig> = {
  cuestionario: {
    label: "Cuestionario",
    sections: ["objetivo", "contenido", "retroalimentacion", "paleta", "evaluacion", "descargar"],
  },
  "verdadero-falso": {
    label: "Verdadero - Falso",
    sections: ["objetivo", "contenido", "retroalimentacion", "evaluacion", "descargar"],
  },
  // Otros tipos disponibles pero no aún funcionales
  lectura: { /* ... */ },
  "video-guia": { /* ... */ },
  "union-conceptos": { /* ... */ },
};
```

### Funciones de validación
```typescript
isValidTipoActividad(tipoActividad: string): boolean
getActivityLabel(tipoActividad: string): string
getSectionsByActivity(tipoActividad: string): Array<{ id: EditorSectionId; label: string }>
getDefaultSection(tipoActividad: string): EditorSectionId | null
isValidSectionForActivity(tipoActividad: string, seccion: string): boolean
isEditorRoute(pathname?: string | null): boolean
```

---

## 9. Estructura de documentos Firestore

### Usuarios/{uid}
```
{
  email: string,
  displayName?: string,
  language: "es" | "en" (default: "es"),
  colorblindMode: boolean (default: false),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Usuarios/{uid}/MisActividades/{actividadId}
```
{
  type: string (ej: "cuestionario", "verdadero-falso"),
  subject: string (ej: "Matemáticas"),
  title: string (ej: "Ecuaciones de primer grado"),
  score: number (default: 0),
  payload: {
    // Estructura específica por tipo de actividad
    // Para cuestionario: { questions: [], instructions: "", etc. }
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Plantillas/{plantillaId}
```
{
  title: string,
  description: string,
  category: string (ej: "Matemáticas", "Lenguaje"),
  activityType: string (ej: "cuestionario"),
  downloadUrl?: string,
  previewUrl?: string,
  content?: {
    // Datos pre-rellenados que se pueden copiar a una nueva actividad
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Guias/{guiaId}
```
{
  title: string,
  description: string,
  tipo: "plataforma" | "recurso-oficial",
  action: "download" | "link",
  url: string (ruta de descarga o URL externa),
  meta?: string (ej: "v1.2.0", "autor: Equipo EduGuias"),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 10. Validaciones y restricciones

### Campos requeridos
| Entidad | Campo | Restricción | Ejemplo |
|---------|-------|-------------|---------|
| Actividad | type | No vacío, válido según EDITOR_ACTIVITY_CONFIG | "cuestionario" |
| Actividad | title | No vacío, máx 200 caracteres | "Mi actividad" |
| Actividad | subject | No vacío | "Matemáticas" |
| Plantilla | title | No vacío, máx 150 caracteres | "Plantilla multiplicación" |
| Plantilla | activityType | Debe existir en EDITOR_ACTIVITY_CONFIG | "cuestionario" |
| Guia | tipo | "plataforma" \| "recurso-oficial" | "plataforma" |
| Guia | action | "download" \| "link" | "download" |

### Validaciones de accesibilidad (Futuro - /mis-actividades/[tipoActividad]/[seccion])
- **WCAG AA Contraste**: Texto en paleta debe tener ratio ≥ 4.5:1
- **UDL Longitud**: Instrucciones máx 500 caracteres, preguntas máx 300 caracteres
- **Accesibilidad cognitiva**: Vocabulario simple, oraciones cortas

### Tipado por union discriminada (Futuro)
```typescript
type ActivityBase = {
  type: "cuestionario" | "verdadero-falso" | "lectura" | "video-guia" | "union-conceptos";
  title: string;
  subject: string;
};

type CuestionarioActivity = ActivityBase & {
  type: "cuestionario";
  payload: {
    questions: Question[];
    instructions: string;
  };
};

type VerdaderoFalsoActivity = ActivityBase & {
  type: "verdadero-falso";
  payload: {
    statements: Statement[];
  };
};

type Activity = CuestionarioActivity | VerdaderoFalsoActivity | /* otros tipos */;
```

---

## 11. Firestore Security Rules

### Principios actuales
- Usuarios NO pueden escribir en Guías ni Plantillas (solo lectura)
- Usuarios SOLO pueden leer sus propias actividades (Usuarios/{uid}/MisActividades/*)
- Usuarios SOLO pueden crear/update/delete en su propia colección

### Reglas (pseudocódigo)
```
service cloud.firestore {
  match /databases/{database}/documents {
    // Guías: lectura pública, escritura solo admin
    match /Guias/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == "admin-uid";
    }

    // Plantillas: lectura pública, escritura solo admin
    match /Plantillas/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == "admin-uid";
    }

    // Usuarios y actividades: lectura/escritura solo propietario
    match /Usuarios/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      match /MisActividades/{activityId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

---

## 12. Flujo de datos (ejemplos)

### Flujo deseado: Crear nueva actividad
1. Usuario hace click en tipo de actividad en `/mis-actividades/actividades`
2. Se navega a `/mis-actividades/[tipoActividad]?actividadId=new`
3. Usuario completa secciones (Contenido, Paleta, etc.)
4. En la sección de paleta y cuando todo este correcto presiona el boton "Guardar y revisar"
5. Inmediatamente:
   - Se dispara `createActividad({ type, subject, title, payload })`
   - El store llama `createActividadByUser(uid, data)` (servicio)
   - Firebase genera `id` del documento
   - `selectedActividad` se actualiza en store
   - `actividadId` se preserva en query params
   - se actualiza el payload con toda la actividad
6. En Descargar, se genera archivo con `selectedActividad` completa ya sea en HTML+JS+CSS o SCORM (segun elección del usuario)

### Flujo deseado: Microtips/consejos en EditSideBar
1. En cada sección se revisara el contenido que coloca el usuario en los campos disponibles para poder mostrar el microtip/consejo
 - Objetivos (UDL: longitud del texto)
 - Contenido (UDL: longitud del texto y WCAG: texto alternativo en imagenes)
 - Retroalimentación (UDL: longitud del texto)
 - Colores/paleta (WCAG: contraste en colores, tamaño de letra)

### Flujo: Editar actividad existente
1. Usuario hace click en card de actividad en `/mis-actividades`
2. Se dispara `fetchActividadById(uid, actividadId)`
3. Se navega a `/mis-actividades/[tipoActividad]?actividadId=...`
4. En cada sección, `selectedActividad.payload` se carga en componentes
5. Cambios se guardan con `updateActividad(uid, actividadId, { payload })`
6. En la sección de paleta y cuando todo este correcto presiona el boton "Guardar y revisar"
7. `updatedAt` se actualiza en Firebase

### Flujo: Cargar plantilla como base
1. Usuario selecciona plantilla en `/plantillas`
2. Se hace copia: `createActividad({ ...plantilla.content })`
3. Nueva actividad se abre en editor
4. Usuario personaliza los campos



### Flujo: Cargar guía
1. Usuario entra a `/guias`
2. Se dispara `fetchGuias()` o `fetchGuiasByTipo("plataforma")`
3. Se renderizan tarjetas con título, descripción
4. Click en tarjeta:
   - Si `action === "download"`: descarga archivo
   - Si `action === "link"`: abre `url` en nueva pestaña

---

## 13. Componentes del editor (por sección)

### Componentes actuales
- **ObjetivoPage**: Editor de objetivo y competencias
- **ContenidoPage**: Editor de preguntas/contenido principal
- **PaletaPage** (ColoresPage): Selector de colores con validación WCAG
- **EvaluacionPage**: Configuración de evaluación y puntuación
- **RetroalimentacionPage**: Mensajes post-respuesta
- **DescargaPage**: Generador de descarga

### Estructura esperada
Cada componente recibe:
```typescript
{
  selectedActividad: Actividad | null,
  loading: boolean,
  error: string | null,
  onUpdate: (payload: Record<string, unknown>) => void,
  onNext: () => void,
  onPrev: () => void,
}
```

---

## 14. Rate limiting y anti-duplicación

### Implementación (Stores)
```typescript
// Lectura: Cooldown 800ms + in-flight dedupe
const FETCH_COOLDOWN_MS = 800;
const userFetchTimestamps = new Map<string, number>();
const userFetchInFlight = new Map<string, Promise<void>>();

// Escritura: In-flight dedupe por operación
const createInFlight = new Map<string, Promise<Actividad>>();
const updateInFlight = new Map<string, Promise<void>>();
const deleteInFlight = new Map<string, Promise<void>>();
```

### Flujo de protección
1. **Lectura**: Si < 800ms desde último fetch → return early; Si en-flight → return promise; Else → fetch + cache
2. **Escritura**: Si en-flight con mismo payload/id → return promise; Else → execute + cache

---

## 15. Próximos pasos técnicos

### Para implementar
- [ ] Tipado con union discriminada de Activities (Section 10)
- [ ] Validaciones de WCAG/UDL antes de guardar
- [ ] Firestore Rules definitivas
- [ ] Estado `submitting` por operación (UI feedback)
- [ ] Full payload persistence en editor steps
- [ ] Integración de traductor i18n (idioma + modo daltonismo)
- [ ] Creación de actividad y descarga en los formatos anteriormente mencionados
---

