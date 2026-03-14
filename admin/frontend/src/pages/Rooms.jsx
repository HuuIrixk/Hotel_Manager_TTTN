// src/pages/Rooms.jsx
import React, { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { get, patch, put, post, del } from "../api/api";

const ROOM_TYPE_OPTIONS = ["Standard", "VIP", "Suite"];

export default function Rooms() {
  const { rooms, refreshData } = useAppData();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "Standard",
    price: "",
    capacity: 2,
    status: "available",
    description: "",
    imageFile: null,
  });

  // Availability Check
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [availableIds, setAvailableIds] = useState(null); // null = not checking

  // Edit Modal
  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    // name, type, price, ...
    image: null,
    imageFile: null,   // file mới upload
  });


  const checkAvailability = async () => {
    if (!fromDate || !toDate) return alert("Chọn ngày bắt đầu và kết thúc");
    const res = await get(`/admin/rooms/available?from=${fromDate}&to=${toDate}`);
    if (res) {
      setAvailableIds(res.map(r => r.room_id));
    }
  };

  const clearAvailability = () => {
    setFromDate("");
    setToDate("");
    setAvailableIds(null);
  };

  const handleToggle = async (id) => {
    try {
      await patch(`/admin/rooms/${id}/toggle`);
      refreshData();
    } catch (e) {
      alert("Lỗi khi đổi trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa phòng này?")) return;
    try {
      await del(`/admin/rooms/${id}`);
      refreshData();
    } catch (e) {
      alert("Lỗi khi xóa phòng");
    }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setEditForm({
      ...room,
      imageFile: null,
    });
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("room_number", editForm.name);
      formData.append("type", editForm.type);
      formData.append("price", editForm.price);
      formData.append("capacity", editForm.capacity || "");
      formData.append("description", editForm.description || "");
      formData.append("status", editForm.status || "");

      if (editForm.imageFile) {
        formData.append("image", editForm.imageFile);
      }

      await put(`/admin/rooms/${editingRoom.id}`, formData);

      setEditingRoom(null);
      refreshData();
    } catch (e) {
      alert("Lỗi cập nhật");
    }
  };

  const createRoom = async () => {
    try {
      if (!createForm.name || !createForm.type || !createForm.price) {
        alert("Vui lòng nhập tên phòng, loại phòng và giá.");
        return;
      }

      const formData = new FormData();
      formData.append("room_number", createForm.name);
      formData.append("type", createForm.type);
      formData.append("price", createForm.price);
      formData.append("capacity", createForm.capacity || 2);
      formData.append("description", createForm.description || "");
      formData.append("status", createForm.status || "available");

      if (createForm.imageFile) {
        formData.append("image", createForm.imageFile);
      }

      await post("/admin/rooms", formData);
      setCreatingRoom(false);
      setCreateForm({
        name: "",
        type: "Standard",
        price: "",
        capacity: 2,
        status: "available",
        description: "",
        imageFile: null,
      });
      refreshData();
    } catch (e) {
      alert("Lỗi khi thêm phòng");
    }
  };


  const list = useMemo(() => {
    return rooms.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (availableIds !== null && !availableIds.includes(r.id)) return false;
      return true;
    });
  }, [rooms, q, statusFilter, availableIds]);

  return (
    <div>
      <h1 className="page-title">Quản lý phòng</h1>

      {/* Filters & Availability */}
      <div className="card" style={{ marginBottom: 12, padding: 12 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" placeholder="Tìm tên phòng..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">-- Tất cả trạng thái --</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <div style={{ display: "flex", gap: 8, alignItems: "center", borderLeft: "1px solid #eee", paddingLeft: 12 }}>
            <span>Check trống:</span>
            <input type="date" className="input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span>-</span>
            <input type="date" className="input" value={toDate} onChange={e => setToDate(e.target.value)} />
            <button className="btn-accept" onClick={checkAvailability}>Check</button>
            {availableIds !== null && <button className="btn-outline" onClick={clearAvailability}>X</button>}
          </div>

          <div style={{ marginLeft: "auto" }}>
             <div style={{ display: "flex", gap: 8 }}>
               <button className="btn-accept" onClick={() => setCreatingRoom(true)}>Thêm phòng</button>
               <button className="btn-accept" onClick={refreshData}>Refresh</button>
             </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table">
          <thead><tr><th>Mã</th><th>Tên</th><th>Loại</th><th>Giá</th><th>Sức chứa</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.price.toLocaleString("vi-VN")}₫</td>
                <td>{r.capacity}</td>
                <td>
                  <span style={{
                    fontWeight: 700,
                    color: r.status === "available" ? "#10b981" : (r.status === "booked" ? "#facc15" : "#ef4444")
                  }}>
                    {r.status === "booked"
                      ? "Booked"
                      : r.status === "available"
                      ? "Available"
                      : r.status === "maintenance"
                      ? "Maintenance"
                      : r.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" onClick={() => handleToggle(r.id)}>
                      {r.status === "available" ? "Khóa" : "Mở"}
                    </button>
                    <button className="btn-outline" onClick={() => startEdit(r)}>Sửa</button>
                    <button className="btn-outline" style={{ color: "red", borderColor: "red" }} onClick={() => handleDelete(r.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className="modal-overlay">
          <div className="modal text-black">
            <h2>Sửa phòng {editingRoom.name}</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <label>Ảnh phòng
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditForm((prev) => ({
                      ...prev,
                      imageFile: file,
                    }));
                  }}
                />
              </label>

              {(editForm.image || editForm.imageFile) && (
                <div>
                  <p>Preview:</p>
                  <img
                    src={
                      editForm.imageFile
                        ? URL.createObjectURL(editForm.imageFile)
                        : editForm.image?.startsWith("http")
                        ? editForm.image
                        : (import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api").replace(/\/api$/, "") +
                          editForm.image
                    }
                    alt="Room"
                    style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              )}

              <label>Tên phòng <input className="input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></label>
              <label>Loại
                <select className="input" value={editForm.type || "Standard"} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                  {ROOM_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>Giá <input type="number" className="input" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} /></label>
              <label>Sức chứa <input type="number" className="input" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: e.target.value})} /></label>
              <label>Mô tả <textarea className="input" value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></label>
              <label>Trạng thái
                <select className="input" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn-outline" onClick={() => setEditingRoom(null)}>Hủy</button>
              <button className="btn-accept" onClick={saveEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {creatingRoom && (
        <div className="modal-overlay">
          <div className="modal text-black">
            <h2>Thêm phòng mới</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <label>Ảnh phòng
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0] || null;
                    setCreateForm((prev) => ({ ...prev, imageFile: file }));
                  }}
                />
              </label>

              {createForm.imageFile && (
                <div>
                  <p>Preview:</p>
                  <img
                    src={URL.createObjectURL(createForm.imageFile)}
                    alt="Room preview"
                    style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              )}

              <label>Tên phòng <input className="input" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} /></label>
              <label>Loại
                <select className="input" value={createForm.type} onChange={e => setCreateForm({ ...createForm, type: e.target.value })}>
                  {ROOM_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>Giá <input type="number" className="input" value={createForm.price} onChange={e => setCreateForm({ ...createForm, price: e.target.value })} /></label>
              <label>Sức chứa <input type="number" className="input" value={createForm.capacity} onChange={e => setCreateForm({ ...createForm, capacity: e.target.value })} /></label>
              <label>Mô tả <textarea className="input" value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} /></label>
              <label>Trạng thái
                <select className="input" value={createForm.status} onChange={e => setCreateForm({ ...createForm, status: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn-outline" onClick={() => setCreatingRoom(false)}>Hủy</button>
              <button className="btn-accept" onClick={createRoom}>Thêm</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justifyContent: center; z-index: 1000; }
        .modal { background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%; }
      `}</style>
    </div>
  );
}
