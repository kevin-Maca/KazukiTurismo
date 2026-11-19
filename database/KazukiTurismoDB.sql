
/*
========================================================
 PROYECTO: KAZUKI TURISMO
 BASE DE DATOS: KazukiTurismoDB
 MOTOR: SQL SERVER
========================================================
*/

IF DB_ID('KazukiTurismoDB') IS NULL
BEGIN
    CREATE DATABASE KazukiTurismoDB;
END;
GO

USE KazukiTurismoDB;
GO

/* ======================================================
   1. TABLA: ALOJAMIENTOS
====================================================== */

IF OBJECT_ID('dbo.ALOJAMIENTOS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ALOJAMIENTOS (
        IdAlojamiento INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(500) NULL,
        PrecioPorPersonaNoche DECIMAL(12,2) NOT NULL,
        CapacidadMaxima INT NOT NULL,
        Activo BIT NOT NULL DEFAULT 1,

        CONSTRAINT CK_Alojamientos_Precio
            CHECK (PrecioPorPersonaNoche >= 0),

        CONSTRAINT CK_Alojamientos_Capacidad
            CHECK (CapacidadMaxima > 0)
    );
END;
GO

/* ======================================================
   2. TABLA: USUARIOS
====================================================== */

IF OBJECT_ID('dbo.USUARIOS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.USUARIOS (
        IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
        Nombres NVARCHAR(100) NOT NULL,
        Apellidos NVARCHAR(100) NOT NULL,
        Correo NVARCHAR(150) NOT NULL,
        Telefono NVARCHAR(20) NOT NULL,
        TipoDocumento NVARCHAR(30) NOT NULL,
        NumeroDocumento NVARCHAR(30) NOT NULL,
        Rol NVARCHAR(20) NOT NULL DEFAULT 'VISITANTE',
        PasswordHash NVARCHAR(255) NULL,
        Activo BIT NOT NULL DEFAULT 1,
        FechaRegistro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT UQ_Usuarios_Correo
            UNIQUE (Correo),

        CONSTRAINT UQ_Usuarios_Documento
            UNIQUE (TipoDocumento, NumeroDocumento),

        CONSTRAINT CK_Usuarios_Rol
            CHECK (Rol IN ('VISITANTE', 'ADMIN'))
    );
END;
GO

/* ======================================================
   3. TABLA: FECHAS_DISPONIBLES
====================================================== */

IF OBJECT_ID('dbo.FECHAS_DISPONIBLES', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.FECHAS_DISPONIBLES (
        IdFecha INT IDENTITY(1,1) PRIMARY KEY,
        IdAlojamiento INT NOT NULL,
        Fecha DATE NOT NULL,
        CapacidadTotal INT NOT NULL,
        CuposReservados INT NOT NULL DEFAULT 0,
        Habilitada BIT NOT NULL DEFAULT 1,

        CONSTRAINT FK_Fechas_Alojamientos
            FOREIGN KEY (IdAlojamiento)
            REFERENCES dbo.ALOJAMIENTOS(IdAlojamiento),

        CONSTRAINT UQ_Fechas_Alojamiento_Fecha
            UNIQUE (IdAlojamiento, Fecha),

        CONSTRAINT CK_Fechas_Capacidad
            CHECK (CapacidadTotal > 0),

        CONSTRAINT CK_Fechas_Reservados
            CHECK (
                CuposReservados >= 0
                AND CuposReservados <= CapacidadTotal
            )
    );
END;
GO

/* ======================================================
   4. TABLA: RESERVAS
====================================================== */

IF OBJECT_ID('dbo.RESERVAS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.RESERVAS (
        IdReserva INT IDENTITY(1,1) PRIMARY KEY,
        IdUsuario INT NOT NULL,
        IdAlojamiento INT NOT NULL,
        FechaEntrada DATE NOT NULL,
        FechaSalida DATE NOT NULL,
        CantidadVisitantes INT NOT NULL,
        Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
        FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT FK_Reservas_Usuarios
            FOREIGN KEY (IdUsuario)
            REFERENCES dbo.USUARIOS(IdUsuario),

        CONSTRAINT FK_Reservas_Alojamientos
            FOREIGN KEY (IdAlojamiento)
            REFERENCES dbo.ALOJAMIENTOS(IdAlojamiento),

        CONSTRAINT CK_Reservas_Fechas
            CHECK (FechaSalida > FechaEntrada),

        CONSTRAINT CK_Reservas_Visitantes
            CHECK (CantidadVisitantes > 0),

        CONSTRAINT CK_Reservas_Estado
            CHECK (
                Estado IN (
                    'PENDIENTE',
                    'CONFIRMADA',
                    'CANCELADA'
                )
            )
    );
END;
GO

/* ======================================================
   5. TABLA: PAGOS
====================================================== */

IF OBJECT_ID('dbo.PAGOS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PAGOS (
        IdPago INT IDENTITY(1,1) PRIMARY KEY,
        IdReserva INT NOT NULL,
        MetodoPago NVARCHAR(30) NOT NULL DEFAULT 'TRANSFERENCIA',
        Monto DECIMAL(12,2) NOT NULL,
        Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
        ReferenciaPago NVARCHAR(100) NULL,
        Observaciones NVARCHAR(300) NULL,
        FechaPago DATETIME2 NULL,
        FechaRegistro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT FK_Pagos_Reservas
            FOREIGN KEY (IdReserva)
            REFERENCES dbo.RESERVAS(IdReserva),

        CONSTRAINT CK_Pagos_Monto
            CHECK (Monto > 0),

        CONSTRAINT CK_Pagos_Metodo
            CHECK (MetodoPago = 'TRANSFERENCIA'),

        CONSTRAINT CK_Pagos_Estado
            CHECK (
                Estado IN (
                    'PENDIENTE',
                    'APROBADO',
                    'RECHAZADO'
                )
            )
    );
END;
GO

/* ======================================================
   6. DATOS INICIALES: ALOJAMIENTOS
====================================================== */

IF NOT EXISTS (
    SELECT 1
    FROM dbo.ALOJAMIENTOS
    WHERE Nombre = N'Cabaña Bosque'
)
BEGIN
    INSERT INTO dbo.ALOJAMIENTOS
        (Nombre, Descripcion, PrecioPorPersonaNoche, CapacidadMaxima)
    VALUES
        (N'Cabaña Bosque', N'Refugio entre árboles', 160000, 4);
END;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.ALOJAMIENTOS
    WHERE Nombre = N'Cabaña Río'
)
BEGIN
    INSERT INTO dbo.ALOJAMIENTOS
        (Nombre, Descripcion, PrecioPorPersonaNoche, CapacidadMaxima)
    VALUES
        (N'Cabaña Río', N'Sonidos del agua', 145000, 6);
END;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.ALOJAMIENTOS
    WHERE Nombre = N'Cabaña Montaña'
)
BEGIN
    INSERT INTO dbo.ALOJAMIENTOS
        (Nombre, Descripcion, PrecioPorPersonaNoche, CapacidadMaxima)
    VALUES
        (N'Cabaña Montaña', N'Horizonte infinito', 190000, 8);
END;
GO

/* ======================================================
    7. VERIFICACION DE TABLAS
====================================================== */

SELECT TABLE_NAME AS TablaCreada
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo'
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

/* ======================================================
   8. VERIFICACION DE ALOJAMIENTOS
====================================================== */

SELECT
    IdAlojamiento,
    Nombre,
    PrecioPorPersonaNoche,
    CapacidadMaxima,
    Activo
FROM dbo.ALOJAMIENTOS
ORDER BY IdAlojamiento;
GO
