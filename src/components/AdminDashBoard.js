"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Card, Col, Row, Spinner, Modal, Button } from "react-bootstrap";
import DsTable from "./ds-table/DsTable";
import UserProfile from "./navbar/UserProfile";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    description: "",
    stockQty: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [preview, setPreview] = useState(null);
  const { logout } = useAuth();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        order_direction: "desc",
        order_key: "hosts_count",
        page,
        size: perPage,
      }).toString();

      const response = await fetch(`/api/products/fetchProducts?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data?.data || []);
        setTotalRecords(data?.totalItems || 0);
      }
    } catch (ex) {
      console.error("Error fetching products:", ex);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, [e.target.name]: file });
      setPreview(URL.createObjectURL(file));
    }
};

const handleSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append("productName", newProduct.productName);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("stockQty", newProduct.stockQty);
    if (newProduct.image) {
      formData.append("image", newProduct.image); // Append the image file
  }
    if (isEditMode) {
      // Convert FormData to JSON for PUT request
      // const jsonBody = Object.fromEntries(formData.entries()); 

      const response = await fetch(`/api/products/editProduct/${editProductId}`, {
        method: "PUT",
        // headers: { "Content-Type": "application/json" }, // JSON Header
        // body: JSON.stringify(jsonBody),
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
      } else {
        toast.error("Error updating product: " + data.message);
      }
    } else {
      // Keeping FormData for POST request (for image upload)
      // const jsonBody = Object.fromEntries(formData.entries()); 
      const response = await fetch("/api/products/addProduct", {
        method: "POST",
        // body: JSON.stringify(jsonBody),
        body: formData
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Product added successfully!");
      } else {
        toast.error("Error adding product: " + data.message);
      }
    }

    setNewProduct({
      productName: "",
      price: "",
      description: "",
      stockQty: "",
      image: null,
    });

    modalHide();
    fetchProducts();
  } catch (ex) {
    toast.error("Error adding/updating product: " + ex.message);
  }
};

const bufferToBase64 = (buffer) => {
  return `data:${buffer.contentType};base64,${Buffer.from(buffer.data).toString('base64')}`;
};

  const columns =[
    {
      header: "#",
      accessorKey: "index",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Product",
      // accessorKey: "productName",
      cell:({row})=>(
        <div>
          {row.original.image && (<img src={bufferToBase64(row.original.image)} alt={row.original.productName} width={50} height={50}/>)}
        
        <span>{row.original.productName}</span>
        </div>
      )
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Price",
      accessorKey: "price",
    },
    {
      header: "Qty.",
      accessorKey: "stockQty",
    },
      {
      header: "Actions",
      cell: ({ row }) => ( <div className='d-flex gap-2'>
                <Button size='sm' variant='secondary' onClick={() => handleEdit(row.original)}>
                  Edit
                </Button>
                <Button size='sm' variant='outline-danger' onClick={() => handleDelete(row.original._id)}>
                  Delete
                </Button>
              </div>)
    },
  ];

  const handleEdit = useCallback(async (productToEdit)=> {
      try {
          const productId = productToEdit?._id
          if(!productId) return;
          const response = await fetch(`/api/products/getProduct/${productId}`,
            {
              method: "GET"
            }
          );
          const fetchedResponse = await response.json();
          const product = fetchedResponse?.data || [];
          setNewProduct({
            productName: product.productName,
            price: product.price,
            description: product.description || "",
            stockQty: product.stockQty || "",
            image: product.image || null,
          });
          setIsEditMode(true);
          setEditProductId(productId);
          modalVisible();
      } catch(ex) {
        console.error("error in fetching product details", ex);
      }
  })

  const handleDelete = useCallback(async (productId)=> {
    try {
        if(!productId) return;
        const response = await fetch(`/api/products/deleteProduct/${productId}`,
          {method: "DELETE"}
        );

        const data = await response.json();
        if(response.ok) {
          toast.success("Product deleted successfully")
          fetchProducts();
        } else {
          toast.error("Error in deleting product", data.message);
        }
    } catch(ex) {
      console.error("error in deleting product", ex);
    }
  })

  const modalVisible = ()=> {
    setShowModal(true);
  }

  const modalHide = ()=> {
    setShowModal(false);
    setIsEditMode(false);
    setNewProduct({
      productName: "",
      price: "",
      description: "",
      stockQty: "",
      image: null,
    });
    setPreview(null);
  }

  const userData = JSON.parse(localStorage.getItem("UserData"));

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-gray-100 p-4 flex flex-col items-center md:items-start">
        <Image src="/images/logo1.jpeg" alt="Logo" width={96} height={96} className="rounded-lg" />
        <h2 className="text-xl font-bold text-black mt-2">RM Snacks</h2>
         {/* User Profile Section */}
        <div className="mt-4 w-full flex flex-col items-center p-4 rounded-lg shadow">
          <UserProfile user={userData} onLogout={logout} />
        </div>
        <ul className="mt-4 space-y-2 w-full">
          <li className="p-2 bg-red-500 text-white rounded text-center md:text-left">Dashboard</li>
          <li className="p-2 hover:bg-gray-300 rounded text-center md:text-left">Orders</li>
          <li className="p-2 hover:bg-gray-300 rounded text-center md:text-left">Products</li>
          <li className="p-2 hover:bg-gray-300 rounded text-center md:text-left">Settings</li>
          <li className="p-2 hover:bg-gray-300 rounded text-center md:text-left" onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-4/5 p-6">
        {/* Bootstrap Modal for Adding Product */}
        <Modal show={showModal} onHide={() => modalHide()}>
          <Modal.Header closeButton>
            <Modal.Title>Product</Modal.Title>x``
          </Modal.Header>
          <Modal.Body>
            <input type="text" name="productName" placeholder="Product Name" value={newProduct.productName} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
            <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="stockQty" placeholder="Stock Quantity" value={newProduct.stockQty} onChange={handleInputChange} className="w-full p-2 mb-4 border rounded" />
            <input type="file" accept="image/*" onChange={handleFileInput} name="image"/>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                width={150}
                height={150}
                style={{ marginTop: 10 }}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>{isEditMode ? "Edit" : "Add"}</Button>
          </Modal.Footer>
        </Modal>    
            <Card>
              <Card.Body>
              <div className='justify-content-between mb-2 d-flex'>
              <div className='fs-4 fw-bold'>Products</div>
              <Button
                onClick={() => setShowModal(true)}
                className="d-flex align-items-center button">Add Product</Button>
              </div>  
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : products.length > 0 ? (
                  <DsTable columns={columns} data={products.map((p, i) => ({ ...p, index: i }))} rowsPerPageList={[2, 5, 10, 20, 50]} pageSize={perPage} totalRecords={totalRecords} currentPage={page + 1} showPagination isLoading={loading} onPageSizeChange={(newSize) => { setPerPage(newSize); setPage(0); }} onPageChange={(newPage) => setPage(newPage > 0 ? newPage : 1)} emptyMessage="No Products found." />
                ) : (
                  <p className="text-center">No Products found.</p>
                )}
              </Card.Body>
            </Card>
          
      </div>
    </div>
  );
}