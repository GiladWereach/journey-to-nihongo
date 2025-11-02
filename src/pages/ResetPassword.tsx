
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPasswordPageViewed, passwordResetFailed, passwordResetRequested, useAuth, preventDefault } from '@/lib/analytics-generated';

// Track reset_password_page_viewed
resetPasswordPageViewed();
// Track password_reset_failed
passwordResetFailed();
// Track password_reset_requested
passwordResetRequested();
const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-softgray px-4">
      <Link to="/auth" className="absolute top-8 left-8 flex items-center text-indigo hover:text-vermilion transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Login
      </Link>
      
      <Card className="w-full max-w-md">
        <form onSubmit={handleResetPassword}>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {submitted 
                ? "Check your email for a password reset link" 
                : "Enter your email and we'll send you a password reset link"}
            </CardDescription>
          </CardHeader>
          {!submitted ? (
            <>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo hover:bg-indigo/90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending link...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <svg className="mx-auto h-12 w-12 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-800 mb-2">Email sent successfully!</p>
                <p className="text-green-600 text-sm">Check your email for instructions to reset your password.</p>
              </div>
              <Button 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800" 
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
              >
                Send Again
              </Button>
              <div className="text-center">
                <Link to="/auth" className="text-indigo hover:underline text-sm">
                  Return to Login
                </Link>
              </div>
            </CardContent>
          )}
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
