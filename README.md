# StockFlow Manager 📦

Sistema web Full-Stack para el control de inventario, gestión de existencias y registro de movimientos de stock en tiempo real.

---

## 🚀 Características Principales

* **Gestión de Productos (CRUD):** Registro, consulta y eliminación de productos en inventario.
* **Alertas de Stock Bajo/Crítico:** Identificación visual automática e indicadores dinámicos cuando un producto está igual o por debajo de su límite mínimo (`minStock`).
* **Control de Movimientos:** Registro de Entradas (compras/reabastecimiento) y Salidas (ventas/mermas) con actualización automática en la base de datos.
* **Historial y Auditoría:** Pestaña dedicada al seguimiento de transacciones con fecha, hora, tipo de movimiento y motivo.
* **Interfaz Moderna:** UI responsiva en modo oscuro construida con React y Tailwind CSS.

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **.NET 10 Web API**
* **Entity Framework Core 9** (ORM)
* **Pomelo.EntityFrameworkCore.MySql** (Proveedor MySQL)
* **Swagger / OpenAPI** (Documentación de endpoints)

### Frontend
* **React + Vite**
* **Tailwind CSS** (Estilos y diseño responsivo)
* **Axios** (Cliente HTTP)
* **Lucide React** (Iconografía)

### Base de Datos & Entorno
* **MySQL** (Servidor en XAMPP)

---

## 📂 Estructura del Repositorio

```text
StockFlow Manager/
├── StockFlowBackend/     # Proyecto ASP.NET Core Web API
│   ├── Controllers/      # Endpoints (Products, Movements)
│   ├── Data/             # AppDbContext y configuración EF Core
│   ├── Migrations/       # Migraciones del esquema de MySQL
│   └── Models/           # Entidades (Product, Movement)
│
└── stockFlowFrontend/    # Cliente React con Vite
    ├── src/
    │   ├── api.js        # Configuración de Axios y llamadas REST
    │   ├── App.jsx       # Interfaz principal e historial
    │   └── main.jsx      # Punto de entrada React
    └── package.json


```

## ⚙️ Requisitos Previos
.NET 10 SDK o superior.

Node.js (v18+) y npm.

XAMPP con el servicio MySQL activo.

## 💻 Instalación y Configuración
## 1. Clonar el repositorio
### Bash
git clone [https://github.com/FelipeAceved0/stockflow-manager.git](https://github.com/FelipeAceved0/stockflow-manager.git)
cd stockflow-manager

## 2. Configurar la Base de Datos (MySQL)
Inicia Apache y MySQL desde el Panel de Control de XAMPP.

Crea una base de datos vacía llamada stockflow_db (vía phpMyAdmin o terminal MySQL).

Revisa la cadena de conexión en StockFlowBackend/appsettings.json:

### JSON

```
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=stockflow_db;User=root;Password=;"
}

```
## 3. Ejecutar el Backend (.NET)
### Bash
cd StockFlowBackend
dotnet ef database update
dotnet run
La API quedará escuchando en http://localhost:5000 (o el puerto asignado).

## 4. Ejecutar el Frontend (React)
Abre otra terminal desde la raíz:

### Bash
cd stockFlowFrontend
npm install
npm run dev
Accede en tu navegador a http://localhost:5173.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
