import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@frontend/components/LoginForm'), {
  ssr: false,
});

const LoginPage = () => {
  return <LoginForm />;
};
export default LoginPage;
