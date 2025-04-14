
import React, { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return <div className="login-layout">{children}</div>;
};
 
export default LoginLayout;