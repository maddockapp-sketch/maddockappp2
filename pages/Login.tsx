
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { handleGoogleSuccess } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter">
          Maddock
        </h1>
        <p className="text-xl md:text-2xl font-display uppercase text-gray-400 mb-12">
          Tattoo Studio
        </p>

        <p className="mb-8 text-gray-300">
          Acesse sua conta para gerenciar seus agendamentos e conversar com nosso assistente de cuidados.
        </p>
        
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                theme="filled_black"
                text="signin_with"
                shape="pill"
            />
        </div>
      </div>
    </div>
  );
}
