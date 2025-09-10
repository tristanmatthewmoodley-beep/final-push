import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthData } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Social authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Set authentication data
          setAuthData(user, token);
          
          toast.success('Login successful!');
          
          // Navigate based on user role
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthData]);

  return (
    <div className="min-h-screen bg-car-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-car-red mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing Authentication...</h2>
        <p className="text-gray-400">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
