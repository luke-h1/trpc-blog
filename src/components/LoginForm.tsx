import { trpc } from '@frontend/utils/trpc';
import { CreateUserInput } from '@frontend/validation/user.schema';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    'users.verifyOTP',
    {
      hash,
    },
  ]);

  if (isLoading) {
    return <div>Verifiying...</div>;
  }

  const redirect = data?.redirect as string;

  router.push(redirect.includes('login') ? '/' : redirect || '/');
  return <p>redirecting...</p>;
}

const LoginForm = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['users.requestOTP'], {
    onSuccess: () => {
      setSuccess(true);
      setDisabled(true);
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate({ ...values, redirect: router.asPath });
  }

  const hash = router.asPath.split('#token=')[1];

  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        {success && <p>Success! Check your email</p>}
        <h1>Login</h1>
        <label htmlFor="email">
          Email
          <input
            type="email"
            placeholder="bob@bob.com"
            {...register('email')}
          />
          <button type="submit" disabled={disabled}>
            Login
          </button>
        </label>
      </form>
      <Link href="/register">Register</Link>
    </>
  );
};
export default LoginForm;
