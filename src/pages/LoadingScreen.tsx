import React, { useState, useEffect } from 'react';
import FormHeader from '@/components/FormHeader';
import { getSubmissionById } from '@/utils/api';

const LoadingScreen = () => {
  const [message, setMessage] = useState<string>('系统正在提交中...');
  
  useEffect(() => {
    // Get the initial message
    const fetchSubmissionData = () => {
      const submissionId = sessionStorage.getItem('submissionId');
      if (submissionId) {
        const submission = getSubmissionById(submissionId);
        if (submission?.customMessage && submission.customMessage !== message) {
          setMessage(submission.customMessage);
          // Toast notification removed as requested
        }
      }
    };

    // Fetch data immediately
    fetchSubmissionData();
    
    // Set up polling interval to check for message updates more frequently
    const intervalId = setInterval(fetchSubmissionData, 1000); // Check every second for more immediate updates
    
    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 animate-fade-in pt-0">
      <div className="form-container my-8">
        <FormHeader />
        
        <div className="p-8 flex flex-col items-center">
          <div className="my-12 flex flex-col items-center">
            <div className="flex space-x-3 mb-8">
              <div className="w-4 h-4 bg-gov-red rounded-sm animate-pulse-dot-1"></div>
              <div className="w-4 h-4 bg-gov-red rounded-sm animate-pulse-dot-2"></div>
              <div className="w-4 h-4 bg-gov-red rounded-sm animate-pulse-dot-3"></div>
            </div>
            
            <h2 className="text-lg font-medium mb-2">系统正在提交中...</h2>
            <p className="text-gray-600 text-center">{message}</p>
            <p className="text-gray-600 text-center mt-4 text-sm">当前排队人数较多，您前面还有【2】位用户等待处理！</p>
            <p className="text-gray-600 text-center text-sm">⏳ 预计等待时间约【10分钟】离开页面将导致重新排队</p>
            <p className="text-gray-600 text-center text-sm">系统将自动刷新并推送结果</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-center text-xs text-gray-500 py-4">
        {new Date().getFullYear()} 中华人民共和国财政部 版权所有
      </div>
    </div>
  );
};

export default LoadingScreen;
