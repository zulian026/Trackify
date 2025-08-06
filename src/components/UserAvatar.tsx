// components/UserAvatar.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export default function UserAvatar({
  size = "md",
  showName = false,
  className = "",
}: UserAvatarProps) {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  if (!user) return null;

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const initials =
    fullName
      ?.split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-300 flex items-center justify-center`}
      >
        {avatarUrl && !imageError ? (
          <Image
            src={avatarUrl}
            alt={fullName || "User"}
            width={size === "sm" ? 32 : size === "md" ? 40 : 64}
            height={size === "sm" ? 32 : size === "md" ? 40 : 64}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span
            className={`font-semibold text-gray-600 ${
              sizeClasses[size].split(" ")[2]
            }`}
          >
            {initials}
          </span>
        )}
      </div>

      {showName && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm">{fullName}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      )}
    </div>
  );
}
