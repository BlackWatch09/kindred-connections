import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const adminPw = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPw) return json({ error: "ADMIN_PASSWORD not configured" }, 500);

  const provided = req.headers.get("x-admin-password");
  if (!provided || provided !== adminPw) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return json({ tickets: data ?? [] });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { id, status } = body as { id?: string; status?: string };
      if (!id || !status) return json({ error: "id and status required" }, 400);
      const { error } = await supabase.from("support_tickets").update({ status }).eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      const { error } = await supabase.from("support_tickets").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    console.error("[admin-support] error", e);
    return json({ error: (e as Error).message }, 500);
  }
});
