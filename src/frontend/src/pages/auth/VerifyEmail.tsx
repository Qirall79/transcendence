import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Mail, AlertCircle } from "lucide-react";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const error = params.get("error");

  if (error !== null) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-black border border-gray-800 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-black border border-gray-800 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-6">
              Verification link expired or invalid, please sign up again.
            </p>
            <Link 
              to="/auth/register" 
              className="inline-flex items-center justify-center px-4 py-2 bg-black border border-gray-800 hover:border-gray-700 text-white rounded-lg transition-colors"
            >
              Return to Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black border border-gray-800 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-black border border-gray-800 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400 mb-4">
            A verification link has been sent to your email.
            <br />
            Please click the link to continue.
          </p>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Didn't receive an email? Check your spam folder or
            <Link to="/auth/register" className="ml-1 text-white hover:text-gray-300 transition-colors">
              try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}