# My Express App

Este es un proyecto de aplicación web construido con Express y TypeScript. La aplicación utiliza una base de datos SQLite para almacenar datos.

## Estructura del Proyecto

```
my-express-app
├── src
│   ├── app.ts                # Punto de entrada de la aplicación
│   ├── controllers
│   │   └── index.ts          # Controladores de la aplicación
│   ├── routes
│   │   └── index.ts          # Configuración de rutas
│   ├── db
│   │   └── sqlite.ts         # Conexión a la base de datos SQLite
│   └── types
│       └── index.ts          # Tipos personalizados para la aplicación
├── package.json               # Configuración de npm y dependencias
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Documentación del proyecto
```

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando:

```
npm install
```

## Uso

Para iniciar la aplicación, utiliza el siguiente comando:

```
npm start
```

Asegúrate de que la base de datos SQLite esté configurada correctamente en `src/db/sqlite.ts`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request.