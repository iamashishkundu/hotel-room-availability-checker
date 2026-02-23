import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SearchPage() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomType, setRoomType] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    const params = new URLSearchParams({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      type: roomType,
    });
    navigate(`/results?${params.toString()}`);
  };

  return (
    <div>
      <h1 className="page-title">Find Available Rooms</h1>
      <div className="card">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Check-in Date</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                // Reset check-out if it's before new check-in
                if (checkOut && date >= checkOut) setCheckOut(null);
              }}
              minDate={today}
              placeholderText="Select check-in"
              dateFormat="MMM d, yyyy"
            />
          </div>

          <div className="form-group">
            <label>Check-out Date</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : today}
              placeholderText="Select check-out"
              dateFormat="MMM d, yyyy"
              disabled={!checkIn}
            />
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!checkIn || !checkOut}
          >
            Search Availability
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchPage;
