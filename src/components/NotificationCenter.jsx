import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const mockNotifications = [
      { id: 1, type: 'success', message: 'Tool execution completed', timestamp: new Date() },
      { id: 2, type: 'error', message: 'Failed to process request', timestamp: new Date() },
      { id: 3, type: 'info', message: 'System maintenance scheduled', timestamp: new Date() },
      { id: 4, type: 'warning', message: 'High request volume detected', timestamp: new Date() }
    ];
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h1>Notification Center</h1>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <button onClick={clearAll} className="btn btn-secondary">
            Clear All
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">No notifications</div>
        ) : (
          filteredNotifications.map(notif => (
            <div key={notif.id} className={`notification notification-${notif.type}`}>
              <div className="notification-content">
                <span className="notification-type">{notif.type}</span>
                <p className="notification-message">{notif.message}</p>
                <span className="notification-time">
                  {notif.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <button 
                onClick={() => removeNotification(notif.id)}
                className="notification-close"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationCenter;

