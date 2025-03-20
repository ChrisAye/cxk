
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { verifyAdminLogin } from '@/utils/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error("请输入用户名和密码");
      return;
    }
    
    setIsLoading(true);
    
    // Verify login (with delay for realism)
    setTimeout(() => {
      const isValid = verifyAdminLogin(credentials.username, credentials.password);
      
      if (isValid) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        toast.error("用户名或密码不正确");
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">管理员登录</h1>
              <p className="text-gray-600 mt-2">请输入您的管理员凭据</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  className="gov-input"
                  placeholder="请输入用户名"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="gov-input"
                  placeholder="请输入密码"
                />
              </div>
              
              <button
                type="submit"
                className="gov-button-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>登录中...</span>
                  </div>
                ) : "登录"}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>默认凭据: admin / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
