import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Home from './components/Home';
import Lenders from './components/LendersDashboard';
import RequestLoan from './components/LoanRequest';
function App() {
  
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/farmer/register" element={<Register />} />
          {/* <Route path = "/farmer/getloans" element={<Farmers/>}> </Route> */}
          <Route path = "/lender/dashboard" element={<Lenders/>}> </Route>
          <Route path='/request' element={<RequestLoan/>}></Route>

          {/* Catch all for 404 */}
          {/* <Route path="*" element={<NotFound/>} /> */}
        </Routes>
      </div>
    </Router>
  );

}

export default App;
