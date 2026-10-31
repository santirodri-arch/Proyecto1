# Inventario UEGIR

Los archivos `index.html` y `view-qr.html` se importaron desde `UEGIR-Configurado.zip`. Se añadió el logo a la etiqueta impresa y una checklist estudiantil a los formularios de mantenimiento.

## Ejecutar en desarrollo

Requisito: Python 3. No se necesita instalar paquetes ni compilar.

```sh
cd /workspace/Proyecto1
python -m http.server 8000 --bind 127.0.0.1 --directory /workspace/Proyecto1
```

El servidor es solo para desarrollo. Las dos páginas deben responder con HTTP 200. En una computadora local puedes abrir el puerto 8000 en el navegador. El entorno de onboarding no proporciona una vista previa pública para este servidor.

## Servicios externos

Las páginas necesitan acceso a:

- `cdn.tailwindcss.com`: estilos.
- `cdn.jsdelivr.net`: cliente Supabase.
- `cdnjs.cloudflare.com`: generación de códigos QR.
- `lpwfabgzhjsxzevudrvf.supabase.co`: autenticación y base de datos.

La configuración pública de Supabase ya viene incluida. No agregues claves privadas o contraseñas a estos archivos.

El registro y la edición requieren una cuenta existente de Supabase Auth autorizada en la tabla `tecnicos`. La lectura de una ficha QR puede ser pública tras aplicar `supabase/consulta-publica.sql`. El código también utiliza `equipos`, `mantenimientos` y la función RPC `guardar_equipo`. El archivo recibido no incluye su esquema SQL; no se ha creado ni modificado la base de datos.

Para generar etiquetas QR se necesita publicar ambos HTML juntos en un sitio HTTPS accesible desde los teléfonos. La aplicación bloquea esta función en localhost y en HTTP. Un servidor local no equivale a un despliegue público.

## Alcance de la validación

Se comprobó que el servidor entrega ambos archivos con sus títulos correctos y JavaScript sin errores de sintaxis. Las operaciones con datos reales necesitan acceso al servicio y una sesión de técnico autorizado; no se han validado registros, cambios ni eliminaciones en la base.


## Checklist para el proyecto de bachillerato

Al registrar un equipo o añadir un mantenimiento desde su ficha QR:

1. Completa los datos del equipo y el tipo de mantenimiento.
2. Registra estudiantes, curso, docente responsable y fecha de la intervención.
3. En cada una de las 20 tareas selecciona **Realizado**, **Pendiente** o **No aplica**. No se preselecciona ningún resultado.
4. Selecciona el estado final y escribe observaciones (hasta 700 caracteres): fallas, repuestos, resultados y explicación de tareas pendientes o no aplicables. Si no hay novedades, indícalo.
5. Guarda y espera la confirmación. Ante un fallo de conexión el formulario conserva los datos para reintentar; no cierres ni recargues la página.

La checklist se guarda como texto legible en `mantenimientos.notas`, junto con responsables, fecha y observaciones. El registro completo debe respetar el límite existente de 3000 caracteres. No se necesitan columnas nuevas ni migraciones SQL. Cada intervención es una entrada de historial independiente. El nombre del docente es un dato declarado; no constituye una aprobación digital.

Al abrir la ficha mediante QR se puede consultar el registro completo sin sesión, después de aplicar `supabase/consulta-publica.sql`. Para registrar un mantenimiento se requiere iniciar sesión con una cuenta autorizada. Los historiales antiguos siguen mostrándose y la exportación/importación conserva las notas de la checklist. No se han creado cuentas ni ampliado permisos para estudiantes: siguen siendo necesarias cuentas autorizadas por la institución.

Las tareas internas deben supervisarse. No se debe abrir la fuente, usar borrador sobre contactos ni dejar bolsas sueltas dentro de la carcasa. El respaldo y la reinstalación requieren autorización. Las actualizaciones y licencias deben corresponder a un sistema con soporte; no se presupone que Windows 10 tenga cobertura vigente.

### Comprobar la interfaz

Con Node.js, Playwright y Chromium disponibles:

```sh
node tests/checklist.cjs
```

La prueba inicia su propio servidor local y utiliza una base simulada; no escribe datos en Supabase. Comprueba ambos formularios, tareas sin responder, conservación del formulario ante fallos, contenido enviado, reinicio después de guardar, vista móvil y lectura segura de notas nuevas y antiguas. Esta prueba no sustituye la validación de permisos y guardado real con una cuenta institucional.

Para actualizar el sitio publicado, reemplaza **ambos archivos HTML** juntos. El logo imprimible está incluido en `index.html`. Los cambios locales no se publican automáticamente en GitHub Pages.


## Descargas y autoría

Se retiraron de la aplicación el botón «Descargar archivos configurados», sus instrucciones y el controlador que generaba copias HTML. La exportación del respaldo JSON del inventario se conserva para usuarios autorizados.

Esto no convierte el código del cliente en privado: cualquier navegador que abre una página pública recibe su HTML, CSS y JavaScript. Un repositorio privado puede limitar el acceso al repositorio, pero no oculta los archivos que un sitio público entrega. La lógica que deba permanecer privada necesita un backend; las restricciones de acceso a datos deben imponerse en Supabase. No se han cambiado permisos del repositorio ni de la base de datos.


## Autoría visible

Ambas páginas incluyen los seis integrantes, el docente tutor y el curso/período proporcionados por el usuario. El bloque aparece a la derecha en escritorio y debajo de la identificación institucional en celulares. No se imprime en la etiqueta QR.


## Consulta pública por QR (actualización)

El encabezado identifica el Bachillerato Técnico en Informática y al tutor como **Mgtr. Santiago Rodríguez Cotera**.

### Activar en Supabase

1. Abre el proyecto `lpwfabgzhjsxzevudrvf` en Supabase y entra en **SQL Editor → New query**.
2. Copia el contenido completo de `supabase/consulta-publica.sql` y pulsa **Run**. Se puede repetir sin duplicar políticas ni registros.
3. Publica ambos HTML actualizados juntos en GitHub Pages.
4. Escanea un QR existente desde una ventana privada. Debes ver los datos del equipo y todo el historial, con las intervenciones más recientes primero. Pulsa «Registrar Nuevo Mantenimiento»: ahora debe aparecer el acceso con correo y contraseña. Prueba con una cuenta autorizada en `tecnicos`, guarda un mantenimiento y comprueba que se añade al historial usando la misma etiqueta.

La consulta devuelve únicamente el equipo solicitado y sus mantenimientos; no publica la lista de técnicos ni los UUID de autores. No concede escritura anónima ni desactiva RLS. **Las notas completas, incluidos nombres de estudiantes, curso, tutor y observaciones, pasan a ser consultables por quien conozca o adivine el código del equipo.** El código QR no es una contraseña. No escribas datos confidenciales en las notas públicas.

El QR apunta a `view-qr.html?codigo=CODIGO_DEL_EQUIPO`, no a una intervención concreta: no debes cambiar el código del equipo ni eliminarlo para añadir mantenimientos. Conserva la URL del sitio y podrás usar la primera etiqueta para consultar todos los registros posteriores. Si cambias de dominio o ruta, las etiquetas anteriores no se actualizan automáticamente.

La interfaz comprueba la pertenencia a `tecnicos` antes de habilitar el formulario. La protección real de las escrituras sigue dependiendo de las políticas RLS ya instaladas en Supabase.

### Validación realizada

```sh
node tests/checklist.cjs
node tests/public-qr.cjs
```

Ambas pruebas usan un servicio simulado. Se verificaron lectura sin sesión, orden del historial, petición de credenciales al registrar, rechazo de credenciales erróneas y cuentas no autorizadas, formulario habilitado para un técnico, cierre de sesión conservando la consulta pública, etiqueta permanente, equipo inexistente y mensaje para función pública sin instalar.

En el servicio real se comprobó que `consultar_ficha_publica` todavía no existe (respuesta PGRST202). El script se entrega preparado; no se ejecutó por falta de acceso administrativo a Supabase. La publicación y la validación real de lectura/escritura quedan pendientes de los pasos anteriores.
