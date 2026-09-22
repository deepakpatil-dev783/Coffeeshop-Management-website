import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  Coffee,
  Users,
  Receipt,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Printer,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useTables } from "../../context/TableContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { menuService } from "../../services/api";
import {
  OrderStatusBadge,
  TableStatusBadge,
} from "../../components/StatusBadge";
import { TableLayout } from "../../components/TableLayout";
import { InvoiceModal } from "../../components/InvoiceModal";

export const StaffDashboard = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { tables, reservations, updateTableStatus } = useTables();
  const { user, logout } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Menu Management State
  const [menuItemsList, setMenuItemsList] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Coffee",
    price: "",
    description: "",
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
    prepTime: "4-5 mins",
  });

  React.useEffect(() => {
    menuService.getAll().then(setMenuItemsList);
  }, []);

  // Summary Metrics
  const todayOrders = orders.length;
  const todaySales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter(
    (o) => o.orderStatus !== "Completed" && o.orderStatus !== "Cancelled",
  );
  const availableTables = tables.filter((t) => t.status === "Available").length;
  const reservedTables = tables.filter((t) => t.status === "Reserved").length;

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await menuService.create({
        ...newProduct,
        price: Number(newProduct.price),
        rating: 4.9,
        availability: true,
      });
      setMenuItemsList((prev) => [created, ...prev]);
      setIsAddingProduct(false);
      addToast(`Added "${created.name}" to menu!`, "success");
      setNewProduct({
        name: "",
        category: "Coffee",
        price: "",
        description: "",
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
        prepTime: "4-5 mins",
      });
    } catch (err) {
      addToast("Error adding product", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      await menuService.delete(id);
      setMenuItemsList((prev) =>
        prev.filter((i) => i.id !== id && i._id !== id),
      );
      addToast("Menu item deleted", "info");
    }
  };

  const sidebarLinks = [
    { id: "dashboard", name: "Dashboard Overview", icon: LayoutDashboard },
    {
      id: "orders",
      name: "Order Management",
      icon: ShoppingBag,
      count: activeOrders.length,
    },
    { id: "tables", name: "Table Management", icon: Grid },
    { id: "menu", name: "Menu Products", icon: Coffee },
    {
      id: "reservations",
      name: "Reservations",
      icon: Clock,
      count: reservations.length,
    },
    { id: "billing", name: "Billing & POS Invoices", icon: Receipt },
    { id: "customers", name: "Customer Directory", icon: Users },
    { id: "settings", name: "Staff Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5EBE1]/40 flex flex-col md:flex-row">
      {/* Staff POS Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-coffee-950 text-coffee-100 p-4 border-r border-coffee-800 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Badge */}
          <div className="flex items-center gap-3 p-2 bg-coffee-900 rounded-2xl border border-coffee-800">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold font-bold">
              🛡️
            </div>
            <div>
              <p className="font-serif font-bold text-cream text-sm">
                Staff & POS Portal
              </p>
              <p className="text-[10px] text-gold font-semibold uppercase">
                {user?.role || "Staff Member"}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-gold text-coffee-950 shadow-md font-bold"
                      : "text-coffee-300 hover:bg-coffee-900 hover:text-gold"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-coffee-950" : "text-coffee-400"}`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? "bg-coffee-950 text-gold"
                          : "bg-gold/20 text-gold"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-coffee-900">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out Staff Session
          </button>
        </div>
      </aside>

      {/* Main Staff Dashboard Body */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm">
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-coffee-950 capitalize">
              {activeTab} Management Portal
            </h1>
            <p className="text-xs text-coffee-600">
              Live Operations • Real-time order pipeline and visual restaurant
              floor plan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-coffee-600 font-semibold">
              Shift Staff: {user?.name}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-300">
              System Active ●
            </span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-coffee-600 uppercase">
                  Today's Sales
                </p>
                <p className="font-serif text-2xl font-extrabold text-coffee-950">
                  ₹{todaySales.toFixed(2)}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  ↑ +14.2% today
                </p>
              </div>
              <div className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-coffee-600 uppercase">
                  Today's Orders
                </p>
                <p className="font-serif text-2xl font-extrabold text-coffee-950">
                  {todayOrders}
                </p>
                <p className="text-[11px] text-coffee-500 font-medium">
                  Avg 12 orders/hr
                </p>
              </div>
              <div className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-coffee-600 uppercase">
                  Active Orders
                </p>
                <p className="font-serif text-2xl font-extrabold text-amber-600">
                  {activeOrders.length}
                </p>
                <p className="text-[11px] text-amber-700 font-semibold">
                  Kitchen processing
                </p>
              </div>
              <div className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-coffee-600 uppercase">
                  Available Tables
                </p>
                <p className="font-serif text-2xl font-extrabold text-emerald-600">
                  {availableTables}
                </p>
                <p className="text-[11px] text-coffee-500 font-medium">
                  Out of {tables.length} tables
                </p>
              </div>
              <div className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-coffee-600 uppercase">
                  Reserved Tables
                </p>
                <p className="font-serif text-2xl font-extrabold text-blue-600">
                  {reservedTables}
                </p>
                <p className="text-[11px] text-coffee-500 font-medium">
                  {reservations.length} total bookings
                </p>
              </div>
            </div>

            {/* Quick Kanban Order Snapshot & Visual Floor Plan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-coffee-950 flex items-center justify-between">
                  <span>Recent Customer Orders</span>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-gold font-bold bg-coffee-900 px-3 py-1 rounded-lg"
                  >
                    View All Pipeline →
                  </button>
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.orderId || ord.id}
                      className="p-3.5 bg-coffee-50 rounded-2xl border border-coffee-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold text-coffee-900">
                          <span>{ord.orderId}</span>
                          <span className="text-coffee-600">
                            • {ord.customerName}
                          </span>
                          {ord.tableNumber && (
                            <span className="bg-coffee-200 text-coffee-900 px-2 py-0.5 rounded text-[10px]">
                              T#{ord.tableNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-coffee-500">
                          {ord.items.length} Items • ₹
                          {ord.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                      <OrderStatusBadge status={ord.orderStatus} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Status Snapshot */}
              <div className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-coffee-950">
                  Current Table Utilization
                </h3>
                <TableLayout
                  tables={tables}
                  isStaff={true}
                  onUpdateStatus={updateTableStatus}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT (KANBAN PIPELINE) */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-coffee-950">
                Live Order Pipeline
              </h3>
              <p className="text-xs text-coffee-600">
                Drag or click status buttons to advance orders through kitchen
                phases.
              </p>
            </div>

            {/* Kanban Columns: New -> Confirmed -> Preparing -> Ready -> Completed */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["New", "Confirmed", "Preparing", "Ready", "Completed"].map(
                (statusCol) => {
                  const columnOrders = orders.filter(
                    (o) => o.orderStatus === statusCol,
                  );
                  return (
                    <div
                      key={statusCol}
                      className="bg-cream p-4 rounded-3xl border border-coffee-200 shadow-sm space-y-3 flex flex-col min-h-[500px]"
                    >
                      <div className="flex items-center justify-between border-b border-coffee-200 pb-2">
                        <span className="font-serif font-bold text-sm text-coffee-950">
                          {statusCol}
                        </span>
                        <span className="px-2 py-0.5 bg-coffee-900 text-gold text-xs font-bold rounded-full">
                          {columnOrders.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {columnOrders.map((ord) => (
                          <div
                            key={ord.orderId || ord.id}
                            className="bg-white p-4 rounded-2xl border border-coffee-200 shadow-sm space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-xs text-coffee-950 font-mono">
                                  {ord.orderId}
                                </p>
                                <p className="text-[11px] font-semibold text-coffee-700">
                                  {ord.customerName}
                                </p>
                                <p className="text-[10px] text-coffee-500">
                                  {ord.orderType}{" "}
                                  {ord.tableNumber
                                    ? `(T#${ord.tableNumber})`
                                    : ""}
                                </p>
                              </div>
                              <button
                                onClick={() => setSelectedInvoiceOrder(ord)}
                                className="p-1 rounded bg-coffee-100 text-coffee-800 hover:bg-gold hover:text-coffee-950 transition"
                                title="Print Invoice"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="border-t border-coffee-100 pt-2 space-y-1 text-[11px] text-coffee-800">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>
                                    {item.name} x{item.quantity}
                                  </span>
                                  <span className="font-bold">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-coffee-100 pt-2 flex items-center justify-between text-xs">
                              <span className="font-extrabold text-coffee-950">
                                ₹{ord.totalAmount?.toFixed(2)}
                              </span>

                              {/* Action Buttons to move pipeline status */}
                              <select
                                value={ord.orderStatus}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    ord.orderId || ord.id,
                                    e.target.value,
                                  )
                                }
                                className="text-[10px] font-bold bg-coffee-900 text-gold rounded-lg px-2 py-1 cursor-pointer"
                              >
                                <option value="New">Set: New</option>
                                <option value="Confirmed">
                                  Set: Confirmed
                                </option>
                                <option value="Preparing">
                                  Set: Preparing
                                </option>
                                <option value="Ready">Set: Ready</option>
                                <option value="Completed">
                                  Set: Completed
                                </option>
                                <option value="Cancelled">
                                  Set: Cancelled
                                </option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TABLE MANAGEMENT */}
        {activeTab === "tables" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-coffee-950">
                Floor Plan Table Control
              </h3>
              <p className="text-xs text-coffee-600">
                Update live availability, occupancy, or cleaning status.
              </p>
            </div>
            <TableLayout
              tables={tables}
              isStaff={true}
              onUpdateStatus={updateTableStatus}
            />
          </div>
        )}

        {/* TAB 4: MENU MANAGEMENT */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-coffee-950">
                Menu Product Catalog
              </h3>
              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gold text-coffee-950 font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition"
              >
                <Plus className="w-4 h-4" />{" "}
                {isAddingProduct ? "Cancel Form" : "Add New Product"}
              </button>
            </div>

            {/* Add Product Modal Form */}
            {isAddingProduct && (
              <form
                onSubmit={handleAddProductSubmit}
                className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-md space-y-4 max-w-xl"
              >
                <h4 className="font-serif font-bold text-base text-coffee-950">
                  Create New Menu Item
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-coffee-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="e.g. Vanilla Bean Latte"
                      className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-coffee-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs font-bold text-coffee-950"
                    >
                      {[
                        "Coffee",
                        "Tea",
                        "Cold Drinks",
                        "Snacks",
                        "Desserts",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-coffee-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      placeholder="5.49"
                      className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-coffee-700 mb-1">
                      Prep Time
                    </label>
                    <input
                      type="text"
                      value={newProduct.prepTime}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          prepTime: e.target.value,
                        })
                      }
                      placeholder="3-5 mins"
                      className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-coffee-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="2"
                      required
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Rich espresso with velvety steamed milk..."
                      className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-coffee-900 text-gold font-bold text-xs rounded-xl hover:bg-coffee-800 transition"
                >
                  Save Product to Menu
                </button>
              </form>
            )}

            {/* Menu Management Table */}
            <div className="bg-cream rounded-3xl border border-coffee-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-coffee-950 text-coffee-200 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100 text-coffee-900">
                  {menuItemsList.map((item) => (
                    <tr
                      key={item.id || item._id}
                      className="hover:bg-coffee-50/60 transition"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-coffee-950 text-sm">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-coffee-500 truncate max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-coffee-700">
                        {item.category}
                      </td>
                      <td className="p-4 font-extrabold text-coffee-950">
                        ₹{Number(item.price).toFixed(2)}
                      </td>
                      <td className="p-4 font-bold text-gold">
                        ★ {item.rating || 4.8}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Available
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() =>
                            handleDeleteProduct(item.id || item._id)
                          }
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: BILLING SYSTEM */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-coffee-950">
              POS Invoice & Thermal Bill Printer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((ord) => (
                <div
                  key={ord.orderId || ord.id}
                  className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-coffee-100 pb-2">
                    <span className="font-bold font-mono text-sm text-coffee-900">
                      {ord.orderId}
                    </span>
                    <span className="text-xs text-coffee-500">
                      {new Date(ord.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-coffee-800 font-medium">
                    Customer: <strong>{ord.customerName}</strong>
                  </p>
                  <p className="text-xs text-coffee-600">
                    Table:{" "}
                    {ord.tableNumber ? `#${ord.tableNumber}` : "Takeaway"}
                  </p>
                  <p className="text-xs font-bold text-coffee-950">
                    Total: ₹{ord.totalAmount?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setSelectedInvoiceOrder(ord)}
                    className="w-full py-2.5 bg-coffee-900 text-gold font-bold text-xs rounded-xl hover:bg-coffee-800 transition flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Open Invoice Thermal Receipt
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5, 7, 8: RESERVATIONS, CUSTOMERS, SETTINGS */}
        {(activeTab === "reservations" ||
          activeTab === "customers" ||
          activeTab === "settings") && (
          <div className="bg-cream p-8 rounded-3xl border border-coffee-200 space-y-4">
            <h3 className="font-serif text-xl font-bold text-coffee-950 capitalize">
              {activeTab} Section
            </h3>
            <p className="text-xs text-coffee-600">
              Manage shift configurations, customer records, and reservation
              rosters.
            </p>
            <div className="p-4 bg-coffee-50 rounded-2xl border border-coffee-200 text-xs text-coffee-800 font-mono">
              Total Recorded Reservations: {reservations.length} Bookings Active
            </div>
          </div>
        )}
      </main>

      {/* Invoice Thermal Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
