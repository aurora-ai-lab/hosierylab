export type LengthClass =
  | "footie"
  | "ankle"
  | "crew"
  | "mid_calf"
  | "knee_high"
  | "over_the_knee"
  | "thigh_high"
  | "waist"
  | "full_body";

export type HosieryItem = {
  code: string;
  slug: string;
  name: string;
  origin: "real_sku" | "standard_variant";
  isSynthetic: boolean;
  brand?: string;
  lengthClass: LengthClass;
  lengthLabel: string;
  coverage: string;
  topPosition: string;
  garmentType: string;
  foot: string;
  toe: string;
  heel: string;
  topBand: string;
  support: string;
  denier: number | null;
  opacity: string;
  colorFamily: string;
  colorLabel: string;
  hex: string;
  material: string[];
  finish: string;
  knit: string;
  motif: string;
  season: string[];
  occasion: string[];
  style: string[];
  visualEffect: string[];
  description: string;
  visualNotes: string;
  history: string;
  confidence: "high" | "medium" | "low";
  sourceType: string;
};

export const hosiery: HosieryItem[] = [
  {
    code: "HL-000001", slug: "standard-08d-sheer-black-pantyhose", name: "08D Sheer Black Pantyhose", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Pantyhose / Tights", coverage: "Toe → Natural Waist", topPosition: "Natural Waist", garmentType: "Pantyhose / Tights", foot: "Full Foot", toe: "Sheer Toe", heel: "Formed Heel", topBand: "Comfort Wide", support: "Waistband", denier: 8, opacity: "Ultra Sheer", colorFamily: "Black", colorLabel: "Jet Black", hex: "#171719", material: ["Nylon / Polyamide", "Elastane"], finish: "Semi-matte", knit: "Plain", motif: "None", season: ["Spring", "Summer"], occasion: ["Everyday", "Formal"], style: ["Classic", "Minimal"], visualEffect: ["Skin-blurring", "Leg-lengthening"], description: "A barely-there black reference for comparing the lightest end of the sheer spectrum.", visualNotes: "Skin remains visible; warm light can make the same surface read slightly more transparent.", history: "Synthetic sheer hosiery made fine-gauge knitting commercially practical.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000002", slug: "standard-15d-natural-sheer-pantyhose", name: "15D Natural Sheer Pantyhose", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Pantyhose / Tights", coverage: "Toe → Natural Waist", topPosition: "Natural Waist", garmentType: "Pantyhose / Tights", foot: "Full Foot", toe: "Sheer Toe", heel: "Formed Heel", topBand: "Plain", support: "Waistband", denier: 15, opacity: "Sheer", colorFamily: "Skin tones", colorLabel: "Natural", hex: "#a8755d", material: ["Nylon / Polyamide", "Elastane"], finish: "Matte", knit: "Plain", motif: "None", season: ["Spring", "Summer"], occasion: ["Office", "Formal"], style: ["Classic"], visualEffect: ["Skin-blurring"], description: "A neutral 15D reference designed to show how color and Denier work together.", visualNotes: "The color family changes perceived opacity as much as the number on the label.", history: "Skin-tone hosiery sits at the intersection of material engineering and color naming.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000003", slug: "standard-20d-smoke-black-thigh-high", name: "20D Smoke Black Thigh High", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "thigh_high", lengthLabel: "Thigh High", coverage: "Toe → Upper Thigh", topPosition: "Upper Thigh", garmentType: "Stay-ups", foot: "Full Foot", toe: "Sheer Toe", heel: "Formed Heel", topBand: "Silicone Stay-up Band", support: "Silicone Grip", denier: 20, opacity: "Sheer", colorFamily: "Black", colorLabel: "Smoke Black", hex: "#343439", material: ["Nylon / Polyamide", "Elastane"], finish: "Satin", knit: "Plain", motif: "None", season: ["All-season"], occasion: ["Everyday", "Party"], style: ["Classic", "Lingerie"], visualEffect: ["Sheen", "Leg-lengthening"], description: "A thigh-high reference where the upper edge and support system are as visible as the sheer leg.", visualNotes: "The silicone band is a structural detail; do not render a garter strap unless one is present.", history: "Stay-up construction separated upper-thigh coverage from a full waist garment.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000004", slug: "standard-20d-seamed-stockings", name: "20D Fully Fashioned Seamed Stockings", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "thigh_high", lengthLabel: "Stockings", coverage: "Toe → Upper Thigh", topPosition: "Upper Thigh", garmentType: "Stockings", foot: "Full Foot", toe: "Reinforced Toe", heel: "Formed + Cuban Heel", topBand: "Plain Welt", support: "Suspender", denier: 20, opacity: "Sheer", colorFamily: "Black", colorLabel: "Deep Black", hex: "#0f0f11", material: ["Nylon / Polyamide"], finish: "Semi-matte", knit: "Fully Fashioned", motif: "None", season: ["All-season"], occasion: ["Formal", "Editorial"], style: ["Vintage", "Classic"], visualEffect: ["Graphic Contrast"], description: "A structured stocking reference with a centered back seam and a defined Cuban heel.", visualNotes: "The back seam should remain centered and continuous from welt to heel.", history: "Fully fashioned construction and seamed heels are key visual markers in stocking history.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000005", slug: "standard-40d-charcoal-knee-high", name: "40D Charcoal Knee High", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "knee_high", lengthLabel: "Knee High", coverage: "Toe → Below Knee", topPosition: "Below Knee", garmentType: "Knee Highs", foot: "Full Foot", toe: "Reinforced Toe", heel: "Tube", topBand: "Comfort Wide", support: "Elastic Welt", denier: 40, opacity: "Semi-opaque", colorFamily: "Grey", colorLabel: "Charcoal", hex: "#414246", material: ["Nylon / Polyamide", "Elastane"], finish: "Matte", knit: "Ribbed", motif: "None", season: ["Autumn", "Winter"], occasion: ["Everyday", "Office"], style: ["Minimal", "Classic"], visualEffect: ["Texture"], description: "A knee-high reference with enough body to show rib texture without becoming fully opaque.", visualNotes: "The rib scale is deliberately regular for controlled comparison.", history: "Knee highs offer a compact construction for lower-leg coverage.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000006", slug: "standard-60d-burgundy-ribbed-tights", name: "60D Burgundy Ribbed Tights", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Pantyhose / Tights", coverage: "Toe → High Waist", topPosition: "High Waist", garmentType: "Pantyhose / Tights", foot: "Full Foot", toe: "Reinforced Toe", heel: "Tube", topBand: "Comfort Wide", support: "Waistband", denier: 60, opacity: "Opaque", colorFamily: "Burgundy", colorLabel: "Burgundy", hex: "#651f32", material: ["Nylon / Polyamide", "Elastane"], finish: "Matte", knit: "Ribbed", motif: "None", season: ["Autumn", "Winter"], occasion: ["Everyday", "Party"], style: ["Romantic", "Vintage"], visualEffect: ["Texture", "Statement"], description: "A dense ribbed reference for comparing color depth and surface texture at 60D.", visualNotes: "Dark colors read denser under cool light; the rib remains the primary visual signal.", history: "Opaque tights broadened the role of hosiery as a visible color and texture layer.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000007", slug: "standard-80d-fleece-lined-faux-sheer-tights", name: "80D Faux-Sheer Fleece-lined Tights", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Pantyhose / Tights", coverage: "Toe → Natural Waist", topPosition: "Natural Waist", garmentType: "Pantyhose / Tights", foot: "Full Foot", toe: "Reinforced Toe", heel: "Tube", topBand: "Control Top", support: "Waistband", denier: 80, opacity: "Opaque", colorFamily: "Skin tones", colorLabel: "Honey", hex: "#a76f4e", material: ["Nylon / Polyamide", "Elastane"], finish: "Semi-matte", knit: "Plain", motif: "None", season: ["Winter"], occasion: ["Everyday", "Outdoor"], style: ["Minimal"], visualEffect: ["Skin-blurring", "Sculpting"], description: "A winter-weight reference with a brushed interior and a translucent-looking outer layer.", visualNotes: "The visual effect is a construction effect; the underlying garment remains opaque.", history: "Brushed linings extend fine-gauge hosiery into colder-weather use.", confidence: "medium", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000008", slug: "standard-fishnet-open-structure-black", name: "Open-Structure Black Fishnet", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Pantyhose / Tights", coverage: "Toe → Natural Waist", topPosition: "Natural Waist", garmentType: "Pantyhose / Tights", foot: "Full Foot", toe: "Reinforced Toe", heel: "Tube", topBand: "Plain", support: "Waistband", denier: null, opacity: "Open Structure", colorFamily: "Black", colorLabel: "Jet Black", hex: "#111112", material: ["Nylon / Polyamide", "Elastane"], finish: "Matte", knit: "Fishnet", motif: "None", season: ["All-season"], occasion: ["Party", "Editorial"], style: ["Punk", "Street"], visualEffect: ["Graphic Contrast", "Texture"], description: "An open-structure reference where mesh geometry replaces the usual Denier scale.", visualNotes: "Do not assign a numeric Denier when the open structure is the defining construction.", history: "Fishnet separates visual openness from the linear Denier spectrum.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000009", slug: "standard-footless-100d-graphite-tights", name: "100D Graphite Footless Tights", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Footless Tights", coverage: "Ankle → High Waist", topPosition: "High Waist", garmentType: "Footless Tights", foot: "Footless", toe: "Not Applicable", heel: "Not Applicable", topBand: "Control Top", support: "Waistband", denier: 100, opacity: "Heavy Opaque", colorFamily: "Grey", colorLabel: "Graphite", hex: "#2f3134", material: ["Nylon / Polyamide", "Elastane"], finish: "Matte", knit: "Plain", motif: "None", season: ["Autumn", "Winter"], occasion: ["Everyday", "Performance"], style: ["Minimal", "Sporty"], visualEffect: ["Sculpting"], description: "A dense footless reference that makes the foot boundary explicit.", visualNotes: "No fabric should appear over the foot; the lower edge ends at the ankle.", history: "Footless tights move hosiery from a closed foot covering toward layering.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000010", slug: "standard-stirrup-40d-navy-tights", name: "40D Navy Stirrup Tights", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "waist", lengthLabel: "Stirrup Tights", coverage: "Arch → Natural Waist", topPosition: "Natural Waist", garmentType: "Stirrup Tights", foot: "Stirrup", toe: "Not Applicable", heel: "Not Applicable", topBand: "Plain", support: "Waistband", denier: 40, opacity: "Semi-opaque", colorFamily: "Navy", colorLabel: "Navy", hex: "#1e2b4c", material: ["Nylon / Polyamide", "Elastane"], finish: "Semi-matte", knit: "Plain", motif: "None", season: ["Autumn", "Winter"], occasion: ["Everyday", "Performance"], style: ["Sporty", "Classic"], visualEffect: ["Leg-lengthening"], description: "A stirrup construction that anchors the lower edge under the arch while leaving the toes open.", visualNotes: "The stirrup strap is visible beneath the arch; do not render a full foot.", history: "Stirrup structures keep a close leg line while separating the foot from the main leg panel.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000011", slug: "standard-ankle-20d-cream-socks", name: "20D Cream Ankle Socks", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "ankle", lengthLabel: "Ankle", coverage: "Toe → Ankle", topPosition: "Ankle", garmentType: "Socks", foot: "Full Foot", toe: "Seamless", heel: "Tube", topBand: "Cut Edge", support: "Elastic Welt", denier: 20, opacity: "Sheer", colorFamily: "Cream", colorLabel: "Cream", hex: "#e8dcc8", material: ["Nylon / Polyamide", "Elastane"], finish: "Matte", knit: "Plain", motif: "None", season: ["Spring", "Summer"], occasion: ["Everyday"], style: ["Minimal", "Romantic"], visualEffect: ["Layering"], description: "A short ankle reference for comparing how the same fine gauge behaves when coverage stops at the ankle.", visualNotes: "The top edge is the defining landmark; the rest of the foot remains fully covered.", history: "Short hosiery forms create a compact baseline for length comparisons.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
  {
    code: "HL-000012", slug: "standard-bodystocking-30d-black", name: "30D Black Bodystocking", origin: "standard_variant", isSynthetic: true, brand: "HosieryLab Standard",
    lengthClass: "full_body", lengthLabel: "Body / Suspender Tights", coverage: "Toe → Shoulder", topPosition: "Shoulder", garmentType: "Bodystocking", foot: "Full Foot", toe: "Sheer Toe", heel: "Tube", topBand: "Body Straps", support: "Body Straps", denier: 30, opacity: "Semi-sheer", colorFamily: "Black", colorLabel: "Deep Black", hex: "#141416", material: ["Nylon / Polyamide", "Elastane"], finish: "Glossy", knit: "Mesh", motif: "None", season: ["All-season"], occasion: ["Editorial", "Performance"], style: ["Avant-garde", "Lingerie"], visualEffect: ["Layering", "Sheen"], description: "A full-body reference that demonstrates why construction must remain separate from length naming.", visualNotes: "The shoulder and body straps are structural; do not collapse this into Pantyhose/Tights.", history: "Bodystocking construction extends hosiery into a continuous body layer.", confidence: "high", sourceType: "hosierylab_standard_variant"
  },
];

export const lengthFilters = [
  ["all", "All lengths"], ["footie", "Footie / No-show"], ["ankle", "Ankle"], ["crew", "Crew"], ["mid_calf", "Mid-Calf"], ["knee_high", "Knee High"], ["over_the_knee", "Over-the-Knee"], ["thigh_high", "Thigh High"], ["waist", "Pantyhose / Tights"], ["full_body", "Body / Suspender"],
] as const;

export const getHosiery = (slug: string) => hosiery.find((item) => item.slug === slug || item.code.toLowerCase() === slug.toLowerCase());
