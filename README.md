# Clima Cureña

Clima Cureña es una aplicación móvil desarrollada para consultar las condiciones meteorológicas actuales y el pronóstico de cinco días de diferentes comunidades cercanas a Unión del Toro, en Sarapiquí.

Las comunidades incluidas son Unión del Toro, Tambor, Los Ángeles, Copalchí, Puerto Viejo de Sarapiquí, La Delia y Chaparrón.

La aplicación consume información meteorológica de Open-Meteo y permite guardar o eliminar comunidades favoritas. Los favoritos se almacenan localmente y permanecen disponibles después de cerrar la aplicación.

## Funcionalidades

- Consulta de condiciones meteorológicas actuales.
- Pronóstico de cinco días.
- Temperatura, sensación térmica, humedad, precipitación y viento.
- Manejo de estados de carga y errores.
- Actualización manual de la información.
- Almacenamiento local de comunidades favoritas.
- Lectura y eliminación de favoritos.
- Ordenamiento de las comunidades favoritas al inicio del listado.

## Tecnologías

- React Native
- Expo SDK 57
- TypeScript
- Expo Router
- Open-Meteo API
- Expo SQLite
- Context API

## Organización del proyecto

- `src/app`: pantallas y navegación.
- `src/components`: componentes reutilizables.
- `src/context`: manejo del estado global de favoritos.
- `src/data`: información de las comunidades.
- `src/lib/api`: comunicación con Open-Meteo y tipos de datos.
- `src/lib/database`: operaciones de almacenamiento local con SQLite.

## Ejecución

Instalar las dependencias:

```bash
npm install
```

Iniciar la aplicación:

```bash
npx expo start
```

Para probar la aplicación en Expo Go mediante túnel:

```bash
npx expo start --tunnel
```

## Fuente de datos

Los datos meteorológicos se obtienen de la API pública de [Open-Meteo](https://open-meteo.com/).

Los pronósticos de esta aplicación son informativos y no sustituyen los avisos oficiales de las autoridades.

## Autora

Natalia Martínez Villegas