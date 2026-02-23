import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking } from '../api';

function ConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await getBooking(bookingId);
        setBooking(data);
      } catch (err) {
        setError('Could not load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) return <div className="loading">Loading booking details...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!booking) return null;

  const nights = Math.ceil(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="card confirmation-card">
      <div className="checkmark">✓</div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Booking Confirmed!</h1>
      <p style={{ color: 'var(--text-light)' }}>
        Your reservation has been successfully created.
      </p>

      <div className="confirmation-details">
        <div className="detail-item">
          <span className="detail-label">Guest</span>
          <span className="detail-value">{booking.guestName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email</span>
          <span className="detail-value">{booking.guestEmail}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Room</span>
          <span className="detail-value">
            {booking.room?.roomNumber} — {booking.room?.type}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status</span>
          <span className="detail-value" style={{ color: 'var(--success)', textTransform: 'capitalize' }}>
            {booking.status}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Check-in</span>
          <span className="detail-value">{formatDate(booking.checkIn)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Check-out</span>
          <span className="detail-value">{formatDate(booking.checkOut)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Nights</span>
          <span className="detail-value">{nights}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Total Price</span>
          <span className="detail-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            ${booking.totalPrice}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Search Again</Link>
        <Link to="/admin" className="btn btn-primary" style={{ background: 'var(--text-light)' }}>
          View All Bookings
        </Link>
      </div>
    </div>
  );
}

export default ConfirmationPage;
