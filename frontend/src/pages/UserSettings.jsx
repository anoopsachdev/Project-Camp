import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import api from "../api/axios";
import { toast } from "sonner";
import Avatar from "react-avatar";

const UserSettings = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/change-password", { oldPassword, newPassword });
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">
        Settings
      </h2>

      <div className="grid gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                name={user?.fullName || user?.username || "User"}
                size="80"
                round={true}
                textSizeRatio={1.75}
              />
              <div>
                <p className="text-sm text-gray-500">Profile Avatar</p>
              </div>
            </div>
            <div>
              <Label>Full Name</Label>
              <p className="text-gray-900 font-medium mt-1">
                {user?.fullName || "Not set"}
              </p>
            </div>
            <div>
              <Label>Username</Label>
              <p className="text-gray-900 font-medium mt-1">{user?.username}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleChangePassword}
              className="space-y-4 max-w-md"
            >
              <div>
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" isLoading={isLoading}>
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
