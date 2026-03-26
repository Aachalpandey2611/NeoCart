import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { getOrderById } from "../services/orderService";
import { formatCurrency } from "../utils/helpers";
import Loader from "../components/Loader";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../animations/variants";

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

const statusToStep = {
  Pending: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 0,
};

const statusStyle = {
  Pending: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  Processing: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
  Shipped: "text-blue-300 border-blue-500/30 bg-blue-500/10",
  Delivered: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  Cancelled: "text-red-300 border-red-500/30 bg-red-500/10",
};

const statusMeta = {
  Pending: { label: "Order received", icon: FiClock },
  Processing: { label: "Preparing your package", icon: FiPackage },
  Shipped: { label: "On the way", icon: FiTruck },
  Delivered: { label: "Delivered", icon: FiCheckCircle },
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || "Unable to fetch this order right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  const activeStep = useMemo(() => {
    if (!order?.status) return 0;
    return statusToStep[order.status] || 0;
  }, [order?.status]);

  if (loading) {
    return (
      <div className="page-bg min-h-screen pt-28 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-bg min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto glass-dark rounded-3xl p-8 border border-white/10 text-center">
          <p className="text-red-300 text-lg mb-4">
            {error || "Order not found"}
          </p>
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = statusMeta[order.status] || {
    label: order.status,
    icon: FiPackage,
  };
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-bg min-h-screen pt-24 pb-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Orders
          </Link>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Tracking ID
            </p>
            <p className="text-sm font-mono text-white">
              #{order._id.substring(10).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 glass-dark rounded-3xl border border-white/10 p-8 shadow-2xl"
          >
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap items-center justify-between gap-4 mb-8"
            >
              <h1 className="text-3xl font-black text-white">
                Live Order Tracking
              </h1>
              <div
                className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${statusStyle[order.status] || "text-white border-white/20 bg-white/10"}`}
              >
                {order.status}
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mb-10 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon className="text-cyan-300" />
                <p className="text-lg font-semibold text-white">
                  {statusConfig.label}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Last update: {new Date(order.updatedAt).toLocaleString()}
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-[2px] bg-white/10" />
              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const stepNumber = index + 1;
                  const reached = activeStep >= stepNumber;
                  return (
                    <div key={step} className="relative pl-14">
                      <div
                        className={`absolute left-0 top-0 w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold ${
                          reached
                            ? "bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            : "bg-black/40 border-white/15 text-gray-500"
                        }`}
                      >
                        {reached ? <FiCheckCircle /> : stepNumber}
                      </div>
                      <p
                        className={`font-bold ${reached ? "text-white" : "text-gray-500"}`}
                      >
                        {step}
                      </p>
                      <p className="text-sm text-gray-500">
                        {step === "Pending" &&
                          "Your order has been placed successfully."}
                        {step === "Processing" &&
                          "Items are being packed with care."}
                        {step === "Shipped" &&
                          "Courier has picked up your package."}
                        {step === "Delivered" &&
                          "Package delivered to your address."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          <motion.aside
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="glass-dark rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl space-y-6"
          >
            <motion.div
              variants={staggerItem}
              className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3"
            >
              <h2 className="text-sm uppercase tracking-wider text-gray-400">
                Delivery Address
              </h2>
              <p className="text-white font-semibold flex items-center gap-2">
                <FiMapPin className="text-cyan-300" />
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-sm text-gray-400">
                {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country}
              </p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-2"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <FiCalendar /> Ordered On
              </p>
              <p className="text-white font-semibold">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-3">
                Payment Method
              </p>
              <p className="text-white font-semibold">{order.paymentMethod}</p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl bg-black/40 border border-white/10 p-4"
            >
              <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Items</span>
                  <span className="text-white">
                    {formatCurrency(order.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {formatCurrency(order.shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">
                    {formatCurrency(order.taxPrice)}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-white/10 flex justify-between text-base font-bold">
                  <span className="text-gray-200">Total</span>
                  <span className="gradient-text">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderTrackingPage;
