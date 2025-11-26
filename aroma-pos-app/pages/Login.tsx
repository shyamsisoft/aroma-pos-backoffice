import React from 'react';
import LoginView from '../components/LoginView';
import { Employee } from '../types';

interface LoginProps {
    onLogin: (user: Employee) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return <LoginView onLogin={onLogin} />;
};

export default Login;