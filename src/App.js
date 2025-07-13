import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import SigninForm from './components/signin_form_component';
import SignupForm from './components/signup_form_components';
import AuthGuard from './components/AuthGuard';
import AdminDashboard from './components/AdminDashboard';
import RedirectRoot from './components/RedirectRoot'; // 👈 importe ici

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectRoot />} />
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/dashboard/*"
            element={
              <AuthGuard>
                <AdminDashboard />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
