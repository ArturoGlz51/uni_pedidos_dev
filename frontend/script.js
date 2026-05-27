const API_URL = 'http://localhost:3000/api';

const CLAVE_SESION = 'unipedidos_sesion';
const CLAVE_CARRITO = 'unipedidos_carrito';

const PAGINA_ACTUAL = document.body.dataset.pagina || 'login';

let paginaProductosAdmin = 1;
const productosPorPaginaAdmin = 4;

let paginaProductosCliente = 1;
const productosPorPaginaCliente = 6;

function elemento(id) {
  return document.getElementById(id);
}

function irA(pagina) {
  const url = new URL(pagina, window.location.href);
  window.location.replace(url.href);
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

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify([]));
  irA('login.html');
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

  if (PAGINA_ACTUAL === 'login') {
    if (sesion) {
      if (sesion.rol === 'administrador') {
        irA('admin.html');
      } else {
        irA('index.html');
      }
    }
    return;
  }

  if (!sesion) {
    irA('login.html');
    return;
  }

  if (PAGINA_ACTUAL === 'admin' && sesion.rol !== 'administrador') {
    irA('index.html');
    return;
  }

  if (PAGINA_ACTUAL === 'cliente' && sesion.rol !== 'cliente') {
    irA('admin.html');
  }
}

function actualizarBarraSesion() {
  const sesion = obtenerSesion();
  const textoSesion = elemento('textoSesion');
  const textoRol = elemento('textoRol');

  if (!textoSesion || !textoRol || !sesion) return;

  textoSesion.textContent = sesion.nombre + ' (' + sesion.correo + ')';
  textoRol.textContent = 'Rol: ' + sesion.rol;
}

async function iniciarSesionApi(correo, contrasena) {
  const respuesta = await fetch(API_URL + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correo, contrasena })
  });

  if (!respuesta.ok) {
    return null;
  }

  return await respuesta.json();
}

async function agregarUsuario(nombre, correo, contrasena, telefono, ubicacion) {
  const respuesta = await fetch(API_URL + '/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre,
      correo,
      contrasena,
      telefono,
      ubicacion,
      rol: 'cliente'
    })
  });

  return respuesta;
}

async function obtenerUsuarios() {
  const respuesta = await fetch(API_URL + '/usuarios');
  return await respuesta.json();
}

async function obtenerProductos() {
  const respuesta = await fetch(API_URL + '/productos');
  return await respuesta.json();
}

async function agregarProductoApi(producto) {
  const respuesta = await fetch(API_URL + '/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  });

  return respuesta;
}

async function actualizarProductoApi(id, producto) {
  const respuesta = await fetch(API_URL + '/productos/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  });

  return respuesta;
}

async function eliminarProductoApi(id) {
  const respuesta = await fetch(API_URL + '/productos/' + id, {
    method: 'DELETE'
  });

  return respuesta;
}

async function obtenerPedidos() {
  const respuesta = await fetch(API_URL + '/pedidos');
  return await respuesta.json();
}

async function obtenerPedidosUsuario(idUsuario) {
  const respuesta = await fetch(API_URL + '/pedidos/usuario/' + idUsuario);
  return await respuesta.json();
}

async function agregarPedidoApi(pedido) {
  const respuesta = await fetch(API_URL + '/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });

  return respuesta;
}

async function actualizarPedidoApi(id, datos) {
  const respuesta = await fetch(API_URL + '/pedidos/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });

  return respuesta;
}

async function eliminarPedidoApi(id) {
  const respuesta = await fetch(API_URL + '/pedidos/' + id, {
    method: 'DELETE'
  });

  return respuesta;
}

async function actualizarMetricasCliente() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'cliente') return;

  const carrito = obtenerCarrito();
  const pedidos = await obtenerPedidosUsuario(sesion.id);

  const totalCarrito = carrito.reduce(function(suma, item) {
    return suma + item.cantidad;
  }, 0);

  const entregados = pedidos.filter(function(pedido) {
    return pedido.estado === 'entregado';
  }).length;

  if (elemento('metricaCarrito')) {
    elemento('metricaCarrito').textContent = totalCarrito;
  }

  if (elemento('metricaMisPedidos')) {
    elemento('metricaMisPedidos').textContent = pedidos.length;
  }

  if (elemento('metricaEntregados')) {
    elemento('metricaEntregados').textContent = entregados;
  }
}

async function actualizarMetricasAdmin() {
  const pendientesAdmin = elemento('metricaPendientesAdmin');
  const entregadosAdmin = elemento('metricaEntregadosAdmin');
  const productosActivosAdmin = elemento('metricaProductosActivosAdmin');
  const clientesAdmin = elemento('metricaClientesAdmin');

  if (!pendientesAdmin && !entregadosAdmin && !productosActivosAdmin && !clientesAdmin) return;

  const pedidos = await obtenerPedidos();
  const productos = await obtenerProductos();
  const usuarios = await obtenerUsuarios();

  const pendientes = pedidos.filter(function(pedido) {
    return pedido.estado === 'pendiente';
  }).length;

  const entregados = pedidos.filter(function(pedido) {
    return pedido.estado === 'entregado';
  }).length;

  const productosActivos = productos.filter(function(producto) {
    return producto.disponible === 1;
  }).length;

  const clientes = usuarios.filter(function(usuario) {
    return usuario.rol === 'cliente';
  }).length;

  if (pendientesAdmin) pendientesAdmin.textContent = pendientes;
  if (entregadosAdmin) entregadosAdmin.textContent = entregados;
  if (productosActivosAdmin) productosActivosAdmin.textContent = productosActivos;
  if (clientesAdmin) clientesAdmin.textContent = clientes;
}

async function cargarCategorias() {
  const selector = elemento('filtrarCategoria');
  if (!selector) return;

  const productos = await obtenerProductos();

  const productosActivos = productos.filter(function(producto) {
    return producto.disponible === 1;
  });

  const categorias = [];

  productosActivos.forEach(function(producto) {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });

  selector.innerHTML = '<option value="todas">Todas las categorías</option>';

  categorias.forEach(function(categoria) {
    selector.innerHTML += '<option value="' + categoria + '">' + categoria + '</option>';
  });
}

async function mostrarProductos() {
  const contenedor = elemento('listaProductos');
  const buscar = elemento('buscarProducto');
  const filtrar = elemento('filtrarCategoria');
  const ordenar = elemento('ordenarProductos');
  const paginacion = elemento('paginacionProductosCliente');
  const contador = elemento('contadorProductosCliente');

  if (!contenedor || !buscar || !filtrar || !ordenar) return;

  const texto = buscar.value.trim().toLowerCase();
  const categoria = filtrar.value;
  const orden = ordenar.value;

  let productos = await obtenerProductos();

  productos = productos.filter(function(producto) {
    return producto.disponible === 1;
  });

  if (texto) {
    productos = productos.filter(function(producto) {
      return producto.nombre.toLowerCase().includes(texto);
    });
  }

  if (categoria && categoria !== 'todas') {
    productos = productos.filter(function(producto) {
      return producto.categoria === categoria;
    });
  }

  if (orden === 'menor') {
    productos.sort(function(a, b) {
      return a.precio - b.precio;
    });
  }

  if (orden === 'mayor') {
    productos.sort(function(a, b) {
      return b.precio - a.precio;
    });
  }

  if (orden === 'calificacion') {
    productos.sort(function(a, b) {
      return b.calificacion - a.calificacion;
    });
  }

  contenedor.innerHTML = '';

  if (paginacion) {
    paginacion.innerHTML = '';
  }

  if (contador) {
    contador.textContent = '';
  }

  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="sin-datos">No hay productos para mostrar.</div>';
    return;
  }

  const totalProductos = productos.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPaginaCliente);

  if (paginaProductosCliente > totalPaginas) {
    paginaProductosCliente = totalPaginas;
  }

  const inicio = (paginaProductosCliente - 1) * productosPorPaginaCliente;
  const fin = inicio + productosPorPaginaCliente;
  const productosPagina = productos.slice(inicio, fin);

  if (contador) {
    contador.textContent = 'Mostrando ' + (inicio + 1) + ' - ' + Math.min(fin, totalProductos) + ' de ' + totalProductos + ' productos';
  }

  productosPagina.forEach(function(producto) {
    contenedor.innerHTML += `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="contenido-producto">
          <span class="etiqueta">${producto.categoria}</span>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <div class="calificacion">
            Calificación: ${producto.calificacion ? Number(producto.calificacion).toFixed(1) : 'Sin valoraciones'}
          </div>
          <div class="precio-fila">
            <span class="precio">${formatoMoneda(producto.precio)}</span>
            <button class="btn btn-primario" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
          </div>
        </div>
      </div>
    `;
  });

  if (paginacion && totalPaginas > 1) {
    for (let i = 1; i <= totalPaginas; i++) {
      paginacion.innerHTML += `
        <button class="boton-pagina-producto ${i === paginaProductosCliente ? 'activa' : ''}" onclick="cambiarPaginaProductosCliente(${i})">
          ${i}
        </button>
      `;
    }
  }
}

async function cambiarPaginaProductosCliente(pagina) {
  paginaProductosCliente = pagina;
  await mostrarProductos();

  const menu = elemento('menu');

  if (menu) {
    menu.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function reiniciarPaginaProductosCliente() {
  paginaProductosCliente = 1;
  mostrarProductos();
}

async function agregarAlCarrito(idProducto) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.rol !== 'cliente') {
    alert('Debes iniciar sesión como cliente.');
    return;
  }

  const productos = await obtenerProductos();

  const producto = productos.find(function(item) {
    return item.id === idProducto && item.disponible === 1;
  });

  if (!producto) {
    alert('Producto no disponible.');
    return;
  }

  let carrito = obtenerCarrito();

  const existente = carrito.find(function(item) {
    return item.id === idProducto;
  });

  if (existente) {
    existente.cantidad++;
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
    contenedor.innerHTML = '<div class="sin-datos">Tu carrito está vacío.</div>';
    textoTotal.textContent = '$0.00';
    actualizarMetricasCliente();
    return;
  }

  carrito.forEach(function(item) {
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

  const producto = carrito.find(function(item) {
    return item.id === idProducto;
  });

  if (!producto) return;

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(function(item) {
      return item.id !== idProducto;
    });
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

function eliminarDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter(function(item) {
    return item.id !== idProducto;
  });

  guardarCarrito(carrito);
  mostrarCarrito();
}

async function confirmarPedido() {
  limpiarMensaje('mensajePedido');

  const sesion = obtenerSesion();
  const carrito = obtenerCarrito();
  const ubicacion = elemento('ubicacionPedido').value;
  const otraUbicacion = elemento('otraUbicacionPedido').value.trim();
  const notas = elemento('notasPedido').value.trim();

  if (!sesion || sesion.rol !== 'cliente') {
    mostrarMensaje('mensajePedido', 'Debes iniciar sesión como cliente.', 'error');
    return;
  }

  if (carrito.length === 0) {
    mostrarMensaje('mensajePedido', 'Debes agregar productos antes de confirmar.', 'error');
    return;
  }

  let direccion = ubicacion;

  if (ubicacion === 'Otra ubicación') {
    direccion = otraUbicacion;
  }

  if (!direccion) {
    mostrarMensaje('mensajePedido', 'Debes seleccionar o escribir una ubicación válida.', 'error');
    return;
  }

  const pedido = {
    usuarioId: sesion.id,
    direccion: direccion,
    notas: notas,
    productos: carrito
  };

  const respuesta = await agregarPedidoApi(pedido);

  if (!respuesta.ok) {
    mostrarMensaje('mensajePedido', 'Error al registrar el pedido.', 'error');
    return;
  }

  const pedidoGuardado = await respuesta.json();

  guardarCarrito([]);

  elemento('ubicacionPedido').value = '';
  elemento('otraUbicacionPedido').value = '';
  elemento('notasPedido').value = '';
  elemento('grupoOtraUbicacion').classList.add('oculto');

  mostrarMensaje(
    'mensajePedido',
    'Pedido confirmado. Folio: ' + pedidoGuardado.folio + '. Total: ' + formatoMoneda(pedidoGuardado.total),
    'exito'
  );

  mostrarCarrito();
  await mostrarHistorial();
  await actualizarMetricasCliente();
}

async function mostrarHistorial() {
  const contenedor = elemento('listaHistorial');
  if (!contenedor) return;

  const sesion = obtenerSesion();
  contenedor.innerHTML = '';

  if (!sesion || sesion.rol !== 'cliente') return;

  const pedidos = await obtenerPedidosUsuario(sesion.id);

  if (pedidos.length === 0) {
    contenedor.innerHTML = '<div class="sin-datos">No tienes pedidos registrados.</div>';
    actualizarMetricasCliente();
    return;
  }

  pedidos.forEach(function(pedido) {
    let productosHtml = '';

    pedido.productos.forEach(function(item) {
      productosHtml += '<li>' + item.nombre + ' x' + item.cantidad + ' - ' + formatoMoneda(item.precio * item.cantidad) + '</li>';
    });

    let acciones = '';

    if (pedido.estado === 'pendiente') {
      acciones += '<button class="btn btn-rojo" onclick="cancelarPedido(' + pedido.id + ')">Cancelar pedido</button>';
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

async function cancelarPedido(idPedido) {
  const respuesta = await eliminarPedidoApi(idPedido);

  if (!respuesta.ok) {
    alert('No se pudo cancelar el pedido.');
    return;
  }

  await mostrarHistorial();
  await actualizarMetricasCliente();
}

async function valorarPedido(idPedido) {
  const calificacion = Number(elemento('calificacion_' + idPedido).value);
  const comentario = elemento('comentario_' + idPedido).value.trim();

  if (!calificacion || calificacion < 1 || calificacion > 5) {
    alert('La calificación debe ser de 1 a 5.');
    return;
  }

  const respuesta = await actualizarPedidoApi(idPedido, {
    valoracion: calificacion,
    comentario: comentario
  });

  if (!respuesta.ok) {
    alert('No se pudo guardar la valoración.');
    return;
  }

  await mostrarHistorial();
  await mostrarProductos();
  await actualizarMetricasCliente();
  await mostrarResenasAdmin();
}

async function mostrarTablaProductos() {
  const contenedor = elemento('contenedorProductosAdmin');
  const paginacion = elemento('paginacionProductosAdmin');

  if (!contenedor || !paginacion) return;

  const productos = await obtenerProductos();

  contenedor.innerHTML = '';
  paginacion.innerHTML = '';

  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="sin-datos">No hay productos registrados.</div>';
    await actualizarMetricasAdmin();
    return;
  }

  const totalPaginas = Math.ceil(productos.length / productosPorPaginaAdmin);

  if (paginaProductosAdmin > totalPaginas) {
    paginaProductosAdmin = totalPaginas;
  }

  const inicio = (paginaProductosAdmin - 1) * productosPorPaginaAdmin;
  const fin = inicio + productosPorPaginaAdmin;
  const productosPagina = productos.slice(inicio, fin);

  productosPagina.forEach(function(producto) {
    const estadoClase = producto.disponible === 1 ? 'estado-activo' : 'estado-inactivo';
    const estadoTexto = producto.disponible === 1 ? 'Activo' : 'Inactivo';

    contenedor.innerHTML += `
      <div class="card-producto-admin">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="card-producto-admin-contenido">
          <span class="etiqueta">${producto.categoria}</span>
          <h4>${producto.nombre}</h4>
          <p>${producto.descripcion || 'Sin descripción'}</p>

          <div class="fila">
            <span class="precio-admin">${formatoMoneda(producto.precio)}</span>
            <span class="estado-producto-admin ${estadoClase}">${estadoTexto}</span>
          </div>

          <div class="acciones-producto-admin">
            <button class="btn btn-secundario" onclick="editarProducto(${producto.id})">Editar</button>
            ${
              producto.disponible === 1
                ? `<button class="btn btn-rojo" onclick="eliminarProducto(${producto.id})">Eliminar</button>`
                : `<button class="btn btn-verde" onclick="reactivarProducto(${producto.id})">Reactivar</button>`
            }
          </div>
        </div>
      </div>
    `;
  });

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <button class="boton-pagina ${i === paginaProductosAdmin ? 'activa' : ''}" onclick="cambiarPaginaProductosAdmin(${i})">
        ${i}
      </button>
    `;
  }

  await actualizarMetricasAdmin();
}

async function cambiarPaginaProductosAdmin(pagina) {
  paginaProductosAdmin = pagina;
  await mostrarTablaProductos();
}

async function editarProducto(idProducto) {
  const productos = await obtenerProductos();

  const producto = productos.find(function(item) {
    return item.id === idProducto;
  });

  if (!producto) return;

  elemento('idProductoEditar').value = producto.id;
  elemento('nombreProducto').value = producto.nombre;
  elemento('descripcionProducto').value = producto.descripcion;
  elemento('precioProducto').value = producto.precio;
  elemento('categoriaProducto').value = producto.categoria;
  elemento('imagenProducto').value = producto.imagen;

  window.location.href = '#productos-admin';
}

async function eliminarProducto(idProducto) {
  const respuesta = await eliminarProductoApi(idProducto);

  if (!respuesta.ok) {
    alert('No se pudo eliminar el producto.');
    return;
  }

  await mostrarTablaProductos();
  await mostrarProductos();
  await cargarCategorias();
}

async function reactivarProducto(idProducto) {
  const productos = await obtenerProductos();

  const producto = productos.find(function(item) {
    return item.id === idProducto;
  });

  if (!producto) return;

  producto.disponible = 1;

  const respuesta = await actualizarProductoApi(idProducto, producto);

  if (!respuesta.ok) {
    alert('No se pudo reactivar el producto.');
    return;
  }

  await mostrarTablaProductos();
  await mostrarProductos();
  await cargarCategorias();
}

async function mostrarResenasAdmin() {
  const contenedor = elemento('listaResenasAdmin');

  if (!contenedor) return;

  const pedidos = await obtenerPedidos();

  const pedidosConResena = pedidos.filter(function(pedido) {
    return pedido.valoracion;
  });

  contenedor.innerHTML = '';

  if (pedidosConResena.length === 0) {
    contenedor.innerHTML = '<div class="sin-datos">Todavía no hay reseñas registradas por los clientes.</div>';
    return;
  }

  pedidosConResena.forEach(function(pedido) {
    let estrellas = '';

    for (let i = 1; i <= 5; i++) {
      estrellas += i <= pedido.valoracion ? '★' : '☆';
    }

    contenedor.innerHTML += `
      <div class="card-resena-admin">
        <h4>${pedido.cliente}</h4>
        <p><strong>Pedido:</strong> ${pedido.folio}</p>
        <p><strong>Fecha:</strong> ${formatoFecha(pedido.fecha)}</p>
        <div class="estrellas-resena">${estrellas} ${pedido.valoracion}/5</div>
        <div class="comentario-resena">
          ${pedido.comentario || 'Sin comentario escrito.'}
        </div>
      </div>
    `;
  });
}

async function mostrarPedidosAdmin() {
  const tabla = elemento('tablaPedidosAdmin');
  if (!tabla) return;

  const pedidos = await obtenerPedidos();

  tabla.innerHTML = '';

  if (pedidos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="6">No hay pedidos registrados.</td></tr>';
    await actualizarMetricasAdmin();
    return;
  }

  pedidos.forEach(function(pedido) {
    const estados = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
    let opciones = '';

    estados.forEach(function(estado) {
      opciones += '<option value="' + estado + '"' + (pedido.estado === estado ? ' selected' : '') + '>' + estado + '</option>';
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

  await actualizarMetricasAdmin();
}

async function cambiarEstadoPedido(idPedido, nuevoEstado) {
  const respuesta = await actualizarPedidoApi(idPedido, {
    estado: nuevoEstado
  });

  if (!respuesta.ok) {
    alert('No se pudo cambiar el estado.');
    return;
  }

  await mostrarPedidosAdmin();
  await mostrarResenasAdmin();
}

function registrarEventos() {
  const formularioRegistro = elemento('formularioRegistro');

  if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', async function(evento) {
      evento.preventDefault();

      limpiarMensaje('mensajeRegistro');

      const nombre = elemento('nombreRegistro').value.trim();
      const correo = elemento('correoRegistro').value.trim().toLowerCase();
      const contrasena = elemento('contrasenaRegistro').value.trim();
      const telefono = elemento('telefonoRegistro').value.trim();
      const ubicacion = elemento('ubicacionRegistro').value.trim();

      if (nombre.length < 3) {
        mostrarMensaje('mensajeRegistro', 'El nombre debe tener al menos 3 caracteres.', 'error');
        return;
      }

      if (!validarCorreo(correo)) {
        mostrarMensaje('mensajeRegistro', 'Ingresa un correo válido.', 'error');
        return;
      }

      if (contrasena.length < 6) {
        mostrarMensaje('mensajeRegistro', 'La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
      }

      if (!telefono) {
        mostrarMensaje('mensajeRegistro', 'El teléfono es obligatorio.', 'error');
        return;
      }

      const respuesta = await agregarUsuario(nombre, correo, contrasena, telefono, ubicacion);

      if (!respuesta.ok) {
        mostrarMensaje('mensajeRegistro', 'No se pudo registrar. Puede que el correo ya exista.', 'error');
        return;
      }

      mostrarMensaje('mensajeRegistro', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.', 'exito');
      this.reset();
    });
  }

  const formularioInicioSesion = elemento('formularioInicioSesion');

  if (formularioInicioSesion) {
    formularioInicioSesion.addEventListener('submit', async function(evento) {
      evento.preventDefault();

      limpiarMensaje('mensajeInicio');

      const correo = elemento('correoInicio').value.trim().toLowerCase();
      const contrasena = elemento('contrasenaInicio').value.trim();

      const usuario = await iniciarSesionApi(correo, contrasena);

      if (!usuario) {
        mostrarMensaje('mensajeInicio', 'Correo o contraseña incorrectos.', 'error');
        return;
      }

      guardarSesion(usuario);
      mostrarMensaje('mensajeInicio', 'Inicio de sesión correcto.', 'exito');

      if (usuario.rol === 'administrador') {
        irA('admin.html');
      } else {
        irA('index.html');
      }
    });
  }

  const buscarProducto = elemento('buscarProducto');
  if (buscarProducto) {
    buscarProducto.addEventListener('input', reiniciarPaginaProductosCliente);
  }

  const filtrarCategoria = elemento('filtrarCategoria');
  if (filtrarCategoria) {
    filtrarCategoria.addEventListener('change', reiniciarPaginaProductosCliente);
  }

  const ordenarProductos = elemento('ordenarProductos');
  if (ordenarProductos) {
    ordenarProductos.addEventListener('change', reiniciarPaginaProductosCliente);
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
    botonConfirmarPedido.addEventListener('click', confirmarPedido);
  }

  const formularioProducto = elemento('formularioProducto');

  if (formularioProducto) {
    formularioProducto.addEventListener('submit', async function(evento) {
      evento.preventDefault();

      limpiarMensaje('mensajeProducto');

      const idEditar = elemento('idProductoEditar').value;
      const nombre = elemento('nombreProducto').value.trim();
      const descripcion = elemento('descripcionProducto').value.trim();
      const precio = Number(elemento('precioProducto').value);
      const categoria = elemento('categoriaProducto').value.trim();
      const imagen = elemento('imagenProducto').value.trim();

      if (nombre.length < 3 || descripcion.length < 5 || categoria.length < 3 || !imagen) {
        mostrarMensaje('mensajeProducto', 'Completa correctamente todos los campos.', 'error');
        return;
      }

      if (precio <= 0 || isNaN(precio)) {
        mostrarMensaje('mensajeProducto', 'El precio debe ser mayor que cero.', 'error');
        return;
      }

      let respuesta;

      if (idEditar) {
        const productos = await obtenerProductos();

        const productoActual = productos.find(function(item) {
          return item.id === Number(idEditar);
        });

        respuesta = await actualizarProductoApi(idEditar, {
          nombre: nombre,
          descripcion: descripcion,
          precio: precio,
          categoria: categoria,
          imagen: imagen,
          disponible: productoActual ? productoActual.disponible : 1,
          calificacion: productoActual ? productoActual.calificacion : 0
        });
      } else {
        respuesta = await agregarProductoApi({
          nombre: nombre,
          descripcion: descripcion,
          precio: precio,
          categoria: categoria,
          imagen: imagen
        });
      }

      if (!respuesta.ok) {
        mostrarMensaje('mensajeProducto', 'No se pudo guardar el producto.', 'error');
        return;
      }

      mostrarMensaje('mensajeProducto', 'Producto guardado correctamente.', 'exito');

      this.reset();
      elemento('idProductoEditar').value = '';

      await mostrarTablaProductos();
      await mostrarProductos();
      await cargarCategorias();
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

// Función para actualizar toda la pantalla (se usa para cargar, mostrar y cuando se acutalizan datos como las metricas)

async function actualizarPantalla() {
  actualizarBarraSesion();

  await cargarCategorias();
  await mostrarProductos();
  mostrarCarrito();
  await mostrarHistorial();
  await mostrarTablaProductos();
  await mostrarPedidosAdmin();
  await mostrarResenasAdmin();
  await actualizarMetricasCliente();
  await actualizarMetricasAdmin();
}

protegerPaginas();
registrarEventos();
actualizarPantalla();