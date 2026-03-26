import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiFilter,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import { formatCurrency } from "../utils/helpers";
import Loader from "../components/Loader";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../animations/variants";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusPill = {
  Pending: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  Processing: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
  Shipped: "text-blue-300 border-blue-500/30 bg-blue-500/10",
  Delivered: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  Cancelled: "text-red-300 border-red-500/30 bg-red-500/10",
};

const AdminControlPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState("");
  const [savingProductId, setSavingProductId] = useState("");
  const [draftStatus, setDraftStatus] = useState({});
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [orderPage, setOrderPage] = useState(1);
  const [orderBulkStatus, setOrderBulkStatus] = useState("Processing");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [productPage, setProductPage] = useState(1);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "Electronics",
    brand: "NeoCart",
    price: "",
    originalPrice: "",
    stock: "",
    image: "",
  });

  const ORDER_PAGE_SIZE = 6;
  const PRODUCT_PAGE_SIZE = 8;

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [allOrders, productsData] = await Promise.all([
          getAllOrders(),
          getProducts({ pageSize: 300 }),
        ]);
        setOrders(allOrders);
        setProducts(productsData.products || []);
        setProductsTotal(
          productsData.total || productsData.products?.length || 0,
        );
      } catch (error) {
        addToast(error.message || "Failed to load admin analytics", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user?.role, addToast]);

  useEffect(() => {
    setOrderPage(1);
  }, [orderQuery, orderStatusFilter]);

  useEffect(() => {
    setProductPage(1);
  }, [productQuery, productCategoryFilter]);

  const metrics = useMemo(() => {
    const validOrders = orders.filter((order) => order.status !== "Cancelled");
    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );
    const pendingCount = orders.filter((order) =>
      ["Pending", "Processing"].includes(order.status),
    ).length;
    const shippedCount = orders.filter(
      (order) => order.status === "Shipped",
    ).length;
    const deliveredCount = orders.filter(
      (order) => order.status === "Delivered",
    ).length;

    const now = new Date();
    const todayOrders = orders.filter((order) => {
      const date = new Date(order.createdAt);
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      totalRevenue,
      pendingCount,
      shippedCount,
      deliveredCount,
      totalOrders: orders.length,
      todayOrders,
    };
  }, [orders]);

  const monthlyBuckets = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const monthLabel = d.toLocaleString("en-US", { month: "short" });
      if (!map.has(key)) {
        map.set(key, { label: monthLabel, revenue: 0, orders: 0 });
      }
      const row = map.get(key);
      row.orders += 1;
      row.revenue += order.totalPrice || 0;
    });

    return Array.from(map.values()).slice(-6);
  }, [orders]);

  const topMonthRevenue = Math.max(
    1,
    ...monthlyBuckets.map((m) => m.revenue || 0),
  );

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        orderStatusFilter === "All" || order.status === orderStatusFilter;
      const matchesQuery =
        !query ||
        order._id.toLowerCase().includes(query) ||
        String(order.shippingAddress?.fullName || "")
          .toLowerCase()
          .includes(query) ||
        String(order.user?.email || "")
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [orders, orderQuery, orderStatusFilter]);

  const orderPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE),
  );
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDER_PAGE_SIZE;
    return filteredOrders.slice(start, start + ORDER_PAGE_SIZE);
  }, [filteredOrders, orderPage]);

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        productCategoryFilter === "All" ||
        String(product.category || "").toLowerCase() ===
          productCategoryFilter.toLowerCase();
      const matchesQuery =
        !query ||
        String(product.name || "")
          .toLowerCase()
          .includes(query) ||
        String(product.brand || "")
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [products, productQuery, productCategoryFilter]);

  const productPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCT_PAGE_SIZE),
  );
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * PRODUCT_PAGE_SIZE;
    return filteredProducts.slice(start, start + PRODUCT_PAGE_SIZE);
  }, [filteredProducts, productPage]);

  useEffect(() => {
    if (orderPage > orderPages) {
      setOrderPage(orderPages);
    }
  }, [orderPage, orderPages]);

  useEffect(() => {
    if (productPage > productPages) {
      setProductPage(productPages);
    }
  }, [productPage, productPages]);
  const productCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const handleUpdateStatus = async (order) => {
    const selected = draftStatus[order._id] || order.status;
    if (selected === order.status) {
      addToast("No status change detected", "info");
      return;
    }

    setSavingOrderId(order._id);
    try {
      const updated = await updateOrderStatus(order._id, selected);
      setOrders((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
      );
      addToast(`Order moved to ${updated.status}`, "success");
    } catch (error) {
      addToast(error.message || "Failed to update order status", "error");
    } finally {
      setSavingOrderId("");
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) {
      addToast("Name, price and stock are required", "error");
      return;
    }

    setSavingProductId("new");
    try {
      const payload = {
        name: newProduct.name.trim(),
        description:
          newProduct.description.trim() || "Premium futuristic product",
        category: newProduct.category,
        brand: newProduct.brand.trim() || "NeoCart",
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice
          ? Number(newProduct.originalPrice)
          : Number(newProduct.price),
        stock: Number(newProduct.stock),
        image:
          newProduct.image.trim() ||
          "https://placehold.co/600x600/0b1120/7dd3fc?text=NeoCart",
      };
      const created = await createProduct(payload);
      setProducts((prev) => [created, ...prev]);
      setProductsTotal((prev) => prev + 1);
      setNewProduct({
        name: "",
        description: "",
        category: "Electronics",
        brand: "NeoCart",
        price: "",
        originalPrice: "",
        stock: "",
        image: "",
      });
      setShowNewProductForm(false);
      addToast("Product launched successfully", "success");
    } catch (error) {
      addToast(error.message || "Failed to create product", "error");
    } finally {
      setSavingProductId("");
    }
  };

  const handleQuickProductUpdate = async (product) => {
    setSavingProductId(product._id);
    try {
      const updated = await updateProduct(product._id, {
        price: Number(product.price),
        stock: Number(product.stock),
        featured: !!product.featured,
      });
      setProducts((prev) =>
        prev.map((item) =>
          item._id === updated._id ? { ...item, ...updated } : item,
        ),
      );
      addToast("Product updated", "success");
    } catch (error) {
      addToast(error.message || "Failed to update product", "error");
    } finally {
      setSavingProductId("");
    }
  };

  const handleDeleteProduct = async (id) => {
    setSavingProductId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
      setProductsTotal((prev) => Math.max(0, prev - 1));
      addToast("Product removed", "success");
    } catch (error) {
      addToast(error.message || "Failed to delete product", "error");
    } finally {
      setSavingProductId("");
    }
  };

  const handleBulkOrderStatus = async () => {
    if (!paginatedOrders.length) {
      addToast("No visible orders to update", "info");
      return;
    }

    setBulkLoading(true);
    try {
      const pendingUpdates = paginatedOrders.filter(
        (order) => (draftStatus[order._id] || order.status) !== orderBulkStatus,
      );

      if (!pendingUpdates.length) {
        addToast("Selected orders already have this status", "info");
        return;
      }

      const updatedList = await Promise.all(
        pendingUpdates.map((order) =>
          updateOrderStatus(order._id, orderBulkStatus),
        ),
      );

      const updatedMap = new Map(updatedList.map((item) => [item._id, item]));
      setOrders((prev) => prev.map((item) => updatedMap.get(item._id) || item));
      addToast(`Bulk updated ${updatedList.length} orders`, "success");
    } catch (error) {
      addToast(error.message || "Bulk update failed", "error");
    } finally {
      setBulkLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-bg min-h-screen pt-28 pb-20 px-4 text-center">
        <div className="max-w-xl mx-auto glass-dark rounded-3xl border border-white/10 p-8">
          <h2 className="text-2xl font-black text-white mb-3">Admin Area</h2>
          <p className="text-gray-400 mb-6">
            Sign in with admin account to access live controls.
          </p>
          <Link to="/auth" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="page-bg min-h-screen pt-28 pb-20 px-4 text-center">
        <div className="max-w-xl mx-auto glass-dark rounded-3xl border border-white/10 p-8">
          <FiShield className="w-12 h-12 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">
            Restricted Access
          </h2>
          <p className="text-gray-400 mb-6">
            This panel is available for admin users only.
          </p>
          <Link to="/dashboard" className="btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-bg min-h-screen pt-24 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black text-white">
              Admin Control Center
            </h1>
            <p className="text-gray-400 mt-1.5">
              Live order pipeline, status controls, and commerce analytics.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <FiRefreshCw /> Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="glass-dark rounded-3xl border border-white/10 p-16 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4"
            >
              {[
                {
                  label: "Revenue",
                  value: formatCurrency(metrics.totalRevenue),
                  icon: FiBarChart2,
                  tone: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
                },
                {
                  label: "Total Orders",
                  value: metrics.totalOrders,
                  icon: FiShoppingBag,
                  tone: "from-purple-500/20 to-blue-500/10 border-purple-500/30",
                },
                {
                  label: "Today",
                  value: metrics.todayOrders,
                  icon: FiActivity,
                  tone: "from-indigo-500/20 to-cyan-500/10 border-indigo-500/30",
                },
                {
                  label: "Pending",
                  value: metrics.pendingCount,
                  icon: FiClock,
                  tone: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
                },
                {
                  label: "Shipped",
                  value: metrics.shippedCount,
                  icon: FiTruck,
                  tone: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
                },
                {
                  label: "Products",
                  value: productsTotal,
                  icon: FiPackage,
                  tone: "from-emerald-500/20 to-cyan-500/10 border-emerald-500/30",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    variants={staggerItem}
                    className={`rounded-2xl p-4 bg-gradient-to-br ${card.tone} border glass-dark scanline-hover panel-pulse`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        {card.label}
                      </p>
                      <Icon className="text-cyan-300" />
                    </div>
                    <p className="text-2xl font-black text-white">
                      {card.value}
                    </p>
                  </motion.div>
                );
              })}
            </motion.section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <motion.section
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="xl:col-span-2 glass-dark rounded-3xl border border-white/10 p-6 md:p-8 scanline-hover"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">
                    Order Command Queue
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    {filteredOrders.length} filtered
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
                  <div className="md:col-span-2 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="Search by order id, customer, or email"
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                    >
                      <option value="All">All Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={orderBulkStatus}
                      onChange={(e) => setOrderBulkStatus(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleBulkOrderStatus}
                      disabled={bulkLoading}
                      className="btn-secondary !py-2.5 !px-3 text-xs disabled:opacity-60"
                    >
                      {bulkLoading ? "Updating..." : "Bulk Apply"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
                  {paginatedOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      variants={staggerItem}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 md:p-5 scanline-hover"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-500">
                            Order ID
                          </p>
                          <p className="text-sm font-mono text-white">
                            #{order._id.substring(10).toUpperCase()}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${statusPill[order.status] || "text-white border-white/20 bg-white/10"}`}
                        >
                          {order.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                          <p className="text-gray-500 text-xs uppercase tracking-wider">
                            Customer
                          </p>
                          <p className="text-white font-medium mt-1">
                            {order.shippingAddress?.fullName || "Unknown"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                          <p className="text-gray-500 text-xs uppercase tracking-wider">
                            Placed
                          </p>
                          <p className="text-white font-medium mt-1">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                          <p className="text-gray-500 text-xs uppercase tracking-wider">
                            Total
                          </p>
                          <p className="text-white font-medium mt-1">
                            {formatCurrency(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <select
                          value={draftStatus[order._id] || order.status}
                          onChange={(e) =>
                            setDraftStatus((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                          className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleUpdateStatus(order)}
                          disabled={savingOrderId === order._id}
                          className="btn-primary !py-2.5 !px-5 text-sm whitespace-nowrap disabled:opacity-60"
                        >
                          {savingOrderId === order._id
                            ? "Updating..."
                            : "Update Status"}
                        </button>
                        <Link
                          to={`/orders/${order._id}`}
                          className="btn-secondary !py-2.5 !px-5 text-sm whitespace-nowrap text-center"
                        >
                          Open Tracking
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                  {paginatedOrders.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-gray-400 text-sm">
                      No orders match these filters.
                    </div>
                  )}
                </div>

                {orderPages > 1 && (
                  <div className="mt-5 flex justify-end gap-2">
                    {Array.from({ length: orderPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setOrderPage(idx + 1)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold ${
                          orderPage === idx + 1
                            ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400/40"
                            : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </motion.section>

              <motion.aside
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="glass-dark rounded-3xl border border-white/10 p-6 md:p-8 space-y-6 scanline-hover"
              >
                <motion.div variants={staggerItem}>
                  <h2 className="text-xl font-black text-white mb-2">
                    Revenue Pulse
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    Last 6 bucketed months from live orders
                  </p>
                  <div className="space-y-4">
                    {monthlyBuckets.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No revenue data yet.
                      </p>
                    ) : (
                      monthlyBuckets.map((month) => (
                        <div key={month.label}>
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>{month.label}</span>
                            <span>{formatCurrency(month.revenue)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{
                                width: `${Math.max(8, (month.revenue / topMonthRevenue) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={staggerItem}
                  className="rounded-2xl bg-black/40 border border-white/10 p-4"
                >
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                    Fulfillment Health
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center justify-between text-gray-300">
                      <span className="flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-300" /> Delivered
                      </span>
                      <strong>{metrics.deliveredCount}</strong>
                    </p>
                    <p className="flex items-center justify-between text-gray-300">
                      <span className="flex items-center gap-2">
                        <FiTruck className="text-blue-300" /> Shipped
                      </span>
                      <strong>{metrics.shippedCount}</strong>
                    </p>
                    <p className="flex items-center justify-between text-gray-300">
                      <span className="flex items-center gap-2">
                        <FiUsers className="text-cyan-300" /> Active queue
                      </span>
                      <strong>{metrics.pendingCount}</strong>
                    </p>
                  </div>
                </motion.div>
              </motion.aside>
            </div>

            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="glass-dark rounded-3xl border border-white/10 p-6 md:p-8 scanline-hover"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Product Arsenal
                  </h2>
                  <p className="text-sm text-gray-500">
                    Create and tune your catalog without leaving the dashboard.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewProductForm((prev) => !prev)}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <FiPlus />{" "}
                  {showNewProductForm ? "Close Form" : "Launch Product"}
                </button>
              </div>

              {showNewProductForm && (
                <form
                  onSubmit={handleCreateProduct}
                  className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 md:p-5 mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Product name"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          brand: e.target.value,
                        }))
                      }
                      placeholder="Brand"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="Category"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      placeholder="Image URL"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="Price"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.originalPrice}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          originalPrice: e.target.value,
                        }))
                      }
                      placeholder="Original price"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          stock: e.target.value,
                        }))
                      }
                      placeholder="Stock"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                    <input
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Short description"
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProductId === "new"}
                      className="btn-primary !py-2.5 !px-5 text-sm disabled:opacity-60"
                    >
                      {savingProductId === "new"
                        ? "Launching..."
                        : "Create Product"}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="md:col-span-2 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Search products by name or brand"
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                >
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={staggerItem}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 scanline-hover"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-center">
                      <div className="lg:col-span-2 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {product.category} • {product.brand}
                        </p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.price}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((item) =>
                              item._id === product._id
                                ? { ...item, price: e.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                      />
                      <input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((item) =>
                              item._id === product._id
                                ? { ...item, stock: e.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={!!product.featured}
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((item) =>
                                item._id === product._id
                                  ? { ...item, featured: e.target.checked }
                                  : item,
                              ),
                            )
                          }
                          className="accent-cyan-400"
                        />
                        Featured
                      </label>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleQuickProductUpdate(product)}
                          disabled={savingProductId === product._id}
                          className="btn-secondary !py-2 !px-3 text-xs inline-flex items-center gap-1 disabled:opacity-60"
                        >
                          <FiEdit3 /> Save
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={savingProductId === product._id}
                          className="!py-2 !px-3 text-xs rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 inline-flex items-center gap-1 disabled:opacity-60"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {paginatedProducts.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-gray-400 text-sm">
                    No products match these filters.
                  </div>
                )}
              </div>

              {productPages > 1 && (
                <div className="mt-5 flex justify-end gap-2">
                  {Array.from({ length: productPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProductPage(idx + 1)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold ${
                        productPage === idx + 1
                          ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400/40"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </motion.section>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AdminControlPage;
