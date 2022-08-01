import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignIn = () => {
  const router = useRouter()

  const handleCallbackResponse = (response) => {
    if (response.credential) {
      localStorage.setItem('user', JSON.stringify(jwt_decode(response.credential)));
      router.push('/')
    }
  }

  useEffect(() => {
    /* global google */
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      callback: handleCallbackResponse
    });
    
    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: "outline", size: "large"
    })
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: 'center', height: '100vh'}}>
      <h1>Please sign in</h1>
      <div id="signInDiv"/>
    </div>
  );
};

export default SignIn;
