import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import api from "../../api/axios";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const EmailVerification = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${verificationToken}`);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            "Verification failed. The link may be invalid or expired.",
        );
      }
    };

    if (verificationToken) {
      verifyEmail();
    }
  }, [verificationToken]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await api.post("/auth/resend-email-verification");
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend verification email. Please try logging in first.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-blue-600 text-3xl font-bold">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {/* Verifying State */}
          {status === "verifying" && (
            <>
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 text-center">
                Verifying your email...
              </p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Verified!
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Your email has been successfully verified. You can now log in to
                your account.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Proceed to Login
              </Button>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h3>
              <p className="text-gray-600 text-center mb-6">{errorMessage}</p>
              <div className="w-full space-y-3">
                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  isLoading={isResending}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full">
                    Go to Login
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Note: You need to be logged in to resend the verification email.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
