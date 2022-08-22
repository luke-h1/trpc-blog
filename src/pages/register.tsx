import { trpc } from '@frontend/utils/trpc';
import { CreateUserInput } from '@frontend/validation/user.schema';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['users.register'], {
    onSuccess: () => {
      router.push('/login');
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values, {
      onSuccess: () => {
        setDisabled(true);
      },
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Register</h1>

        <label htmlFor="email">
          Email
          <input
            type="email"
            placeholder="bob@bob.com"
            {...register('email')}
          />
          <br />
        </label>
        <label htmlFor="name">
          <input type="text" placeholder="bob" {...register('name')} />
        </label>

        <button type="submit" disabled={disabled}>
          Register
        </button>
      </form>
      <Link href="/login">Login</Link>
    </>
  );
};
export default RegisterPage;
