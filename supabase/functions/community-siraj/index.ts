// community-siraj — Insert an AI reply from "Siraj" as a comment when
// a user @mentions him in a community post. Uses service role to bypass
// the RLS policy that forbids clients from inserting is_ai=true rows.
// deploy-tag: v5

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "google/gemini-2.5-flash";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const supaUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!apiKey || !supaUrl || !serviceKey) {
      console.error("missing_env", { hasApi: !!apiKey, hasUrl: !!supaUrl, hasSvc: !!serviceKey });
      return json({ error: "missing_env" }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const { post_id, prompt_text, author_name } = body ?? {};
    if (!post_id || !prompt_text) return json({ error: "post_id & prompt_text required" }, 400);

    const system = `أنت "سراج" — معلّم الذكاء الاصطناعي في منصّة لُغة لتعليم العربية.
أُشير إليك للتّو داخل منشور في المجتمع من الطالب "${author_name || "طالب"}".
- ردّ بالعربية الفصحى، بأسلوب ودود ومشجّع.
- إن كان هناك خطأ لغويّ صحّحه بلطف واذكر القاعدة باختصار.
- إن كان سؤالاً، أجب بوضوح مع مثال.
- ردّك يظهر كتعليق عام على المنشور، فاجعله موجزاً (٣-٦ أسطر كحد أقصى) وممتعاً.
- استخدم رمزاً تعبيرياً واحداً على الأكثر في نهاية الرد.`;

    let reply = "أهلاً! أنا هنا. أعد صياغة سؤالك من فضلك 🌙";
    try {
      const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.85,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt_text },
          ],
        }),
      });
      if (!upstream.ok) {
        const errText = await upstream.text().catch(() => "");
        console.error("ai_gateway_error", upstream.status, errText);
        if (upstream.status === 429) return json({ error: "rate_limited" }, 429);
        if (upstream.status === 402) return json({ error: "credits_exhausted" }, 402);
      } else {
        const data = await upstream.json();
        reply = data?.choices?.[0]?.message?.content?.trim() || reply;
      }
    } catch (e) {
      console.error("ai_gateway_exception", e);
    }

    const supa = createClient(supaUrl, serviceKey);
    const { data: inserted, error } = await supa
      .from("community_comments")
      .insert({
        post_id,
        user_id: null,
        content: reply,
        is_ai: true,
        ai_name: "سراج",
      })
      .select()
      .single();
    if (error) {
      console.error("insert_error", error);
      return json({ error: error.message }, 500);
    }

    return json({ ok: true, comment: inserted });
  } catch (e) {
    console.error("fatal", e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
