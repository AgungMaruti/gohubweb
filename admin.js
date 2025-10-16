const API_URL = "http://localhost:8080/api/menu";

async function loadProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const tbody = document.querySelector("#productTable tbody");

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.description}</td>
      <td><img src="${item.image}" width="60"></td>
      <td>${item.category}</td>
      <td>
        <button onclick="editProduct(${item.id})">Edit</button>
        <button onclick="deleteProduct(${item.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = document.getElementById("productId").value;
  const newProduct = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    image: document.getElementById("image").value,
    category: document.getElementById("category").value
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
  });

  e.target.reset();
  document.getElementById("productId").value = "";
  loadProducts();
});

async function editProduct(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const product = await res.json();

  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("description").value = product.description;
  document.getElementById("image").value = product.image;
  document.getElementById("category").value = product.category;
}

async function deleteProduct(id) {
  if (confirm("Yakin ingin menghapus produk ini?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadProducts();
  }
}

loadProducts();

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  document.getElementById('preview').src = data.path;
  alert('Gambar berhasil diupload ke: ' + data.path);
});
