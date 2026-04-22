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

### /ajustes
- Perfil y preferencias del usuario
- Tabs de informacion y accesibilidad
- Actualmente mayormente UI local (sin persistencia Firebase completa aun)
- En la información debe permitir cambiar el apodo y solicitar un cambio de contraseña al correo (manejado por firebase)
- En preferencias permite cambiar el idioma en el que se ve la plataforma (Español o ingles, por defecto español )
- En preferncias permite activar el modo de daltonismo (cambios en las paletas de color para tener un alto contraste)
---

