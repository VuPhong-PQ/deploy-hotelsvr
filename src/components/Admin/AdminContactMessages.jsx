import React, { useEffect, useState } from "react";
import { fetchContactMessages, deleteContactMessage } from "../../apis/admin.contact.api";
import "../../styles/admin.css";
import "../../styles/admin-contact-messages.css";

const PAGE_SIZE = 10;

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchContactMessages({ search, page, pageSize: PAGE_SIZE, ...params });
      setMessages(Array.isArray(res?.messages) ? res.messages : []);
      setTotal(typeof res?.total === 'number' ? res.total : 0);
    } catch {
      setError("Không thể tải dữ liệu!");
      setMessages([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa liên hệ này?")) return;
    setDeletingId(id);
    try {
      await deleteContactMessage(id);
      loadData();
    } catch {
      alert("Xóa thất bại!");
    }
    setDeletingId(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-contact-messages">
      <h2 className="admin-title">Quản Lý Liên Hệ</h2>
      <div className="admin-contact-toolbar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Tìm kiếm họ tên, email, nội dung..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {loading && <div className="admin-loading">Đang tải...</div>}
      {error && <div className="admin-error">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover admin-table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Nội dung</th>
                <th>Thời gian gửi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td style={{ maxWidth: 300, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                    >
                      {deletingId === msg.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="admin-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`admin-page-btn${num === page ? ' active' : ''}`}
              onClick={() => setPage(num)}
              disabled={num === page}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
