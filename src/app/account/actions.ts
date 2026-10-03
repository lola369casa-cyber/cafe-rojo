"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser, serverClient } from "@/lib/supabase";

const schema = z.object({
  first_name: z.string().trim().max(80),
  last_name: z.string().trim().max(80),
  phone: z.string().trim().max(40),
  line1: z.string().trim().max(200),
  line2: z.string().trim().max(120),
  city: z.string().trim().max(80),
  state: z.string().trim().max(40),
  zip: z.string().trim().max(12),
});

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/account");
  const p = schema.parse(Object.fromEntries(formData));
  const supabase = await serverClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: p.first_name,
      last_name: p.last_name,
      phone: p.phone,
      address: { line1: p.line1, line2: p.line2, city: p.city, state: p.state, zip: p.zip, country: "US" },
    })
    .eq("id", user.id);
  if (error) throw new Error(`Could not save your details: ${error.message}`);
  revalidatePath("/account");
  redirect("/account?notice=saved");
}

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/account");
}
