import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  if (!process.env.MERIDIAN_BASE_URL) return;
  pi.registerProvider("anthropic", {
    baseUrl: process.env.MERIDIAN_BASE_URL,
  });
}
