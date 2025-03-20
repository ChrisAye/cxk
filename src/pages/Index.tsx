import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import FormHeader from '@/components/FormHeader';
import Footer from '@/components/Footer';
import { UserFormData } from '@/types';

// 验证姓名（2-8个汉字）
const isValidName = (name: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,8}$/;
  return nameRegex.test(name);
};

// 验证身份证号
const isValidIdNumber = (id: string): boolean => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(id)) {
    return false;
  }

  if (id.length === 18) {
    // 加权因子
    const weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    // 获取前17位
    const idCard17 = id.substring(0, 17);
    
    // 获取校验码
    const checkCode = id.substring(17, 18).toUpperCase();
    
    // 计算校验码
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard17[i]) * weight[i];
    }
    
    // 计算出来的校验码与输入的校验码比对
    return checkCode === codes[sum % 11];
  }
  
  return true; // 15位身份证不做校验
};

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserFormData>>({
    fullName: '',
    idNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.idNumber) {
      toast.error("请填写所有必填字段");
      return;
    }

    // 验证姓名
    if (!isValidName(formData.fullName)) {
      toast.error("请输入2-8个汉字的真实姓名");
      return;
    }
    
    // 验证身份证号
    if (!isValidIdNumber(formData.idNumber)) {
      toast.error("请输入有效的身份证号码");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Store form data in session storage for the next step
      sessionStorage.setItem('formData', JSON.stringify(formData));
      navigate('/second-form');
    }, 800);
  };

  const refreshData = () => {
    // Implement your refresh logic here
    toast.success('Data refreshed!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 animate-fade-in">
      <div className="form-container my-8">
        <FormHeader />
        
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-blue-800 space-x-2">
              <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
              <p className="text-sm">请输入实名信息查询是否符合申请要求</p>
            </div>
            
            <div className="flex items-center text-blue-800 space-x-2">
              <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
              <p className="text-sm">本次补贴政策截日期至今日24点整</p>
            </div>
            
            <div className="flex items-center text-blue-800 space-x-2">
              <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
              <p className="text-sm">逾期未申请用户，视为自动放弃领取</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="输入真实姓名"
                  className="gov-input"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="请输入身份证号码"
                  className="gov-input"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="gov-button-primary flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>处理中...</span>
                </div>
              ) : "下一步"}
            </button>
            
            <button onClick={refreshData} className="gov-button-secondary flex items-center justify-center">
              刷新
            </button>
          </form>
        </div>
        
        <Footer />
      </div>
      
      <div className="mt-auto text-center text-xs text-gray-500 py-4">
        {new Date().getFullYear()} 中华人民共和国财政部 版权所有
      </div>
    </div>
  );
};

export default Index;
