import { useEffect, useState } from "react";
import { content, type AiPersona } from "@/lib/siteContent";

export const useAiPersona = (): AiPersona => {
  const [persona, setPersona] = useState<AiPersona>(() => content.getAll().settings.aiPersona);
  useEffect(() => {
    const h = () => setPersona(content.getAll().settings.aiPersona);
    window.addEventListener("lugha:content-updated", h);
    return () => window.removeEventListener("lugha:content-updated", h);
  }, []);
  return persona;
};
