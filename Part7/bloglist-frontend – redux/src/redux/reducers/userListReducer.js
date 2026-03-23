import userService from "/src/services/userService.js"

const userListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USERS':
      return action.payload
    default:
      return state
  }
}

export const fetchUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    console.log('Haetut käyttäjät palvelimelta:', users)
    dispatch({
      type: 'SET_USERS',
      payload: users,
    })
  }
}

export default userListReducer
