"use client";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Card, Col, Row, Spinner, Modal, Button } from "react-bootstrap";
import DsTable from "../../../../components/ds-table/DsTable";
import UserProfile from "../../../../components/navbar/UserProfile";
import styles from '@/app/(other)/dashboard/dashboard.module.css'
import SideBar from "@/app/(other)/dashboard/components/SideBar";
import bufferToBase64 from "@/utils/ImageHelper";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    description: "",
    stockQtyValue: "",
    stockQtyUnit: "kg",
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
  const imageFileRef = useRef(null);
  const [errors, setErrors] = useState({});

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        order_direction: "desc",
        order_key: "hosts_count",
        page: page + 1, // Adjusting to one-based index
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
  const validationErrors = validateFields();
  if(Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});
  try {
    const formData = new FormData();
    formData.append("productName", newProduct.productName);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("stockQty", `${newProduct.stockQtyValue} ${newProduct.stockQtyUnit}`);
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
        setNewProduct({
          productName: "",
          price: "",
          description: "",
          stockQtyValue: "",
          stockQtyUnit: "kg",
          image: null,
        });
    
        modalHide();
        fetchProducts();
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
        setNewProduct({
          productName: "",
          price: "",
          description: "",
          stockQty: "",
          image: null,
        });
    
        modalHide();
        fetchProducts();
      } else {
        toast.error("Error adding product: " + data.message);
      }
    }


  } catch (ex) {
    toast.error("Error adding/updating product: " + ex.message);
  }
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
          {row.original.image?.data && (<img src={bufferToBase64(row.original.image)} alt={row.original.productName} width={50} height={50}/>)}
        
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
      cell: ({ row }) => <span>{row.original.stockQty}</span>, // Display the combined stockQty
    },
    {
      header: "Qty.",
      accessorKey: "stockQty",
    },
      {
      header: "Actions",
      cell: ({ row }) => ( <div className='btn-group btn-group-sm'>
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
          const [value, unit] = (product.stockQty || "").split(" ");
          setNewProduct({
            productName: product.productName,
            price: product.price,
            description: product.description || "",
            stockQtyValue: value || "", // Set the value
            stockQtyUnit: unit || "kg",
            image: product.image || null,
          });
          if (product.image?.data && product.image?.contentType) {
            const base64 = bufferToBase64(product.image);
            setPreview(base64);
          }
          
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

  const validateFields = () => {
    const errs = {};
    if(!newProduct.productName.trim())
      errs.productName = "Product Name is required";
    if(!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price)<=0) 
      errs.price = "Enter a valid price";
    if (!newProduct.stockQtyValue || isNaN(newProduct.stockQtyValue) || Number(newProduct.stockQtyValue) <= 0)
      errs.stockQty = "Enter a valid stock quantity value";
    if (!newProduct.description.trim()) errs.description = "Description is required";

  return errs;

  }

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
    imageFileRef.current.value = '';

  }

  const userData = JSON.parse(localStorage.getItem("UserData"));

  return (
    <div className={styles.dashboardContainer}> 
      <SideBar onLogout = {logout}/>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Bootstrap Modal for Adding Product */}
        <Modal show={showModal} onHide={modalHide}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? "Edit Product" : "Add Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={newProduct.productName}
              onChange={handleInputChange}
              className="form-control mb-2" // Keep Bootstrap classes
            />
            {errors.productName && <div className="text-danger mb-2">{errors.productName}</div>}
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            {errors.price && <div className="text-danger mb-2">{errors.price}</div>}
            <textarea
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
            {errors.description && <div className="text-danger mb-2">{errors.description}</div>}
            <div className="d-flex align-items-center mb-4">
    <input
      type="text"
      name="stockQtyValue"
      placeholder="Quantity"
      value={newProduct.stockQtyValue}
      onChange={handleInputChange}
      className="form-control me-2" // Add some right margin
    />
    <select
      name="stockQtyUnit"
      value={newProduct.stockQtyUnit}
      onChange={handleInputChange}
      className="form-select"
    >
      <option value="kg">kg</option>
      <option value="grams">grams</option>
      <option value="liters">liters</option>
      <option value="ml">ml</option>
      <option value="pieces">pieces</option>
      {/* Add more units as needed */}
    </select>
            </div>
            {errors.stockQty && <div className="text-danger mb-2">{errors.stockQty}</div>}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              name="image"
              ref={imageFileRef}
              className="form-control" // Keep Bootstrap class
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                width={150}
                height={150}
                className="mt-3"
                style={{ objectFit: 'cover' }}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={modalHide}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditMode ? "Edit" : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>
  
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title fw-bold">Products</h5>
              <Button onClick={modalVisible} className="btn btn-primary">
                Add Product
              </Button>
            </div>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : products.length > 0 ? (
              <DsTable
              columns={columns}
              data={products.map((p, i) => ({ ...p, index: i }))}
              rowsPerPageList={[2, 5, 10, 20, 50]}
              pageSize={perPage}
              totalRecords={totalRecords}
              currentPage={page + 1} // Adjusting to one-based index
              showPagination
              isLoading={loading}
              onPageSizeChange={(newSize) => {
                setPerPage(newSize);
                setPage(0); // Reset to first page when page size changes
              }}
              onPageChange={(newPage) => setPage(newPage)}   // Adjusting to zero-based index
              emptyMessage="No Products found."
            />          
              )  : (
              <p className="text-center">No Products found.</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}