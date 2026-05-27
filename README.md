 <h1>UniPedidos</h1>

  <p>
    UniPedidos es un sistema web para la gestión de pedidos dentro de una cafetería universitaria.
    El proyecto cuenta con un frontend desarrollado con HTML, CSS y JavaScript, y un backend
    construido con Node.js, Express y SQLite.
  </p>

  <p>
    El sistema permite registrar clientes, iniciar sesión, visualizar productos, agregar productos
    al carrito, confirmar pedidos, consultar historial, administrar productos y cambiar el estado
    de los pedidos desde el panel de administrador.
  </p>

  <h2>Instrucciones para ejecutar el proyecto</h2>

  <h3>1. Instalar dependencias del backend</h3>

  <p>
    Abre una terminal en la carpeta del proyecto y entra a la carpeta <strong>backend</strong>:
  </p>

  <pre><code>cd backend</code></pre>

  <p>
    Después instala las dependencias:
  </p>

  <pre><code>npm install</code></pre>

  <h3>2. Ejecutar el servidor</h3>

  <p>
    Dentro de la carpeta <strong>backend</strong>, ejecuta:
  </p>

  <pre><code>npm run dev</code></pre>

  <p>
    Si todo está correcto, el servidor se iniciará en:
  </p>

  <pre><code>http://localhost:3000</code></pre>

  <h3>3. Abrir el frontend</h3>

  <p>
    Abre la carpeta <strong>frontend</strong> y ejecuta el archivo:
  </p>

  <pre><code>login.html</code></pre>

  <p>
    Puedes abrirlo directamente en el navegador.
  </p>

  <h3>4. Usuario administrador inicial</h3>

  <p>
    Para entrar al panel de administrador utiliza:
  </p>

  <pre><code>Correo: admin@campus.com
Contraseña: admin123</code></pre>

  <h3>5. Nota importante</h3>

  <p>
    El backend debe estar ejecutándose para que el sistema funcione correctamente, ya que el
    frontend se conecta a la API mediante <strong>fetch</strong>.
  </p>

  <p>
    GitHub Pages solo permite publicar archivos estáticos, por lo que para probar el sistema
    completo es necesario ejecutar el backend localmente.
  </p>