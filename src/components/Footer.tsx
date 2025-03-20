import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center space-x-6 mt-4 py-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-[#f0f0f0] rounded-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/bff8c8fe-fc61-4d8c-bef9-e083c5444adb.png" 
            alt="Security Seal" 
            className="w-6 h-6"
          />
        </div>
        <span className="text-xs text-gray-500 mt-1">
          <a href="https://www.mof.gov.cn/" target="_blank" rel="noopener noreferrer">安全机关</a>
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-[#f0f0f0] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          <a href="https://www.mof.gov.cn/" target="_blank" rel="noopener noreferrer">政府网站</a>
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-[#f0f0f0] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          <a href="https://www.mof.gov.cn/" target="_blank" rel="noopener noreferrer">无障碍服务</a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
