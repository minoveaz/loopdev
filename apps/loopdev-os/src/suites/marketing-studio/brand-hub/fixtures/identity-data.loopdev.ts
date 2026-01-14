import { BrandIdentity } from '../../types';

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
    // ... same as before
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
        id: "t1",
        name: "brand.primary",
        description: "Main brand color used for primary actions and structure.",
        group: "core",
        role: "bg",
        resolvesTo: { light: "#135bec", dark: "#135bec" }
      },
      {
        id: "t2",
        name: "brand.accent",
        description: "High-energy color for AI features and highlights.",
        group: "core",
        role: "bg",
        resolvesTo: { light: "#ffcc00", dark: "#ffcc00" }
      },
      {
        id: "t3",
        name: "status.success",
        description: "Positive validation and success states.",
        group: "semantic",
        role: "status",
        resolvesTo: { light: "#10b981", dark: "#059669" }
      },
      {
        id: "t4",
        name: "status.error",
        description: "Critical errors and blocking states.",
        group: "semantic",
        role: "status",
        resolvesTo: { light: "#ef4444", dark: "#dc2626" }
      },
      {
        id: "t5",
        name: "surface.canvas",
        description: "Main page background color.",
        group: "neutral",
        role: "bg",
        resolvesTo: { light: "#f8fafc", dark: "#0d121b" }
      }
    ]
  }
};
