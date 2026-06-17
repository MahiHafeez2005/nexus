import { useState } from 'react';

export default function TwoFactorAuth() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '123456') {
      setStep(3);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  if (step === 3) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-4xl mb-2">🔐</div>
        <h3 className="text-lg font-semibold text-green-900">Verified Successfully!</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl mb-2">📱</div>
        <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-600">Enter the 6-digit code from your authenticator app</p>
      </div>

      <div className="flex justify-center gap-2 my-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <div className="flex justify-center gap-3">
        <button onClick={verifyOtp} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">
          Verify
        </button>
        <button onClick={() => { setOtp(['', '', '', '', '', '']); setError(''); }} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          Resend Code
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">Demo: Enter <strong>123456</strong> to verify</p>
    </div>
  );
}