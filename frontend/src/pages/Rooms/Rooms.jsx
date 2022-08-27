import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import RoomCard from '../../components/RoomCard/RoomCard';
import styles from './Rooms.module.css';
import { getAllRooms } from '../../http';



const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const brandStyle = {
    color: ' #28C1C1',
    textDecoration: 'none',
    fontWeight: '400',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
};

  useEffect(() => {
      const fetchRooms = async () => {
          const { data } = await getAllRooms();
          setRooms(data);
      };
      fetchRooms();
  }, []);
  function openModal() {
      setShowModal(true);
  }
  return (
    <>
      <div className="container">
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <NavLink className="article" to="/article" style={brandStyle}>
          <span className={brandStyle}>Articles</span>
            </NavLink>

          <div className={styles.right}>

            
            <button
              onClick={openModal}
              className={styles.startRoomButton}
            >
              <img
                src="/images/add-room-icon.png"
                alt="add-room"
              />
              <span>Start a room</span>
            </button>
          </div>
        </div>

        <div className={styles.roomList}>
        {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}

    </>
  );
};

export default Rooms;
