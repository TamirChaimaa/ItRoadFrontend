import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import SigninForm from './components/signin_form_component';
import SignupForm from './components/signup_form_components';
import AuthGuard from './components/AuthGuard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/*" element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;