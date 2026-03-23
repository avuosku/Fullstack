import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) return null

  const style = {
    border: '1px solid',
    padding: 10,
    marginBottom: 10,
    color: 'green',
  }

  return <div style={style}>{notification}</div>
}

export default Notification
