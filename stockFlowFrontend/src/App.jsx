import { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct, createMovement, getMovements } from './api';
import { Package, Plus, Trash2, RefreshCw, AlertTriangle, CheckCircle2, ArrowUpCircle, ArrowDownCircle, History, Boxes } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'history'
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementModal, setMovementModal] = useState(false);
  const [movementData, setMovementData] = useState({ type: 'ENTRADA', quantity: 1, description: '' });

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    minStock: 5,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resMov] = await Promise.all([getProducts(), getMovements()]);
      setProducts(resProd.data);
      setMovements(resMov.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return;

    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        minStock: parseInt(form.minStock),
      });
      setForm({ name: '', description: '', price: '', stock: '', minStock: 5 });
      fetchData();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Deseas eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const handleOpenMovement = (product, type) => {
    setSelectedProduct(product);
    setMovementData({ type, quantity: 1, description: '' });
    setMovementModal(true);
  };

  const handleSaveMovement = async (e) => {
    e.preventDefault();
    try {
      await createMovement({
        productId: selectedProduct.id,
        type: movementData.type,
        quantity: parseInt(movementData.quantity),
        description: movementData.description
      });
      setMovementModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al procesar el movimiento');
    }
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-400" />
            <div>
              <h1 className="text-2xl font-bold">StockFlow Manager</h1>
              <p className="text-xs text-slate-400">Control de Inventario y Alertas</p>
            </div>
          </div>
          <button 
            onClick={fetchData} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition"
          >
            <RefreshCw className="w-4 h-4" /> Recargar
          </button>
        </header>

        {/* Tarjetas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total de Productos</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className={`border p-4 rounded-xl flex items-center justify-between transition ${lowStockProducts.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800/60 border-slate-700'}`}>
            <div>
              <p className="text-xs text-slate-400">Stock Crítico</p>
              <p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {lowStockProducts.length}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${lowStockProducts.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
        </div>

        {/* Banner de Alerta Crítica */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-amber-300">¡Atención requerida!</span>
              <p className="text-amber-200/80 text-xs mt-0.5">
                Hay {lowStockProducts.length} producto(s) por debajo o igual a su stock mínimo asignado ({lowStockProducts.map(p => p.name).join(', ')}).
              </p>
            </div>
          </div>
        )}

        {/* Pestañas de Navegación */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            <Boxes className="w-4 h-4" /> Inventario
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            <History className="w-4 h-4" /> Historial de Movimientos ({movements.length})
          </button>
        </div>

        {/* Vista 1: Inventario */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700/50 h-fit">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> Nuevo Producto
              </h2>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Descripción</label>
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  value={form.minStock}
                  onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2"
              >
                Guardar Producto
              </button>
            </form>

            {/* Tabla de Productos */}
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700/50">
              <h2 className="text-lg font-semibold mb-4">Inventario Actual</h2>
              
              {loading ? (
                <p className="text-slate-400 text-sm">Cargando...</p>
              ) : products.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay productos registrados en MySQL.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
                      <tr>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Producto</th>
                        <th className="p-3">Precio</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3 text-right">Ajustes</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {products.map((p) => {
                        const isLowStock = p.stock <= p.minStock;
                        return (
                          <tr key={p.id} className={`hover:bg-slate-700/30 ${isLowStock ? 'bg-amber-500/5' : ''}`}>
                            <td className="p-3">
                              {isLowStock ? (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="w-3 h-3" /> Bajo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                  Ok
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-medium">
                              {p.name}
                              {p.description && <span className="block text-xs text-slate-400 font-normal">{p.description}</span>}
                            </td>
                            <td className="p-3">${p.price.toLocaleString('es-CL')}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${isLowStock ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700 text-slate-300'}`}>
                                {p.stock} / {p.minStock} min
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  title="Registrar Entrada"
                                  onClick={() => handleOpenMovement(p, 'ENTRADA')}
                                  className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded transition"
                                >
                                  <ArrowUpCircle className="w-5 h-5" />
                                </button>
                                <button
                                  title="Registrar Salida"
                                  onClick={() => handleOpenMovement(p, 'SALIDA')}
                                  className="p-1 text-amber-400 hover:bg-amber-500/20 rounded transition"
                                >
                                  <ArrowDownCircle className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista 2: Historial */}
        {activeTab === 'history' && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold mb-4">Registro de Entradas y Salidas</h2>
            {movements.length === 0 ? (
              <p className="text-slate-400 text-sm">Aún no hay movimientos registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
                    <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Producto</th>
                      <th className="p-3">Cantidad</th>
                      <th className="p-3">Motivo / Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {movements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-700/30">
                        <td className="p-3 text-xs text-slate-400">
                          {new Date(m.createdAt).toLocaleString('es-CL')}
                        </td>
                        <td className="p-3">
                          {m.type === 'ENTRADA' ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                              <ArrowUpCircle className="w-3 h-3" /> Entrada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full">
                              <ArrowDownCircle className="w-3 h-3" /> Salida
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-medium">{m.productName}</td>
                        <td className="p-3 font-semibold">
                          {m.type === 'ENTRADA' ? `+${m.quantity}` : `-${m.quantity}`}
                        </td>
                        <td className="p-3 text-slate-400 text-xs">{m.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal para Movimientos */}
      {movementModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold">
              Registrar {movementData.type} - <span className="text-indigo-400">{selectedProduct.name}</span>
            </h3>

            <form onSubmit={handleSaveMovement} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({ ...movementData, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Motivo / Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Compra a proveedor / Venta #102"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  value={movementData.description}
                  onChange={(e) => setMovementData({ ...movementData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMovementModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${movementData.type === 'ENTRADA' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'}`}
                >
                  Confirmar {movementData.type}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;