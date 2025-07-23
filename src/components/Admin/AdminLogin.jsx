import React, { useState } from 'react';
import { Button, Card, CardBody, Alert } from 'reactstrap';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

const AdminLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAdminLogin = async () => {
    setLoading(true);
    console.log('Starting login request...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@hotel.com',
          password: 'admin123'
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('Login successful, calling login function...');
        login(data.user, data.token);
        setResult({
          success: true,
          message: 'Đăng nhập Admin thành công!',
          user: data.user
        });
      } else {
        console.log('Login failed:', data);
        setResult({
          success: false,
          message: data.message || 'Login failed'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult({
        success: false,
        message: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <Card>
        <CardBody>
          <h5>Quick Admin Login</h5>
          <p>Đăng nhập nhanh với account:</p>
          <p><strong>Email:</strong> admin@hotel.com</p>
          <p><strong>Password:</strong> admin123</p>
          
          <Button 
            color="primary" 
            onClick={handleAdminLogin}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Login as Admin'}
          </Button>

          {result && (
            <Alert color={result.success ? 'success' : 'danger'} className="mt-3">
              <p>{result.message}</p>
              {result.user && (
                <div>
                  <strong>User:</strong> {result.user.firstName} {result.user.lastName}<br/>
                  <strong>Email:</strong> {result.user.email}<br/>
                  <strong>Role:</strong> {result.user.role}
                </div>
              )}
            </Alert>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminLogin;
