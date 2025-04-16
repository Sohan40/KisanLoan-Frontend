import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Lenders from './components/Lender/LendersDashboard';
import RequestLoan from './components/Farmer/LoanRequest';
import Documents from './components/Verifier/Documents';
import VerifierDashboard from './components/Verifier/VerifierDashboard';
import FarmersDashboard from './components/Farmer/FarmersDashboard';
import LoanDetails from './components/Farmer/LoanDetails';
import LenderDetails from './components/Lender/LoanDetails';

function App() {
  
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/myloans" element={<FarmersDashboard />} />
          {/* <Route path = "/farmer/getloans" element={<Farmers/>}> </Route> */}
          <Route path = "/lender/dashboard" element={<Lenders/>}> </Route>
          <Route path='/request' element={<RequestLoan/>}></Route>
          <Route path = "/verifier/dashboard" element={<VerifierDashboard/>}> </Route>
          <Route path='/verify/:loanID' element={<Documents/>}></Route> 
          <Route path='/myloans/:loanID' element={<LoanDetails/>}></Route> 
          <Route path='/lendedloans/:loanID' element={<LenderDetails/>}></Route> 


          {/* Catch all for 404 */}
          {/* <Route path="*" element={<NotFound/>} /> */}
        </Routes>
      </div>
    </Router>
  );

}

export default App;
