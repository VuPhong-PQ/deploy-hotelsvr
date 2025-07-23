import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGetAllUsers } from '../../apis/admin.api';
import { Button, Alert, Card, CardBody } from 'reactstrap';

const AdminDebug = () => {
  const { userCurrent, token } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const { data: users, isLoading, error } = useGetAllUsers();

  const testDirectAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }
      
      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message
      });
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@hotel.com',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        type: 'LOGIN_TEST'
      });
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message,
        type: 'LOGIN_TEST'
      });
    }
  };

  return (
    <div className="p-4">
      <h3>Admin API Debug</h3>
      
      <Card className="mb-3">
        <CardBody>
          <h5>Current User Info:</h5>
          <pre>{JSON.stringify(userCurrent, null, 2)}</pre>
          <p><strong>User Role:</strong> {userCurrent?.role || 'Not set'}</p>
          <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
          <p><strong>Token Length:</strong> {token?.length || 0}</p>
          {token && <p><strong>Token Preview:</strong> {token.substring(0, 50)}...</p>}
        </CardBody>
      </Card>

      <Card className="mb-3">
        <CardBody>
          <h5>Hook Result:</h5>
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Users Count:</strong> {users?.length || 0}</p>
          {users && <pre>{JSON.stringify(users, null, 2)}</pre>}
        </CardBody>
      </Card>

      <Button onClick={testDirectAPI} color="primary" className="mb-3 me-2">
        Test Direct API Call
      </Button>
      
      <Button onClick={testLogin} color="success" className="mb-3">
        Test Login
      </Button>

      {testResult && (
        <Alert color={testResult.success ? 'success' : 'danger'}>
          <h6>Direct API Test Result:</h6>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </Alert>
      )}
    </div>
  );
};

export default AdminDebug;
