

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const getStrengthInfo = (score: number) => {
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500' };
  if (score <= 6) return { label: 'Good', color: 'bg-blue-500' };
  return { label: 'Strong', color: 'bg-green-500' };
};

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  
  const score = getPasswordStrength(password);
  const { label, color } = getStrengthInfo(score);
  
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[...Array(7)].map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded ${i < score ? color : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm mt-1 text-gray-600">
        Strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}