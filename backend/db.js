const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/unipedidos.db', function (error) {
    if (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

db.serialize(function () {
    db.run('PRAGMA foreign_keys = ON');

    db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL,
      telefono TEXT,
      ubicacion TEXT,
      rol TEXT DEFAULT 'cliente',
      activo INTEGER DEFAULT 1
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      categoria TEXT NOT NULL,
      imagen TEXT,
      disponible INTEGER DEFAULT 1,
      calificacion REAL DEFAULT 0
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      total REAL NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      direccion TEXT NOT NULL,
      notas TEXT,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP,
      valoracion INTEGER,
      comentario TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS detalle_pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

    db.get('SELECT COUNT(*) AS total FROM usuarios', function (error, resultado) {
        if (!error && resultado.total === 0) {
            db.run(`
        INSERT INTO usuarios (nombre, correo, contrasena, telefono, ubicacion, rol, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                'Administrador General',
                'admin@campus.com',
                'admin123',
                '0000000000',
                'Oficina',
                'administrador',
                1
            ]);

            console.log('Usuario administrador inicial creado.');
        }
    });

    db.get('SELECT COUNT(*) AS total FROM productos', function (error, resultado) {
        if (!error && resultado.total === 0) {
            db.run(`
        INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, disponible, calificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                'Hamburguesa clásica',
                'Carne, queso, lechuga, tomate y papas.',
                89,
                'Comidas',
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
                1,
                0
            ]);

            db.run(`
        INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, disponible, calificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                'Torta de jamón',
                'Pan con jamón, queso, lechuga y aderezo.',
                52,
                'Comidas',
                'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=900&q=80',
                1,
                0
            ]);

            db.run(`
        INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, disponible, calificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                'Burrito de machaca',
                'Tortilla con machaca, frijoles y queso.',
                68,
                'Comidas',
                'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80',
                1,
                0
            ]);

            db.run(`
        INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, disponible, calificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                'Papas con queso',
                'Papas medianas con queso derretido.',
                45,
                'Snacks',
                'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
                1,
                0
            ]);

            db.run(`
        INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, disponible, calificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                'Refresco',
                'Lata de refresco de 355 ml.',
                25,
                'Bebidas',
                'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=900&q=80',
                1,
                0
            ]);

            console.log('Productos iniciales creados.');
        }
    });
});

module.exports = db;