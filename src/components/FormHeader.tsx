import React from 'react';

interface FormHeaderProps {
  title?: string;
  subtitle?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title = "中华人民共和国财政部",
  subtitle = "Ministry of Finance of the People's Republic of China"
}) => {
  return (
    <div className="bg-[#e6f0fa] p-4 border-b border-gray-200 animate-fade-in">
      <div className="flex flex-col items-center space-y-0">
        <img 
          src="public/log.png" 
          alt="Logo" 
          className="w-full h-auto"
        />
        <div className="text-center mt-2">
          <h1 className="text-lg font-medium text-[#1a1a1a]">{title}</h1>
          <p className="text-sm text-[#666]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
