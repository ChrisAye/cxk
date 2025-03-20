
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Share2, Download, Copy, QrCode } from 'lucide-react';
import { toast } from "sonner";

interface QrCodeGeneratorProps {
  defaultUrl?: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ 
  defaultUrl = window.location.origin 
}) => {
  const [url, setUrl] = useState(defaultUrl);
  const [qrSize, setQrSize] = useState(200);

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const svg = document.querySelector('#qr-code-svg svg') as SVGElement;
    if (!svg) return;

    // Create a canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.width = qrSize;
    newCanvas.height = qrSize;
    const ctx = newCanvas.getContext('2d');
    if (!ctx) return;

    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, qrSize, qrSize);
      
      // Draw the image
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
      
      // Download the image
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = newCanvas.toDataURL('image/png');
      link.click();
      
      // Clean up
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("链接已复制到剪贴板");
    }).catch(err => {
      toast.error("复制链接失败");
      console.error('Failed to copy: ', err);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '财政部申请链接',
          text: '点击链接填写申请表',
          url: url,
        });
        toast.success("成功分享链接");
      } catch (error) {
        toast.error("分享链接失败");
        console.error('Error sharing:', error);
      }
    } else {
      toast.error("您的浏览器不支持分享功能");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>网站二维码生成器</span>
        </CardTitle>
        <CardDescription>
          生成当前网站的二维码，方便用户扫描访问
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="输入网址"
            className="mb-4"
          />
        </div>
        
        <div className="flex justify-center" id="qr-code-svg">
          <QRCodeSVG
            id="qr-code-canvas"
            value={url}
            size={qrSize}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="range"
            min="100"
            max="300"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm whitespace-nowrap">{qrSize}px</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="mr-1 h-4 w-4" />
          复制链接
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-1 h-4 w-4" />
          分享
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-1 h-4 w-4" />
          下载
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QrCodeGenerator;
