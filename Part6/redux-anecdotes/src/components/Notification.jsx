// components/Notification.jsx
import React from 'react'
import { useNotificationValue } from '../notificationContext' // polku riippuu sijainnista

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  return (
    <div style={{ border: '1px solid black', padding: '10px', backgroundColor: 'lightgray' }}>
      {notification}
    </div>
  )
}

export default Notification
