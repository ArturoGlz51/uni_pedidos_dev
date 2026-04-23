const CLAVE_USUARIOS = 'cafeteria_usuarios';
const CLAVE_PRODUCTOS = 'cafeteria_productos';
const CLAVE_PEDIDOS = 'cafeteria_pedidos';
const CLAVE_SESION = 'cafeteria_sesion';
const CLAVE_CARRITO = 'cafeteria_carrito';

const PAGINA_ACTUAL = window.location.pathname.split('/').pop() || 'login.html';

function elemento(id) {
  return document.getElementById(id);
}

function iniciarDatos() {
  if (!localStorage.getItem(CLAVE_USUARIOS)) {
    const usuariosIniciales = [
      {
        id: 1,
        nombre: 'Administrador General',
        correo: 'admin@campus.com',
        contrasena: 'admin123',
        telefono: '0000000000',
        ubicacion: 'Oficina',
        rol: 'Administrador',
        activo: true
      }
    ];
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosIniciales));
  }

  if (!localStorage.getItem(CLAVE_PRODUCTOS)) {
    const productosIniciales = [
      {
        id: 1,
        nombre: 'Hamburguesa clásica',
        descripcion: 'Carne, queso, lechuga, tomate y papas.',
        precio: 89,
        categoria: 'Comidas',
        imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      },
      {
        id: 2,
        nombre: 'Torta de jamón',
        descripcion: 'Pan con jamón, queso, lechuga y aderezo.',
        precio: 52,
        categoria: 'Comidas',
        imagen: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      },
      {
        id: 3,
        nombre: 'Burrito de machaca',
        descripcion: 'Tortilla con machaca, frijoles y queso.',
        precio: 68,
        categoria: 'Comidas',
        imagen: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      },
      {
        id: 4,
        nombre: 'Papas con queso',
        descripcion: 'Papas medianas con queso derretido.',
        precio: 45,
        categoria: 'Snacks',
        imagen: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      },
      {
        id: 5,
        nombre: 'Refresco',
        descripcion: 'Lata de refresco de 355 ml.',
        precio: 25,
        categoria: 'Bebidas',
        imagen: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      },
      {
        id: 6,
        nombre: 'Café americano',
        descripcion: 'Café caliente de grano.',
        precio: 30,
        categoria: 'Bebidas',
        imagen: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      },
      {
        id: 7,
        nombre: 'Galletas caseras',
        descripcion: 'Paquete con 3 galletas.',
        precio: 28,
        categoria: 'Postres',
        imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80',
        disponible: true,
        calificacion: 0
      }
    ];

    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosIniciales));
  }

  if (!localStorage.getItem(CLAVE_PEDIDOS)) {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify([]));
  }

  if (!localStorage.getItem(CLAVE_CARRITO)) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([]));
  }
}

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

function obtenerProductos() {
  return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
}

function guardarProductos(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista));
}

function obtenerPedidos() {
  return JSON.parse(localStorage.getItem(CLAVE_PEDIDOS)) || [];
}

function guardarPedidos(lista) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista));
}

function obtenerSesion() {
  return JSON.parse(localStorage.getItem(CLAVE_SESION));
}

function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(lista) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lista));
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify([]));
  window.location.href = 'login.html';
}

function siguienteId(lista) {
  if (lista.length === 0) return 1;
  return Math.max(...lista.map(item => item.id)) + 1;
}

function mostrarMensaje(id, texto, tipo) {
  const caja = elemento(id);
  if (!caja) return;
  caja.className = 'mensaje ' + tipo;
  caja.textContent = texto;
}

function limpiarMensaje(id) {
  const caja = elemento(id);
  if (!caja) return;
  caja.className = 'mensaje';
  caja.textContent = '';
}

function formatoMoneda(numero) {
  return '$' + Number(numero).toFixed(2);
}

function formatoFecha(fecha) {
  return new Date(fecha).toLocaleString('es-MX');
}

function claseEstado(estado) {
  return estado.toLowerCase();
}

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function protegerPaginas() {
  const sesion = obtenerSesion();

  if (PAGINA_ACTUAL === 'login.html') {
    if (sesion) {
      if (sesion.rol === 'administrador') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }
    return;
  }

  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  if (PAGINA_ACTUAL === 'admin.html' && sesion.rol !== 'administrador') {
    window.location.href = 'index.html';
    return;
  }

  if (PAGINA_ACTUAL === 'index.html' && sesion.rol !== 'cliente') {
    window.location.href = 'admin.html';
  }
}

function actualizarBarraSesion() {
  const sesion = obtenerSesion();
  const textoSesion = elemento('textoSesion');
  const textoRol = elemento('textoRol');

  if (!textoSesion || !textoRol || !sesion) return;

  textoSesion.textContent = 'Sesión activa: ' + sesion.nombre + ' (' + sesion.correo + ')';
  textoRol.textContent = 'Rol: ' + sesion.rol;
}

function actualizarMetricasCliente() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'cliente') return;

  const carrito = obtenerCarrito();
  const pedidos = apiObtenerHistorialPedidos(sesion.id);

  const totalCarrito = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalPedidos = pedidos.length;
  const entregados = pedidos.filter(pedido => pedido.estado === 'entregado').length;

  if (elemento('metricaCarrito')) {
    elemento('metricaCarrito').textContent = totalCarrito;
  }

  if (elemento('metricaMisPedidos')) {
    elemento('metricaMisPedidos').textContent = totalPedidos;
  }

  if (elemento('metricaEntregados')) {
    elemento('metricaEntregados').textContent = entregados;
  }
}

function actualizarMetricasAdmin() {
  const pedidos = obtenerPedidos();
  const productos = obtenerProductos();
  const usuarios = obtenerUsuarios();

  const pendientes = pedidos.filter(pedido => pedido.estado === 'pendiente').length;
  const entregados = pedidos.filter(pedido => pedido.estado === 'entregado').length;
  const productosActivos = productos.filter(producto => producto.disponible).length;
  const clientes = usuarios.filter(usuario => usuario.rol === 'cliente').length;

  if (elemento('metricaPendientesAdmin')) {
    elemento('metricaPendientesAdmin').textContent = pendientes;
  }

  if (elemento('metricaEntregadosAdmin')) {
    elemento('metricaEntregadosAdmin').textContent = entregados;
  }

  if (elemento('metricaProductosActivosAdmin')) {
    elemento('metricaProductosActivosAdmin').textContent = productosActivos;
  }

  if (elemento('metricaClientesAdmin')) {
    elemento('metricaClientesAdmin').textContent = clientes;
  }
}

function apiRegistrarPedido(datosPedido) {
  const pedidos = obtenerPedidos();

  const nuevoPedido = {
    id: siguienteId(pedidos),
    folio: 'PED-' + Date.now().toString().slice(-6),
    usuarioId: datosPedido.usuarioId,
    cliente: datosPedido.cliente,
    productos: datosPedido.productos,
    total: datosPedido.total,
    estado: 'pendiente',
    direccion: datosPedido.direccion,
    notas: datosPedido.notas,
    fecha: new Date().toISOString(),
    valoracion: null,
    comentario: ''
  };

  pedidos.unshift(nuevoPedido);
  guardarPedidos(pedidos);
  return nuevoPedido;
}

function apiObtenerHistorialPedidos(usuarioId) {
  const pedidos = obtenerPedidos();
  return pedidos.filter(pedido => pedido.usuarioId === usuarioId);
}

function cargarCategorias() {
  const selector = elemento('filtrarCategoria');
  if (!selector) return;

  const productos = obtenerProductos().filter(producto => producto.disponible);
  const categorias = [...new Set(productos.map(producto => producto.categoria))];

  selector.innerHTML = '<option value="todas">Todas las categorías</option>';

  categorias.forEach(categoria => {
    selector.innerHTML += `<option value="${categoria}">${categoria}</option>`;
  });
}

function mostrarProductos() {
  const contenedor = elemento('listaProductos');
  const buscar = elemento('buscarProducto');
  const filtrar = elemento('filtrarCategoria');
  const ordenar = elemento('ordenarProductos');

  if (!contenedor || !buscar || !filtrar || !ordenar) return;

  const texto = buscar.value.trim().toLowerCase();
  const categoria = filtrar.value;
  const orden = ordenar.value;

  let productos = obtenerProductos().filter(producto => producto.disponible);

  if (texto) {
    productos = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto)
    );
  }

  if (categoria && categoria !== 'todas') {
    productos = productos.filter(producto => producto.categoria === categoria);
  }

  if (orden === 'menor') productos.sort((a, b) => a.precio - b.precio);
  if (orden === 'mayor') productos.sort((a, b) => b.precio - a.precio);
  if (orden === 'calificacion') productos.sort((a, b) => b.calificacion - a.calificacion);

  contenedor.innerHTML = '';

  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="tarjeta"><p>No hay productos para mostrar.</p></div>';
    return;
  }

  productos.forEach(producto => {
    contenedor.innerHTML += `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="contenido-producto">
          <span class="etiqueta">${producto.categoria}</span>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <div class="calificacion">
            Calificación: ${producto.calificacion ? producto.calificacion.toFixed(1) : 'Sin valoraciones'}
          </div>
          <div class="precio-fila">
            <span class="precio">${formatoMoneda(producto.precio)}</span>
            <button class="btn btn-primario" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
          </div>
        </div>
      </div>
    `;
  });
}

function agregarAlCarrito(idProducto) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.rol !== 'cliente') {
    alert('Debes iniciar sesión como cliente para agregar productos al pedido.');
    return;
  }

  const productos = obtenerProductos();
  const producto = productos.find(item => item.id === idProducto && item.disponible);

  if (!producto) return;

  let carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === idProducto);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

function mostrarCarrito() {
  const contenedor = elemento('listaCarrito');
  const textoTotal = elemento('textoTotal');

  if (!contenedor || !textoTotal) return;

  const carrito = obtenerCarrito();
  let total = 0;

  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<div class="tarjeta"><p>Tu carrito está vacío.</p></div>';
    textoTotal.textContent = '$0.00';
    actualizarMetricasCliente();
    return;
  }

  carrito.forEach(item => {
    total += item.precio * item.cantidad;

    contenedor.innerHTML += `
      <div class="item-carrito">
        <div class="fila">
          <div>
            <strong>${item.nombre}</strong>
            <p>${item.categoria}</p>
          </div>
          <strong>${formatoMoneda(item.precio * item.cantidad)}</strong>
        </div>
        <div class="controles">
          <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
          <button class="btn btn-rojo" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        </div>
      </div>
    `;
  });

  textoTotal.textContent = formatoMoneda(total);
  actualizarMetricasCliente();
}

function cambiarCantidad(idProducto, cambio) {
  let carrito = obtenerCarrito();
  const producto = carrito.find(item => item.id === idProducto);

  if (!producto) return;

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(item => item.id !== idProducto);
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

function eliminarDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter(item => item.id !== idProducto);
  guardarCarrito(carrito);
  mostrarCarrito();
}

function mostrarHistorial() {
  const contenedor = elemento('listaHistorial');
  if (!contenedor) return;

  const sesion = obtenerSesion();
  contenedor.innerHTML = '';

  if (!sesion || sesion.rol !== 'cliente') return;

  const pedidos = apiObtenerHistorialPedidos(sesion.id);

  if (pedidos.length === 0) {
    contenedor.innerHTML = '<p>No tienes pedidos registrados.</p>';
    actualizarMetricasCliente();
    return;
  }

  pedidos.forEach(pedido => {
    let productosHtml = '';

    pedido.productos.forEach(item => {
      productosHtml += `<li>${item.nombre} x${item.cantidad} - ${formatoMoneda(item.precio * item.cantidad)}</li>`;
    });

    let acciones = '';

    if (pedido.estado === 'pendiente') {
      acciones += `<button class="btn btn-rojo" onclick="cancelarPedido(${pedido.id})">Cancelar pedido</button>`;
    }

    if (pedido.estado === 'entregado' && !pedido.valoracion) {
      acciones += `
        <div class="espacio-arriba">
          <label>Valorar servicio (1 a 5)</label>
          <input type="number" min="1" max="5" class="campo" id="calificacion_${pedido.id}">
          <label class="espacio-arriba">Comentario</label>
          <textarea class="area-texto" id="comentario_${pedido.id}" rows="2"></textarea>
          <div class="acciones">
            <button class="btn btn-verde" onclick="valorarPedido(${pedido.id})">Guardar valoración</button>
          </div>
        </div>
      `;
    }

    if (pedido.valoracion) {
      acciones += `
        <p class="espacio-arriba">
          <strong>Valoración:</strong> ${pedido.valoracion}/5<br>
          <strong>Comentario:</strong> ${pedido.comentario || 'Sin comentario'}
        </p>
      `;
    }

    contenedor.innerHTML += `
      <div class="pedido">
        <div class="fila">
          <div>
            <h3>${pedido.folio}</h3>
            <p>Fecha: ${formatoFecha(pedido.fecha)}</p>
            <p>Entrega: ${pedido.direccion}</p>
          </div>
          <div>
            <div class="estado ${claseEstado(pedido.estado)}">${pedido.estado}</div>
            <p class="espacio-arriba"><strong>Total:</strong> ${formatoMoneda(pedido.total)}</p>
          </div>
        </div>

        <div class="espacio-arriba">
          <strong>Productos:</strong>
          <ul>${productosHtml}</ul>
        </div>

        <div class="acciones">${acciones}</div>
      </div>
    `;
  });

  actualizarMetricasCliente();
}

function cancelarPedido(idPedido) {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find(item => item.id === idPedido);

  if (!pedido || pedido.estado !== 'pendiente') return;

  pedido.estado = 'cancelado';
  guardarPedidos(pedidos);
  mostrarHistorial();
  mostrarPedidosAdmin();
}

function valorarPedido(idPedido) {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find(item => item.id === idPedido);

  if (!pedido) return;

  const calificacion = Number(elemento('calificacion_' + idPedido).value);
  const comentario = elemento('comentario_' + idPedido).value.trim();

  if (!calificacion || calificacion < 1 || calificacion > 5) {
    alert('La calificación debe ser de 1 a 5.');
    return;
  }

  pedido.valoracion = calificacion;
  pedido.comentario = comentario;

  guardarPedidos(pedidos);
  recalcularCalificacionProductos();
  mostrarHistorial();
  mostrarProductos();
}

function recalcularCalificacionProductos() {
  const pedidos = obtenerPedidos();
  const productos = obtenerProductos();

  productos.forEach(producto => {
    const valoraciones = [];

    pedidos.forEach(pedido => {
      const contieneProducto = pedido.productos.some(item => item.id === producto.id);

      if (pedido.valoracion && contieneProducto) {
        valoraciones.push(pedido.valoracion);
      }
    });

    if (valoraciones.length > 0) {
      const promedio = valoraciones.reduce((a, b) => a + b, 0) / valoraciones.length;
      producto.calificacion = promedio;
    } else {
      producto.calificacion = 0;
    }
  });

  guardarProductos(productos);
}

function mostrarTablaProductos() {
  const tabla = elemento('tablaProductos');
  if (!tabla) return;

  const productos = obtenerProductos();
  tabla.innerHTML = '';

  productos.forEach(producto => {
    tabla.innerHTML += `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>${formatoMoneda(producto.precio)}</td>
        <td>${producto.disponible ? 'Activo' : 'Inactivo'}</td>
        <td>
          <button class="btn btn-secundario" onclick="editarProducto(${producto.id})">Editar</button>
          ${
            producto.disponible
              ? `<button class="btn btn-rojo" onclick="eliminarProducto(${producto.id})">Eliminar</button>`
              : `<button class="btn btn-verde" onclick="reactivarProducto(${producto.id})">Reactivar</button>`
          }
        </td>
      </tr>
    `;
  });

  actualizarMetricasAdmin();
}

function editarProducto(idProducto) {
  const producto = obtenerProductos().find(item => item.id === idProducto);

  if (!producto) return;

  elemento('idProductoEditar').value = producto.id;
  elemento('nombreProducto').value = producto.nombre;
  elemento('descripcionProducto').value = producto.descripcion;
  elemento('precioProducto').value = producto.precio;
  elemento('categoriaProducto').value = producto.categoria;
  elemento('imagenProducto').value = producto.imagen;

  window.location.href = '#administrador';
}

function eliminarProducto(idProducto) {
  const productos = obtenerProductos();
  const producto = productos.find(item => item.id === idProducto);

  if (!producto) return;

  producto.disponible = false;
  guardarProductos(productos);
  mostrarTablaProductos();
  mostrarProductos();
  cargarCategorias();
}

function reactivarProducto(idProducto) {
  const productos = obtenerProductos();
  const producto = productos.find(item => item.id === idProducto);

  if (!producto) return;

  producto.disponible = true;
  guardarProductos(productos);
  mostrarTablaProductos();
  mostrarProductos();
  cargarCategorias();
}

function mostrarPedidosAdmin() {
  const tabla = elemento('tablaPedidosAdmin');
  if (!tabla) return;

  const pedidos = obtenerPedidos();
  tabla.innerHTML = '';

  if (pedidos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="6">No hay pedidos registrados.</td></tr>';
    actualizarMetricasAdmin();
    return;
  }

  pedidos.forEach(pedido => {
    let opciones = '';

    ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'].forEach(estado => {
      opciones += `<option value="${estado}" ${pedido.estado === estado ? 'selected' : ''}>${estado}</option>`;
    });

    tabla.innerHTML += `
      <tr>
        <td>${pedido.folio}</td>
        <td>${pedido.cliente}</td>
        <td>${formatoMoneda(pedido.total)}</td>
        <td>${pedido.estado}</td>
        <td>${formatoFecha(pedido.fecha)}</td>
        <td>
          <select class="selector" onchange="cambiarEstadoPedido(${pedido.id}, this.value)">
            ${opciones}
          </select>
        </td>
      </tr>
    `;
  });

  actualizarMetricasAdmin();
}

function cambiarEstadoPedido(idPedido, nuevoEstado) {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find(item => item.id === idPedido);

  if (!pedido) return;

  pedido.estado = nuevoEstado;
  guardarPedidos(pedidos);
  mostrarPedidosAdmin();
  mostrarHistorial();
}

function registrarEventos() {
  const formularioRegistro = elemento('formularioRegistro');
  if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', function(e) {
      e.preventDefault();
      limpiarMensaje('mensajeRegistro');

      const nombre = elemento('nombreRegistro').value.trim();
      const correo = elemento('correoRegistro').value.trim().toLowerCase();
      const contrasena = elemento('contrasenaRegistro').value.trim();
      const telefono = elemento('telefonoRegistro').value.trim();
      const ubicacion = elemento('ubicacionRegistro').value.trim();
      const usuarios = obtenerUsuarios();

      if (nombre.length < 3) {
        mostrarMensaje('mensajeRegistro', 'El nombre debe tener al menos 3 caracteres.', 'error');
        return;
      }

      if (!validarCorreo(correo)) {
        mostrarMensaje('mensajeRegistro', 'Ingresa un correo válido.', 'error');
        return;
      }

      if (usuarios.some(usuario => usuario.correo === correo)) {
        mostrarMensaje('mensajeRegistro', 'Ese correo ya está registrado.', 'error');
        return;
      }

      if (contrasena.length < 6) {
        mostrarMensaje('mensajeRegistro', 'La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
      }

      if (!/^\d{10,15}$/.test(telefono)) {
        mostrarMensaje('mensajeRegistro', 'El teléfono debe tener solo números y entre 10 y 15 dígitos.', 'error');
        return;
      }

      const nuevoUsuario = {
        id: siguienteId(usuarios),
        nombre,
        correo,
        contrasena,
        telefono,
        ubicacion,
        rol: 'cliente',
        activo: true
      };

      usuarios.push(nuevoUsuario);
      guardarUsuarios(usuarios);

      mostrarMensaje('mensajeRegistro', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.', 'exito');
      this.reset();
    });
  }

  const formularioInicioSesion = elemento('formularioInicioSesion');
  if (formularioInicioSesion) {
    formularioInicioSesion.addEventListener('submit', function(e) {
      e.preventDefault();
      limpiarMensaje('mensajeInicio');

      const correo = elemento('correoInicio').value.trim().toLowerCase();
      const contrasena = elemento('contrasenaInicio').value.trim();
      const usuarios = obtenerUsuarios();

      const usuario = usuarios.find(item =>
        item.correo === correo &&
        item.contrasena === contrasena &&
        item.activo
      );

      if (!usuario) {
        mostrarMensaje('mensajeInicio', 'Correo o contraseña incorrectos.', 'error');
        return;
      }

      guardarSesion(usuario);
      mostrarMensaje('mensajeInicio', 'Inicio de sesión correcto.', 'exito');
      this.reset();

      if (usuario.rol === 'administrador') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  const buscarProducto = elemento('buscarProducto');
  if (buscarProducto) {
    buscarProducto.addEventListener('input', mostrarProductos);
  }

  const filtrarCategoria = elemento('filtrarCategoria');
  if (filtrarCategoria) {
    filtrarCategoria.addEventListener('change', mostrarProductos);
  }

  const ordenarProductos = elemento('ordenarProductos');
  if (ordenarProductos) {
    ordenarProductos.addEventListener('change', mostrarProductos);
  }

  const botonVaciarCarrito = elemento('botonVaciarCarrito');
  if (botonVaciarCarrito) {
    botonVaciarCarrito.addEventListener('click', function() {
      guardarCarrito([]);
      mostrarCarrito();
    });
  }

  const ubicacionPedido = elemento('ubicacionPedido');
  if (ubicacionPedido) {
    ubicacionPedido.addEventListener('change', function() {
      const grupo = elemento('grupoOtraUbicacion');

      if (this.value === 'Otra ubicación') {
        grupo.classList.remove('oculto');
      } else {
        grupo.classList.add('oculto');
        elemento('otraUbicacionPedido').value = '';
      }
    });
  }

  const botonConfirmarPedido = elemento('botonConfirmarPedido');
  if (botonConfirmarPedido) {
    botonConfirmarPedido.addEventListener('click', function() {
      limpiarMensaje('mensajePedido');

      const sesion = obtenerSesion();
      const carrito = obtenerCarrito();
      const selector = elemento('ubicacionPedido').value;
      const otra = elemento('otraUbicacionPedido').value.trim();
      const notas = elemento('notasPedido').value.trim();

      if (!sesion || sesion.rol !== 'cliente') {
        mostrarMensaje('mensajePedido', 'Debes iniciar sesión como cliente.', 'error');
        return;
      }

      if (carrito.length === 0) {
        mostrarMensaje('mensajePedido', 'Debes agregar productos antes de confirmar.', 'error');
        return;
      }

      let direccion = selector;

      if (selector === 'Otra ubicación') {
        direccion = otra;
      }

      if (!direccion) {
        mostrarMensaje('mensajePedido', 'Debes seleccionar o escribir una ubicación válida.', 'error');
        return;
      }

      const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

      const pedido = apiRegistrarPedido({
        usuarioId: sesion.id,
        cliente: sesion.nombre,
        productos: carrito,
        total,
        direccion,
        notas
      });

      guardarCarrito([]);
      elemento('ubicacionPedido').value = '';
      elemento('otraUbicacionPedido').value = '';
      elemento('notasPedido').value = '';
      elemento('grupoOtraUbicacion').classList.add('oculto');

      mostrarMensaje(
        'mensajePedido',
        'Pedido confirmado. Folio: ' + pedido.folio + '. Total: ' + formatoMoneda(pedido.total),
        'exito'
      );

      mostrarCarrito();
      mostrarHistorial();
      mostrarPedidosAdmin();
    });
  }

  const formularioProducto = elemento('formularioProducto');
  if (formularioProducto) {
    formularioProducto.addEventListener('submit', function(e) {
      e.preventDefault();
      limpiarMensaje('mensajeProducto');

      const sesion = obtenerSesion();

      if (!sesion || sesion.rol !== 'administrador') {
        mostrarMensaje('mensajeProducto', 'Solo el administrador puede hacer esta acción.', 'error');
        return;
      }

      const idEditar = elemento('idProductoEditar').value;
      const nombre = elemento('nombreProducto').value.trim();
      const descripcion = elemento('descripcionProducto').value.trim();
      const precio = Number(elemento('precioProducto').value);
      const categoria = elemento('categoriaProducto').value.trim();
      const imagen = elemento('imagenProducto').value.trim();
      const productos = obtenerProductos();

      if (nombre.length < 3 || descripcion.length < 5 || categoria.length < 3 || !imagen) {
        mostrarMensaje('mensajeProducto', 'Completa correctamente todos los campos.', 'error');
        return;
      }

      if (precio <= 0 || isNaN(precio)) {
        mostrarMensaje('mensajeProducto', 'El precio debe ser mayor que cero.', 'error');
        return;
      }

      if (idEditar) {
        const producto = productos.find(item => item.id === Number(idEditar));

        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.imagen = imagen;

        mostrarMensaje('mensajeProducto', 'Producto actualizado correctamente.', 'exito');
      } else {
        productos.push({
          id: siguienteId(productos),
          nombre,
          descripcion,
          precio,
          categoria,
          imagen,
          disponible: true,
          calificacion: 0
        });

        mostrarMensaje('mensajeProducto', 'Producto agregado correctamente.', 'exito');
      }

      guardarProductos(productos);
      this.reset();
      elemento('idProductoEditar').value = '';
      mostrarTablaProductos();
      mostrarProductos();
      cargarCategorias();
    });
  }

  const botonCancelarEdicion = elemento('botonCancelarEdicion');
  if (botonCancelarEdicion) {
    botonCancelarEdicion.addEventListener('click', function() {
      elemento('formularioProducto').reset();
      elemento('idProductoEditar').value = '';
      limpiarMensaje('mensajeProducto');
    });
  }

  const botonCerrarSesion = elemento('botonCerrarSesion');
  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', cerrarSesion);
  }
}

function actualizarPantalla() {
  actualizarBarraSesion();
  cargarCategorias();
  mostrarProductos();
  mostrarCarrito();
  mostrarHistorial();
  mostrarTablaProductos();
  mostrarPedidosAdmin();
  actualizarMetricasCliente();
  actualizarMetricasAdmin();
}

iniciarDatos();
protegerPaginas();
registrarEventos();
actualizarPantalla();