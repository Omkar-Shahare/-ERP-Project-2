import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleButton')!,
        { 
          theme: 'outline',
          size: 'large',
          width: 250,
          type: 'standard'
        }
      );
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      const success = await loginWithGoogle(response.credential);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-blue-900 flex items-center justify-center">
            <ShoppingBag size={32} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ERP System Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your Google account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <div id="googleButton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;