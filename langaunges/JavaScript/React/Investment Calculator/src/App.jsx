import UserInput from "./components/UserInput.jsx"
import { USER_INPUT_INFO } from "./const/userInfo.js"
function App() {
  return (
      <UserInput userInputInfo={USER_INPUT_INFO} />
  )
}

export default App