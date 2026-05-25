"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Pencil, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { API } from "@/lib/utils";
import { useFetchData } from "@/hooks/useFetchData";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status: number;
  };
  data: T;
};

type UserProfile = {
  id?: number | string;
  nama?: string;
  email?: string;
  notelp?: string;
  avatar?: string | null;
  avatarUrl?: string | null;
};

type ProfileDraft = {
  nama: string;
  email: string;
  notelp: string;
};

function Avatar({ nama, src }: { nama: string; src?: string | null }) {
  const initials = nama
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-xl font-semibold text-gray-700">
      {src ? (
        <Image
          src={src}
          alt={nama || "User avatar"}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        initials || "U"
      )}
    </div>
  );
}

export default function AccountSettingContent() {
  const {
    data: userResponse,
    error,
    isLoading,
    mutate,
  } = useFetchData<ApiResponse<UserProfile>>("/users/me");

  const user = userResponse?.data;
  const displayName = user?.nama ?? "";
  const displayEmail = user?.email ?? "";
  const displayPhone = user?.notelp ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>({
    nama: "",
    email: "",
    notelp: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const displayAvatar =
    avatarPreview || user?.avatarUrl || user?.avatar || null;

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!user?.id) {
      toast.error("Data user belum tersedia.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format avatar harus JPG atau PNG.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Ukuran avatar maksimal 10MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append("avatar", file, file.name);

    try {
      setIsUploadingAvatar(true);

      await API.patch(`/users/${user.id}`, formData);

      await mutate();

      toast.success("Foto profil berhasil diperbarui.");
    } catch (err) {
      setAvatarPreview(null);

      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Gagal memperbarui foto profil.",
        );
        return;
      }

      toast.error("Gagal memperbarui foto profil.");
    } finally {
      setIsUploadingAvatar(false);

      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id) {
      toast.error("Data user belum tersedia.");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      await API.delete(`/users/${user.id}/avatar`);

      setAvatarPreview(null);
      await mutate();

      toast.success("Foto profil berhasil dihapus.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Gagal menghapus foto profil.",
        );
        return;
      }

      toast.error("Gagal menghapus foto profil.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const updatePassword = async () => {
    if (!user?.id) {
      toast.error("Data user belum tersedia.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Password dan konfirmasi password wajib diisi.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      setIsSaving(true);

      await API.patch(`/users/${user.id}`, {
        password,
        confirmPassword,
      });

      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);

      await mutate();

      toast.success("Password berhasil diperbarui.", {
        description: "Silakan gunakan password baru saat login berikutnya.",
      });
    } catch (err) {
      console.error("Gagal update password:", err);

      toast.error("Gagal memperbarui password.", {
        description: "Pastikan sesi login masih valid, lalu coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setDraft({
      nama: displayName,
      email: displayEmail,
      notelp: displayPhone,
    });
    setIsEditing(true);
  };

  const cancelChanges = () => {
    setDraft({ nama: "", email: "", notelp: "" });
    setIsEditing(false);
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      await API.patch(`/users/${user?.id}`, {
        nama: draft.nama,
        email: draft.email,
        notelp: draft.notelp,
      });
      await mutate();
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const inputValue = (key: keyof ProfileDraft) => {
    if (isEditing) return draft[key];

    const values: ProfileDraft = {
      nama: displayName,
      email: displayEmail,
      notelp: displayPhone,
    };

    return values[key];
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="w-full max-w-[900px] mx-auto flex flex-col gap-5">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Pengaturan Akun
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola pengaturan akun Anda.
            </p>
          </div>

          {isLoading && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
              Loading account data...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-600">
              Gagal mengambil data user. Pastikan cookie login masih valid.
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-5">Foto Profil</h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar nama={displayName || "User"} src={displayAvatar} />

              <div className="flex flex-wrap gap-2">
                <label className="h-10 flex cursor-pointer items-center gap-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <Upload size={14} />
                  {isUploadingAvatar ? "Uploading..." : "Upload"}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    hidden
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                </label>

                <button
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar}
                  className="h-10 flex items-center gap-2 px-4 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Informasi Dasar</h3>

              <button
                onClick={isEditing ? cancelChanges : startEditing}
                disabled={isLoading || !user}
                className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Pencil size={13} />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Name
                </label>

                <Input
                  type="text"
                  value={inputValue("nama")}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  disabled={!isEditing}
                  placeholder="Nama belum tersedia"
                  className="h-11 w-full border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white disabled:bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Email Address
                  </label>

                  <Input
                    type="email"
                    value={inputValue("email")}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="Email belum tersedia"
                    className="h-11 w-full border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white disabled:bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Phone Number
                  </label>

                  <Input
                    type="tel"
                    value={inputValue("notelp")}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        notelp: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="Nomor telepon belum tersedia"
                    className="h-11 w-full border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white disabled:bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-5">Password Akun</h3>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 md:items-end">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Password Baru
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="h-11 w-full border border-gray-200 rounded-lg px-3 pr-9 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Konfirmasi Password
                </label>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="h-11 w-full border border-gray-200 rounded-lg px-3 pr-9 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={updatePassword}
                disabled={isSaving || !password || !confirmPassword}
                className="h-11 px-5 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:bg-gray-200"
              >
                {isSaving ? "Memperbarui..." : "Perbarui Password"}
              </button>
            </div>

            {confirmPassword && password !== confirmPassword && (
              <p className="mt-3 text-xs text-red-500">
                Password dan konfirmasi password tidak sama.
              </p>
            )}
          </div>
          {/* Button bawah */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-1 pb-8">
            <button
              onClick={cancelChanges}
              disabled={!isEditing || isSaving}
              className="h-10 px-5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Batal
            </button>

            <button
              onClick={saveProfile}
              disabled={!isEditing || isSaving}
              className="h-10 px-6 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
