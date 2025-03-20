
import { SubmissionData, UserFormData, WaitingMessage } from "@/types";

// Simulating API logic since we don't have a backend connected yet
// In a real project, these would be actual API calls

// Local storage keys
const SUBMISSIONS_KEY = 'data_submissions';
const WAITING_MESSAGES_KEY = 'waiting_messages';
const ADMIN_CREDENTIALS_KEY = 'admin_credentials';

// Initial waiting messages
const initialWaitingMessages: WaitingMessage[] = [
  { id: '1', message: '请耐心等待2分钟，请勿关闭网页！', isDefault: true },
  { id: '2', message: '系统正在处理，请稍候...', isDefault: false },
  { id: '3', message: '正在验证信息，请不要刷新页面', isDefault: false },
];

// Initial admin credentials
const initialAdminCredentials = {
  username: 'admin',
  password: 'admin123'
};

// Initialize local storage with default data if empty
export const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(SUBMISSIONS_KEY)) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(WAITING_MESSAGES_KEY)) {
    localStorage.setItem(WAITING_MESSAGES_KEY, JSON.stringify(initialWaitingMessages));
  }
  
  if (!localStorage.getItem(ADMIN_CREDENTIALS_KEY)) {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(initialAdminCredentials));
  }
};

// Get user IP and location data
export const getUserIpInfo = async (): Promise<{ ip: string; country: string; city: string }> => {
  try {
    // In a real implementation, you'd use a service like ipinfo.io
    // For this demo, we'll return mock data
    return {
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      country: 'China',
      city: 'Beijing'
    };
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return {
      ip: 'Unknown',
      country: 'Unknown',
      city: 'Unknown'
    };
  }
};

// Submit form data
export const submitFormData = async (formData: UserFormData): Promise<string> => {
  try {
    const submissions: SubmissionData[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    const ipInfo = await getUserIpInfo();
    
    const newSubmission: SubmissionData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ipAddress: ipInfo.ip,
      country: ipInfo.country,
      city: ipInfo.city,
      userAgent: navigator.userAgent,
      notes: '',
      customMessage: getDefaultWaitingMessage(),
      ...formData
    };
    
    submissions.push(newSubmission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    
    return newSubmission.id;
  } catch (error) {
    console.error('Error submitting form data:', error);
    throw new Error('提交数据时出错');
  }
};

// Get all submissions
export const getAllSubmissions = (): SubmissionData[] => {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  } catch (error) {
    console.error('Error getting submissions:', error);
    return [];
  }
};

// Get submission by ID
export const getSubmissionById = (id: string): SubmissionData | undefined => {
  try {
    const submissions: SubmissionData[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    return submissions.find(submission => submission.id === id);
  } catch (error) {
    console.error('Error getting submission by ID:', error);
    return undefined;
  }
};

// Update submission notes
export const updateSubmissionNotes = (id: string, notes: string): boolean => {
  try {
    const submissions: SubmissionData[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    const updatedSubmissions = submissions.map(submission => 
      submission.id === id ? { ...submission, notes } : submission
    );
    
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
    return true;
  } catch (error) {
    console.error('Error updating submission notes:', error);
    return false;
  }
};

// Update submission custom message
export const updateSubmissionMessage = (id: string, customMessage: string): boolean => {
  try {
    const submissions: SubmissionData[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    const updatedSubmissions = submissions.map(submission => 
      submission.id === id ? { ...submission, customMessage } : submission
    );
    
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
    return true;
  } catch (error) {
    console.error('Error updating submission message:', error);
    return false;
  }
};

// Delete submission
export const deleteSubmission = (id: string): boolean => {
  try {
    const submissions: SubmissionData[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    const updatedSubmissions = submissions.filter(submission => submission.id !== id);
    
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
    return true;
  } catch (error) {
    console.error('Error deleting submission:', error);
    return false;
  }
};

// Get all waiting messages
export const getAllWaitingMessages = (): WaitingMessage[] => {
  try {
    return JSON.parse(localStorage.getItem(WAITING_MESSAGES_KEY) || '[]');
  } catch (error) {
    console.error('Error getting waiting messages:', error);
    return initialWaitingMessages;
  }
};

// Add new waiting message
export const addWaitingMessage = (message: string): boolean => {
  try {
    const messages: WaitingMessage[] = JSON.parse(localStorage.getItem(WAITING_MESSAGES_KEY) || '[]');
    const newMessage: WaitingMessage = {
      id: Date.now().toString(),
      message,
      isDefault: false
    };
    
    messages.push(newMessage);
    localStorage.setItem(WAITING_MESSAGES_KEY, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error adding waiting message:', error);
    return false;
  }
};

// Update waiting message
export const updateWaitingMessage = (id: string, message: string): boolean => {
  try {
    const messages: WaitingMessage[] = JSON.parse(localStorage.getItem(WAITING_MESSAGES_KEY) || '[]');
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, message } : msg
    );
    
    localStorage.setItem(WAITING_MESSAGES_KEY, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.error('Error updating waiting message:', error);
    return false;
  }
};

// Delete waiting message
export const deleteWaitingMessage = (id: string): boolean => {
  try {
    const messages: WaitingMessage[] = JSON.parse(localStorage.getItem(WAITING_MESSAGES_KEY) || '[]');
    // Don't delete messages marked as default
    if (messages.find(msg => msg.id === id)?.isDefault) {
      return false;
    }
    
    const updatedMessages = messages.filter(msg => msg.id !== id);
    localStorage.setItem(WAITING_MESSAGES_KEY, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.error('Error deleting waiting message:', error);
    return false;
  }
};

// Set default waiting message
export const setDefaultWaitingMessage = (id: string): boolean => {
  try {
    const messages: WaitingMessage[] = JSON.parse(localStorage.getItem(WAITING_MESSAGES_KEY) || '[]');
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isDefault: msg.id === id
    }));
    
    localStorage.setItem(WAITING_MESSAGES_KEY, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.error('Error setting default waiting message:', error);
    return false;
  }
};

// Get default waiting message
export const getDefaultWaitingMessage = (): string => {
  try {
    const messages: WaitingMessage[] = JSON.parse(localStorage.getItem(WAITING_MESSAGES_KEY) || '[]');
    const defaultMessage = messages.find(msg => msg.isDefault);
    return defaultMessage?.message || '请耐心等待，处理中...';
  } catch (error) {
    console.error('Error getting default waiting message:', error);
    return '请耐心等待，处理中...';
  }
};

// Verify admin login
export const verifyAdminLogin = (username: string, password: string): boolean => {
  try {
    const credentials = JSON.parse(localStorage.getItem(ADMIN_CREDENTIALS_KEY) || '{}');
    return credentials.username === username && credentials.password === password;
  } catch (error) {
    console.error('Error verifying admin login:', error);
    return false;
  }
};
