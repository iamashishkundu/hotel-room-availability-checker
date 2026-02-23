import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { createBooking } from '../api';

function BookingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;

    try {
      setLoading(true);
      setError('');
      const { data } = await createBooking({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        roomId,
        checkIn,
        checkOut,
      });
      navigate(`/confirmation/${data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Booking failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!checkIn || !checkOut) {
    navigate('/');
    return null;
  }

  return (
    <div>
      <h1 className="page-title">Complete Your Booking</h1>
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
          {formatDate(checkIn)} — {formatDate(checkOut)}
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Guest Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
