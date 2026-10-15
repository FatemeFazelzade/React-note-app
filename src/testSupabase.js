import { supabase } from "./lib/supabaseClient";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("connection_test")
    .select("message")
    .limit(1);

  if (error) {
    console.error("Supabase connection failed:", error.message);
    return;
  }

  console.log("Supabase connection successful:", data);
}
