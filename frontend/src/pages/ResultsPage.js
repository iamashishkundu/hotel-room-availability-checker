import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { checkAvailability } from '../api';

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const type = searchParams.get('type') || 'All';

  useEffect(() => {
    if (!checkIn || !checkOut) {
      navigate('/');
      return;
    }

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await checkAvailability(checkIn, checkOut, type);
        setRooms(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch available rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [checkIn, checkOut, type, navigate]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleBook = (roomId) => {
    const params = new URLSearchParams({ checkIn, checkOut });
    navigate(`/book/${roomId}?${params.toString()}`);
  };

  if (loading) return <div className="loading">Searching available rooms...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div>
      <h1 className="page-title">Available Rooms</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
        {formatDate(checkIn)} — {formatDate(checkOut)}
        {type !== 'All' && ` · ${type}`}
        {` · ${rooms.length} room${rooms.length !== 1 ? 's' : ''} found`}
      </p>

      {rooms.length === 0 ? (
        <div className="empty-state">
          <p>No rooms available for the selected dates and type.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Modify Search
          </button>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-card-header">
                <h3>Room {room.roomNumber}</h3>
                <span className={`room-type-badge badge-${room.type}`}>{room.type}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                Max Occupancy: {room.maxOccupancy} guest{room.maxOccupancy > 1 ? 's' : ''}
              </p>
              <div className="room-amenities">
                {room.amenities.map((a, i) => (
                  <span key={i} className="amenity-tag">{a}</span>
                ))}
              </div>
              <div className="room-price">
                <span className="price-per-night">${room.pricePerNight}/night × {room.nights}</span>
                <span className="price-total">${room.totalPrice}</span>
              </div>
              <button className="btn btn-primary" onClick={() => handleBook(room._id)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
