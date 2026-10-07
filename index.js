//URL base de la API, (fakestoreapi NO esta funcionando).
const API_URL = "https://dummyjson.com/products";

const [method, resource, ...args] = process.argv.slice(2);

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json();

  //Mensaje de error de estado HTTP.
  if (!response.ok) {
    throw new Error(data.message || `Error HTTP: ${response.status}`);
  }
  //Devuelve los datos obtenidos.
  return data;
};

//Consulta todos los productos disponibles y lo muestra en consola.
const getAllProducts = async () => {
  const { products } = await request(`${API_URL}?limit=0`);
  console.log(products);
};

//Consulta productos por su ID y lo muestra en consola.
const getProductById = async (productId) => {
  const product = await request(`${API_URL}/${productId}`);
  console.log(product);
};

//Crea un producto nuevo si envia los tres datos.
const createProduct = async (title, price, category) => {
  if (!title || !price || !category) {
    throw new Error(
      "Uso: npm run start POST products <title> <price> <category>"
    );
  }

//Verifica que el precio sea un numero valido.
  if (Number.isNaN(Number(price))) {
    throw new Error("El precio debe ser un número.");
  }

//Solicitud para crear el prodcuto.
  const newProduct = await request(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      price: Number(price),
      category
    })
  });
//Muestra el producto creado en consola.
  console.log(newProduct);
};

//Elimina el producto por su ID.
const deleteProduct = async (productId) => {
  const deletedProduct = await request(`${API_URL}/${productId}`, {
    method: "DELETE"
  });
//Muestra el producto borrado en consola.
  console.log(deletedProduct);
};

try {
//Busca recursos con formato products/ID.
  const productById = resource?.match(/^products\/(\d+)$/);
//Consulta todos los productos.
  if (method === "GET" && resource === "products") {
    await getAllProducts();
//Consulta por ID del producto.
  } else if (method === "GET" && productById) {
    await getProductById(productById[1]);
//Crea el producto (title,price,category)
  } else if (method === "POST" && resource === "products") {
    const [title, price, category] = args;
    await createProduct(title, price, category);
//Elimina el producto por su ID.
  } else if (method === "DELETE" && productById) {
    await deleteProduct(productById[1]);
//Si no coincide con ningun comando.
  } else {
    throw new Error(
      `Comando inválido.`
    );
  }
} catch (error) {
//Captura errores de conexion.
  console.error("Error:", error.message);
}
