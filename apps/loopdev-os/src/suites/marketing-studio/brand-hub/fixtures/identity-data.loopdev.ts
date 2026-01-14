import { BrandIdentity } from "../types";

export const LOOPDEV_IDENTITY_MOCK: BrandIdentity = {
  narrative: {
    mission: "Build the operational system that turns intent and truth into enforceable workflows.",
    vision: "A world where every team ships on-brand by default, with governance built into creation.",
    values: [
      { title: "Precision", description: "Systems over opinions." },
      { title: "Transparency", description: "Explainable rules and auditable change." },
      { title: "Velocity", description: "Fast iteration without breaking truth." },
      { title: "Craft", description: "Industrial design quality in every interaction." }
    ],
    promise: "On-brand by default. On-system by design."
  },
  voice: {
    profiles: [
      {
        id: "professional",
        name: "Professional",
        description: "Clear, precise, system-oriented.",
        examples: {
          do: ["Here is the impact of this change.", "This rule is blocked by policy."],
          dont: ["Don't worry about it.", "We are the best in the world."]
        }
      }
    ]
  },
  claims: {
    forbidden: ["unlimited", "best", "cheapest"],
    regulated: [
      {
        id: "c1",
        text: "Guaranteed results",
        severity: "block",
        reason: "Legal risk: results cannot be strictly guaranteed in variable environments.",
        jurisdiction: "Global"
      }
    ]
  },
  palette: {
    tokens: [
      {
        id: "brand-primary",
        name: "brand.primary",
        description: "LoopDev Designer Primary Blue.",
        group: "core",
        role: "bg",
        resolvesTo: { light: "#135BEC", dark: "#135BEC" }
      },
      {
        id: "brand-energy",
        name: "brand.secondary",
        description: "LoopDev Designer Energy Yellow.",
        group: "core",
        role: "bg",
        resolvesTo: { light: "#FFD025", dark: "#FFD025" }
      },
      {
        id: "brand-innovation",
        name: "brand.innovation",
        description: "LoopDev Innovation & AI Purple.",
        group: "core",
        role: "bg",
        resolvesTo: { light: "#9333EA", dark: "#a855f7" }
      },
      {
        id: "status-success",
        name: "status.success",
        description: "Positive validation state.",
        group: "semantic",
        role: "status",
        resolvesTo: { light: "#22c55e", dark: "#22c55e" }
      },
      {
        id: "status-error",
        name: "status.error",
        description: "Critical error state.",
        group: "semantic",
        role: "status",
        resolvesTo: { light: "#ef4444", dark: "#ef4444" }
      },
      {
        id: "surface-canvas",
        name: "surface.canvas",
        description: "Main environment background (Space).",
        group: "neutral",
        role: "bg",
        resolvesTo: { light: "#f8fafc", dark: "#0F1115" }
      }
    ]
  }
};