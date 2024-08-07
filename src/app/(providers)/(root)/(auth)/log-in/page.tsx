'use client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/contexts/auth.context/auth.context';
import useInput from '@/hooks/useInput';
function LogInPage() {
  const { logIn, logInWithKakao } = useAuth();
  const emailInput = useInput('');
  const passwordInput = useInput('');

  const handleLogin = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const logInData = { email, password };
    await logIn(logInData);
  };

  const handleKaKaoLogin = async () => await logInWithKakao();

  return (
    <>
      <form className="my-5 flex flex-col gap-2">
        <Input label="Email" type="email" {...emailInput} />
        <Input label="Password" type="password" {...passwordInput} />
      </form>
      <div className="mt-10 flex flex-col gap-y-4">
        <Button size="lg" onClick={handleLogin} fit={false}>
          로그인
        </Button>
        <Button size="lg" href="/sign-up" fit={false}>
          회원가입
        </Button>
        <Button size="lg" intent="yellow" onClick={handleKaKaoLogin} fit={false}>
          카카오 로그인
        </Button>
      </div>
    </>
  );
}

export default LogInPage;
