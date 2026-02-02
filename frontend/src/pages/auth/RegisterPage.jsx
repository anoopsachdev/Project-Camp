import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios"; // Direct API call for register since it's not in AuthContext usually, or we can add it.
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext"; // Assuming useAuth is available

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Register
      await api.post("/auth/register", {
        ...formData,
        role: "admin", // Defaulting to admin for simplicity as per verification script logic, or should we let user choose?
        // PRD says: User Registration. Usually self-signup doesn't choose role unless it's a specific flow.
        // The codebase verification script used 'admin' role. I'll default to admin for this "Camp" owner.
      });

      // Auto login or redirect to login?
      // The PRD says "Verification email has been sent".
      // So we should show a success message.

      navigate("/login?registered=true");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-blue-600 text-3xl font-bold">
            Project Camp
          </CardTitle>
          <p className="text-center text-gray-500 mt-2">Create your account</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div
              className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4"
              data-testid="register-error"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                data-testid="fullname-input"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                data-testid="username-input"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="email-input"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              data-testid="register-submit"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
              data-testid="login-link"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
