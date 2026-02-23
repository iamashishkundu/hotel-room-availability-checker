import React, { useEffect, useState } from 'react';
import { getBookings, cancelBooking } from '../api';

function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancellingId(id);
      await cancelBooking(id);
      // Refresh list
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div>
      <h1 className="page-title">All Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-state">No bookings found.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Room</th>
                <th>Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.guestName}</td>
                  <td>{b.guestEmail}</td>
                  <td>{b.room?.roomNumber || '—'}</td>
                  <td>{b.room?.type || '—'}</td>
                  <td>{formatDate(b.checkIn)}</td>
                  <td>{formatDate(b.checkOut)}</td>
                  <td>${b.totalPrice}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'confirmed' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                      >
                        {cancellingId === b._id ? '...' : 'Cancel'}
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
