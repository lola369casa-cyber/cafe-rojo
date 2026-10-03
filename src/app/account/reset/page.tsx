import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default function ResetPage() {
  return <div className="container-x py-16 lg:py-24"><AuthForm initial="update" /></div>;
}
