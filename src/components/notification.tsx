import { Button, notification } from 'antd';
type NotificationType = 'success' | 'info' | 'warning' | 'error';

export function showMessage(type: NotificationType, description: string, message?: string) {
  notification[type]({
    message: message || "Thông báo",
    description: description,
  });
}


export default showMessage;