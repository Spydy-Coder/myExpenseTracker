import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'Email and password' }];

const signIn = async (provider, formData) => {
  const email = formData?.get('email');
  const password = formData?.get('password');

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Signed in successfully with "${provider.name}"`);
      return data;
    } else {
      alert(`Error: ${data.error}`);
      return { type: 'CredentialsSignin', error: data.error };
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    return { type: 'CredentialsSignin', error: error.message };
  }
};

export default function Login() {
  const theme = useTheme();
  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
    // preview-end
  );
}
