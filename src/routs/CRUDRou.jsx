import React from 'react'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import App from '../App'
import UserTable from '../page/UserTable'
const AppRoutes = () => {
  return (
    <div>
        <Router>
            <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/user' element = {<UserTable />}/>
            </Routes>
        </Router>
      
    </div>
  )
}

export default AppRoutes