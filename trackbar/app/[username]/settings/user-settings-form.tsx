"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Camera, User, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface UserSettingsFormProps {
  initialData: {
    fullName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
  };
}

export function UserSettingsForm({ initialData }: UserSettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    username: initialData.username || "",
    bio: initialData.bio || "",
  });

  // Reset status after 3 seconds
  useEffect(() => {
    if (saveStatus !== "idle") {
      const timer = setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Preview the image immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    try {
      setIsSaving(true);
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload the file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      // Delete old avatar if it exists
      if (avatarUrl) {
        const oldFileName = avatarUrl.split("/").pop();
        if (oldFileName) {
          await supabase.storage
            .from("avatars")
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...formData,
          avatar_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSaveStatus("success");
      router.refresh();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio,
          avatar_url: avatarUrl,
        },
      });

      if (error) throw error;
      setSaveStatus("success");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-quokka-purple/5 hover:border-quokka-purple/30 transition-all"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-quokka-light mb-2 flex items-center">
          <span className="inline-block w-1 h-6 bg-gradient-to-b from-quokka-purple to-quokka-cyan rounded-full mr-3"></span>
          Profile Settings
        </h2>
        <p className="text-quokka-light/60">Customize your gaming profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div
            onClick={handleAvatarClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-32 h-32 rounded-xl bg-gradient-to-br from-quokka-purple to-quokka-cyan p-1 cursor-pointer group transition-all duration-300 ${isDragging ? 'scale-105 shadow-lg shadow-quokka-purple/20' : ''}`}
          >
            <div className="w-full h-full rounded-lg bg-quokka-dark/80 overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover absolute inset-0 rounded-lg"
                />
              ) : (
                <User className="w-12 h-12 text-quokka-cyan/50" />
              )}
              <div className="absolute inset-0 bg-quokka-darker/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="flex flex-col items-center">
                  <Camera className="w-8 h-8 text-quokka-cyan mb-2" />
                  <span className="text-xs text-quokka-light/80 text-center px-2">Click or drop image</span>
                </div>
              </div>
            </div>
            {isSaving && (
              <div className="absolute inset-0 bg-quokka-darker/70 rounded-xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-quokka-cyan animate-spin" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-quokka-light mb-2">Profile Picture</h3>
            <p className="text-sm text-quokka-light/60 mb-3">
              Upload a profile picture to personalize your gaming profile. 
              PNG or JPG, max 5MB.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline" className="bg-quokka-purple/10 border-quokka-purple/30 text-quokka-purple">
                Drag & Drop
              </Badge>
              <Badge variant="outline" className="bg-quokka-cyan/10 border-quokka-cyan/30 text-quokka-cyan">
                Click to Browse
              </Badge>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-quokka-light/80 font-medium">Full Name</Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-quokka-purple/20 to-quokka-cyan/20 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="bg-quokka-dark/30 border-quokka-purple/10 rounded-lg focus:border-quokka-purple/30 text-quokka-light"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-quokka-light/80 font-medium">Username</Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-quokka-purple/20 to-quokka-cyan/20 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
              <Input
                id="username"
                placeholder="@johndoe"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                className="bg-quokka-dark/30 border-quokka-purple/10 rounded-lg focus:border-quokka-purple/30 text-quokka-light"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-quokka-light/80 font-medium">Bio</Label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-quokka-purple/20 to-quokka-cyan/20 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
            <Textarea
              id="bio"
              placeholder="Tell us about your gaming interests and achievements..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="bg-quokka-dark/30 border-quokka-purple/10 rounded-lg focus:border-quokka-purple/30 text-quokka-light min-h-[120px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <AnimatePresence mode="wait">
            {saveStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center mr-4 text-green-400"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Saved successfully!</span>
              </motion.div>
            )}
            
            {saveStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center mr-4 text-red-400"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Error saving changes</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 transition-opacity text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
