'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Phone Auth States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'options' | 'phone' | 'otp'>('options');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Focus and Recaptcha refs
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      // Format phone number to international, assume Vietnam +84 if starts with 0
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+84' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      const confResult = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier);
      setConfirmationResult(confResult);
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError('Failed to send OTP. Please check your phone number.');
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true);
    setError('');

    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      const signInResult = await signIn('phone', {
        idToken,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Server authentication failed.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div id="recaptcha-container"></div>
      {/* Mini Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Home
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-xl shadow-xl sm:shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {step === 'options' && 'Customer Login'}
              {step === 'phone' && 'Enter Phone Number'}
              {step === 'otp' && 'Confirm OTP'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'options' && 'Manage your trips and store payment information'}
              {step === 'phone' && 'We will send an OTP code via SMS'}
              {step === 'otp' && `A 6-digit code has been sent to ${phone}`}
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {step === 'options' && (
              <>
                <Button
                  onClick={() => setStep('phone')}
                  className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-transparent text-white hover:bg-gray-800 h-12"
                >
                  <Phone className="w-5 h-5" />
                  Login with Phone Number (SMS)
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
            {/* Google Login */}
            <Button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </Button>

            {/* Zalo Login */}
            <Button
              onClick={() => signIn('zalo', { callbackUrl: '/dashboard' })}
              className="w-full flex items-center justify-center gap-3 bg-[#0068FF] hover:bg-[#0054cc] text-white h-12"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M21.166 4.672C19.7 2.5 16.518 1 11.96 1 4.7 1 1 5.352 1 10.264c0 3.1 1.576 6.068 4.86 8.01a.333.333 0 01.144.372l-.766 2.686c-.056.195.158.35.318.251l3.525-2.227a.332.332 0 01.3-.016c1 .461 2.457.818 3.974.818C20 20.158 23 16.035 23 10.264c0-2.31-.692-4.223-1.834-5.592zm-8.8 6.784H9.422a.377.377 0 01-.365-.286l-.287-1.077c-.035-.13-.017-.266.046-.38a.36.36 0 01.32-.18h2.95c.19 0 .346.162.346.36v.054c0 .2-.155.362-.345.362h-1.63L11.516 11.4h.85c.19 0 .346.162.346.362v.053c0 .2-.156.36-.346.36zm4.98-1.564a.366.366 0 01.196.223h.001l.377 1.157a.37.37 0 01-.137.408.349.349 0 01-.424-.035l-1.99-1.67v.465c0 .198-.157.36-.347.36v0c-.19 0-.347-.162-.347-.36V9.034c0-.198.156-.36.347-.36v0c.19 0 .347.162.347.36v1.442l1.638-1.683a.36.36 0 01.488-.04l.019.014a.377.377 0 01.106.5l-1.127 1.34h0l.855.849zM5.96 11.458h-.022A1.912 1.912 0 014.05 9.54V9.52c0-1.053.844-1.92 1.888-1.92s1.888.867 1.888 1.92v.022a1.912 1.912 0 01-1.866 1.916zm.012-3.111c-.655 0-1.2.53-1.2 1.18v.011c0 .653.545 1.183 1.2 1.183.656 0 1.201-.53 1.201-1.183v-.01c0-.65-.545-1.18-1.2-1.18z"/>
              </svg>
              Login with Zalo
            </Button>
            </>
            )}

            {step === 'phone' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Ex: +84 905 123 456" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
                <Button type="submit" disabled={loading || !phone} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg font-medium">
                  {loading ? 'Sending...' : 'Send OTP Code'}
                </Button>
                <div className="text-center mt-2">
                  <button type="button" onClick={() => setStep('options')} className="text-sm text-gray-500 hover:text-gray-800 underline">
                    Back
                  </button>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="Enter 6-digit code..." 
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl tracking-[0.5em] text-center focus:ring-2 focus:ring-orange-500"
                  required
                />
                <Button type="submit" disabled={loading || otp.length < 6} className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg font-medium">
                  {loading ? 'Verifying...' : 'Confirm Login'}
                </Button>
                <div className="text-center mt-2">
                  <button type="button" onClick={() => { setStep('phone'); setOtp(''); }} className="text-sm text-gray-500 hover:text-gray-800 underline">
                    Resend Code / Change Phone
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            By logging in, you agree to the Terms of Service and <br/> Privacy Policy of DaNang Private Transfer
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Need help?</span>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84905555555'}`} className="text-orange-500 hover:underline inline-flex items-center gap-1.5 font-medium bg-orange-50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-full">
              <MessageCircle className="w-4 h-4"/> 24/7 WhatsApp / Zalo Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
