const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('API UniPedidos funcionando correctamente');
});

app.post('/api/login', function(req, res) {
  const correo = req.body.correo;
  const contrasena = req.body.contrasena;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  const consulta = `
    SELECT id, nombre, correo, telefono, ubicacion, rol, activo
    FROM usuarios
    WHERE correo = ? AND contrasena = ? AND activo = 1
  `;

  db.get(consulta, [correo, contrasena], function(error, usuario) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json(usuario);
  });
});

app.get('/api/usuarios', function(req, res) {
  db.all('SELECT id, nombre, correo, telefono, ubicacion, rol, activo FROM usuarios', function(error, filas) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }

    res.json(filas);
  });
});

app.post('/api/usuarios', function(req, res) {
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const contrasena = req.body.contrasena;
  const telefono = req.body.telefono;
  const ubicacion = req.body.ubicacion;
  const rol = req.body.rol || 'cliente';

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
  }

  const consulta = `
    INSERT INTO usuarios (nombre, correo, contrasena, telefono, ubicacion, rol, activo)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;

  db.run(consulta, [nombre, correo, contrasena, telefono, ubicacion, rol], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }

    res.status(201).json({
      id: this.lastID,
      nombre,
      correo,
      telefono,
      ubicacion,
      rol,
      activo: 1
    });
  });
});

app.put('/api/usuarios/:id', function(req, res) {
  const id = req.params.id;
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const contrasena = req.body.contrasena;
  const telefono = req.body.telefono;
  const ubicacion = req.body.ubicacion;
  const rol = req.body.rol || 'cliente';
  const activo = req.body.activo === undefined ? 1 : req.body.activo;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
  }

  const consulta = `
    UPDATE usuarios
    SET nombre = ?, correo = ?, contrasena = ?, telefono = ?, ubicacion = ?, rol = ?, activo = ?
    WHERE id = ?
  `;

  db.run(consulta, [nombre, correo, contrasena, telefono, ubicacion, rol, activo, id], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });
});

app.delete('/api/usuarios/:id', function(req, res) {
  const id = req.params.id;

  db.run('UPDATE usuarios SET activo = 0 WHERE id = ?', [id], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }

    res.json({ mensaje: 'Usuario dado de baja correctamente' });
  });
});

app.get('/api/productos', function(req, res) {
  db.all('SELECT * FROM productos', function(error, filas) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al obtener productos' });
    }

    res.json(filas);
  });
});

app.get('/api/productos/disponibles', function(req, res) {
  db.all('SELECT * FROM productos WHERE disponible = 1', function(error, filas) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al obtener productos disponibles' });
    }

    res.json(filas);
  });
});

app.post('/api/productos', function(req, res) {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const categoria = req.body.categoria;
  const imagen = req.body.imagen;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ mensaje: 'Nombre, precio y categoría son obligatorios' });
  }

  const consulta = `
    INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, disponible, calificacion)
    VALUES (?, ?, ?, ?, ?, 1, 0)
  `;

  db.run(consulta, [nombre, descripcion, precio, categoria, imagen], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al registrar producto' });
    }

    res.status(201).json({
      id: this.lastID,
      nombre,
      descripcion,
      precio,
      categoria,
      imagen,
      disponible: 1,
      calificacion: 0
    });
  });
});

app.put('/api/productos/:id', function(req, res) {
  const id = req.params.id;
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const categoria = req.body.categoria;
  const imagen = req.body.imagen;
  const disponible = req.body.disponible === undefined ? 1 : req.body.disponible;
  const calificacion = req.body.calificacion === undefined ? 0 : req.body.calificacion;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ mensaje: 'Nombre, precio y categoría son obligatorios' });
  }

  const consulta = `
    UPDATE productos
    SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, imagen = ?, disponible = ?, calificacion = ?
    WHERE id = ?
  `;

  db.run(consulta, [nombre, descripcion, precio, categoria, imagen, disponible, calificacion, id], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al actualizar producto' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
});

app.delete('/api/productos/:id', function(req, res) {
  const id = req.params.id;

  db.run('UPDATE productos SET disponible = 0 WHERE id = ?', [id], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }

    res.json({ mensaje: 'Producto dado de baja correctamente' });
  });
});

function recalcularCalificacionesProductos(callback) {
  const consulta = `
    UPDATE productos
    SET calificacion = COALESCE((
      SELECT AVG(pedidos.valoracion)
      FROM pedidos
      INNER JOIN detalle_pedidos ON pedidos.id = detalle_pedidos.pedido_id
      WHERE detalle_pedidos.producto_id = productos.id
      AND pedidos.valoracion IS NOT NULL
    ), 0)
  `;

  db.run(consulta, function(error) {
    if (error) {
      console.error('Error al recalcular calificaciones:', error.message);
    }

    if (callback) {
      callback(error);
    }
  });
}

function obtenerPedidosConDetalle(res, consulta, parametros) {
  db.all(consulta, parametros, function(error, pedidos) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
    }

    if (pedidos.length === 0) {
      return res.json([]);
    }

    let pendientes = pedidos.length;

    pedidos.forEach(function(pedido) {
      const consultaDetalle = `
        SELECT 
          detalle_pedidos.producto_id AS id,
          productos.nombre,
          productos.categoria,
          detalle_pedidos.cantidad,
          detalle_pedidos.precio_unitario AS precio,
          detalle_pedidos.subtotal
        FROM detalle_pedidos
        INNER JOIN productos ON detalle_pedidos.producto_id = productos.id
        WHERE detalle_pedidos.pedido_id = ?
      `;

      db.all(consultaDetalle, [pedido.id], function(errorDetalle, detalle) {
        pedido.productos = errorDetalle ? [] : detalle;

        pendientes--;

        if (pendientes === 0) {
          res.json(pedidos);
        }
      });
    });
  });
}

app.get('/api/pedidos', function(req, res) {
  const consulta = `
    SELECT 
      pedidos.id,
      'PED-' || pedidos.id AS folio,
      pedidos.usuario_id AS usuarioId,
      usuarios.nombre AS cliente,
      pedidos.total,
      pedidos.estado,
      pedidos.direccion,
      pedidos.notas,
      pedidos.fecha,
      pedidos.valoracion,
      pedidos.comentario
    FROM pedidos
    INNER JOIN usuarios ON pedidos.usuario_id = usuarios.id
    ORDER BY pedidos.id DESC
  `;

  obtenerPedidosConDetalle(res, consulta, []);
});

app.get('/api/pedidos/usuario/:id', function(req, res) {
  const usuarioId = req.params.id;

  const consulta = `
    SELECT 
      pedidos.id,
      'PED-' || pedidos.id AS folio,
      pedidos.usuario_id AS usuarioId,
      usuarios.nombre AS cliente,
      pedidos.total,
      pedidos.estado,
      pedidos.direccion,
      pedidos.notas,
      pedidos.fecha,
      pedidos.valoracion,
      pedidos.comentario
    FROM pedidos
    INNER JOIN usuarios ON pedidos.usuario_id = usuarios.id
    WHERE pedidos.usuario_id = ?
    ORDER BY pedidos.id DESC
  `;

  obtenerPedidosConDetalle(res, consulta, [usuarioId]);
});

app.post('/api/pedidos', function(req, res) {
  const usuarioId = req.body.usuarioId;
  const productos = req.body.productos;
  const direccion = req.body.direccion;
  const notas = req.body.notas || '';

  if (!usuarioId || !productos || productos.length === 0 || !direccion) {
    return res.status(400).json({ mensaje: 'Usuario, productos y dirección son obligatorios' });
  }

  let total = 0;

  productos.forEach(function(producto) {
    total += Number(producto.precio) * Number(producto.cantidad);
  });

  const consultaPedido = `
    INSERT INTO pedidos (usuario_id, total, estado, direccion, notas, fecha)
    VALUES (?, ?, 'pendiente', ?, ?, datetime('now', 'localtime'))
  `;

  db.run(consultaPedido, [usuarioId, total, direccion, notas], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al registrar pedido' });
    }

    const pedidoId = this.lastID;

    const consultaDetalle = `
      INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `;

    productos.forEach(function(producto) {
      const subtotal = Number(producto.precio) * Number(producto.cantidad);

      db.run(consultaDetalle, [
        pedidoId,
        producto.id,
        producto.cantidad,
        producto.precio,
        subtotal
      ]);
    });

    res.status(201).json({
      id: pedidoId,
      folio: 'PED-' + pedidoId,
      usuarioId,
      total,
      estado: 'pendiente',
      direccion,
      notas,
      productos
    });
  });
});

app.put('/api/pedidos/:id', function(req, res) {
  const id = req.params.id;
  const estado = req.body.estado;
  const direccion = req.body.direccion;
  const notas = req.body.notas;
  const valoracion = req.body.valoracion;
  const comentario = req.body.comentario;

  db.get('SELECT * FROM pedidos WHERE id = ?', [id], function(error, pedidoActual) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al buscar pedido' });
    }

    if (!pedidoActual) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    const nuevoEstado = estado || pedidoActual.estado;
    const nuevaDireccion = direccion || pedidoActual.direccion;
    const nuevasNotas = notas === undefined ? pedidoActual.notas : notas;
    const nuevaValoracion = valoracion === undefined ? pedidoActual.valoracion : valoracion;
    const nuevoComentario = comentario === undefined ? pedidoActual.comentario : comentario;

    const consulta = `
      UPDATE pedidos
      SET estado = ?, direccion = ?, notas = ?, valoracion = ?, comentario = ?
      WHERE id = ?
    `;

    db.run(consulta, [
      nuevoEstado,
      nuevaDireccion,
      nuevasNotas,
      nuevaValoracion,
      nuevoComentario,
      id
    ], function(errorUpdate) {
      if (errorUpdate) {
        return res.status(500).json({ mensaje: 'Error al actualizar pedido' });
      }

      if (valoracion !== undefined) {
        recalcularCalificacionesProductos(function(errorCalificacion) {
          if (errorCalificacion) {
            return res.status(500).json({ mensaje: 'Pedido actualizado, pero hubo error al recalcular calificaciones' });
          }

          res.json({ mensaje: 'Pedido actualizado correctamente' });
        });
      } else {
        res.json({ mensaje: 'Pedido actualizado correctamente' });
      }
    });
  });
});

app.delete('/api/pedidos/:id', function(req, res) {
  const id = req.params.id;

  db.run('UPDATE pedidos SET estado = ? WHERE id = ?', ['cancelado', id], function(error) {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al cancelar pedido' });
    }

    res.json({ mensaje: 'Pedido cancelado correctamente' });
  });
});

app.listen(PORT, function() {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});