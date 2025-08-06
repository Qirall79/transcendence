import { createContext, ReactNode, useState, useEffect } from 'react';
import { getUser } from '../actions/userActions';
import { IUser } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthContext = createContext<{
  user: IUser;
  setUser: any;
  isLoading: boolean;
}>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const fetchUser = async () => {
    const user = await getUser();
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      !isLoading &&
      !user &&
      !pathname.startsWith('/auth') &&
      !pathname.startsWith('/offline')
    )
      navigate('/auth/login');
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if ((!user?.username && pathname === '/') || (user?.username && pathname === '/')) {
        return;
      }
      if (!user?.username && !pathname.startsWith('/auth') && !pathname.startsWith('/offline')) {
        if (pathname !== '/auth/login') {
          navigate('/auth/login');
        }
      } else if (
        user?.username &&
        (pathname.startsWith('/auth') || pathname === '/')
      ) {
        if (pathname !== '/dashboard') {
          navigate('/dashboard');
        }
      }
    }
  }, [isLoading, pathname, navigate]);

  if (isLoading && pathname !== '/') {
    return (
      <div className='w-screen h-screen flex flex-col space-y-6 overflow-hidden'>
        <Skeleton className='w-full h-20' />
        <div className='w-full flex h-[90%] space-x-4'>
          <Skeleton className='w-1/5 h-full' />
          <Skeleton className='flex-1 h-full' />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
