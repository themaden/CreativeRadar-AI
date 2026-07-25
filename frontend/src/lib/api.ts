import { Ad, AnalyticsTrends, StrategyCopilotResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchAnalyticsTrends(): Promise<AnalyticsTrends> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/trends`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, serving high-fidelity demo trends data:", error);
    return {
      total_ads_analyzed: 142,
      top_hook_types: [
        { hook_type: "Failed Gameplay (Peril Rescue)", count: 58, share_percentage: 40.8 },
        { hook_type: "Emotional Rescue / Dilemma", count: 42, share_percentage: 29.5 },
        { hook_type: "Fake AD vs Real Gameplay", count: 24, share_percentage: 16.9 },
        { hook_type: "Live Streamer Reaction", count: 18, share_percentage: 12.8 }
      ],
      dominant_color_palettes: [
        { hex: "#FF9900", name: "Vibrant Amber", frequency: 104 },
        { hex: "#1E3A8A", name: "Royal Navy Blue", frequency: 89 },
        { hex: "#EF4444", name: "Urgency Crimson", frequency: 72 },
        { hex: "#F59E0B", name: "Gold Accent", frequency: 53 },
        { hex: "#10B981", name: "Success Emerald", frequency: 41 }
      ],
      brand_market_share: [
        { brand_name: "Royal Match (Dream Games)", estimated_total_impressions: 48500000, market_share: 42.1 },
        { brand_name: "Gardenscapes (Playrix)", estimated_total_impressions: 32100000, market_share: 27.9 },
        { brand_name: "Toon Blast (Peak Games)", estimated_total_impressions: 21400000, market_share: 18.6 },
        { brand_name: "Match Factory (Peak)", estimated_total_impressions: 13200000, market_share: 11.4 }
      ]
    };
  }
}

export async function fetchAds(brandName?: string): Promise<Ad[]> {
  try {
    const url = brandName ? `${API_BASE_URL}/ads?brand_name=${encodeURIComponent(brandName)}` : `${API_BASE_URL}/ads`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch ads');
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, serving demo ad list:", error);
    return MOCK_ADS;
  }
}

export async function fetchAdById(id: string): Promise<Ad> {
  try {
    const res = await fetch(`${API_BASE_URL}/ads/${id}`);
    if (!res.ok) throw new Error('Failed to fetch ad details');
    return await res.json();
  } catch (error) {
    console.warn(`Backend API unavailable, serving mock ad detail for ${id}:`, error);
    const found = MOCK_ADS.find(a => a.id === id);
    return found || MOCK_ADS[0];
  }
}

export async function triggerStrategyCopilot(prompt: string, targetBrand: string = "Royal Match"): Promise<StrategyCopilotResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/strategy/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, target_brand: targetBrand })
    });
    if (!res.ok) throw new Error('Failed to generate strategy copilot response');
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, serving mock copilot response:", error);
    return {
      query: prompt,
      strategic_report: `### 🎯 RAG Intelligence Report for ${targetBrand}\n\nAnalyzing **140+ competitor puzzle creatives** reveals that **Peril Rescue Hooks** coupled with high-contrast amber/blue visual palettes deliver **3.4x higher conversion efficiency** than static gameplay trailers.\n\nKey Takeaways:\n- 82% of top grossing Royal Match creatives feature King Robert in peril.\n- Average hook transition time is 1.1 seconds.\n- Failure prompts ('ONLY 1% CAN SOLVE') increase player impulse engagement by +41%.`,
      recommended_concepts: [
        {
          title: "The Boiling Lava Pin Challenge",
          target_hook: "Failed Gameplay (Peril Rescue)",
          color_palette: ["#FF9900", "#1E3A8A", "#EF4444"],
          scene_script: "00:00-00:03: King Robert over lava with yellow pins.\n00:03-00:10: Hand cursor pulls wrong pin causing lava rise.\n00:10-00:15: Character scream, pulsing free download button.",
          why_it_works: "Triggers problem-solving impulse and cognitive fix drive."
        },
        {
          title: "Frozen Castle Renovation Dilemma",
          target_hook: "Emotional Makeover",
          color_palette: ["#3B82F6", "#F59E0B", "#10B981"],
          scene_script: "00:00-00:04: Austin shivering in snowstorm room.\n00:04-00:12: Player taps wrong tool, window breaks further.\n00:12-00:18: Immediate store CTA.",
          why_it_works: "Leverages decoration satisfaction mechanics."
        }
      ],
      retrieved_ad_ids: ["ad_mock_001", "ad_mock_002"]
    };
  }
}

export const MOCK_ADS: Ad[] = [
  {
    id: "ad_mock_001",
    brand: { id: "b1", name: "Royal Match", genre: "Casual Puzzle", created_at: "2026-05-01" },
    platform: "Meta",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600",
    duration_seconds: 15.0,
    first_seen: "2026-05-10",
    last_seen: "2026-07-20",
    estimated_impressions: 14200000,
    status: "ANALYZED",
    created_at: "2026-05-10",
    analysis: {
      id: "an_001",
      ad_id: "ad_mock_001",
      hook_type: "Failed Gameplay (Peril Rescue)",
      hook_score: 9.6,
      dominant_colors: [
        { hex: "#FF9900", hsl: "hsl(36, 100%, 50%)", name: "Vibrant Amber", weight: 0.45 },
        { hex: "#1E3A8A", hsl: "hsl(224, 64%, 33%)", name: "Royal Navy Blue", weight: 0.35 },
        { hex: "#EF4444", hsl: "hsl(0, 84%, 60%)", name: "Lava Red", weight: 0.20 }
      ],
      storyboard_breakdown: [
        { timestamp: "00:00 - 00:03", phase: "Hook (0-3s)", description: "King Robert is trapped over bubbling lava with pin mechanism.", colors: ["#FF9900", "#1E3A8A"], pacing_note: "Immediate high threat visual." },
        { timestamp: "00:03 - 00:11", phase: "Gameplay (3-11s)", description: "Hand cursor selects pin #2 instead of #1, lava floods bottom tier.", colors: ["#EF4444"], pacing_note: "Intentionally flawed puzzle solve." },
        { timestamp: "00:11 - 00:15", phase: "CTA (11-15s)", description: "Pulsing gold Play Store & App Store download badges.", colors: ["#FF9900"], pacing_note: "Instant conversion prompt." }
      ],
      transcript: [
        { start: 0.0, end: 2.5, text: "Save King Robert from the fiery pit!" },
        { start: 3.0, end: 8.0, text: "Can you solve this puzzle faster than 99% of players?" },
        { start: 11.5, end: 15.0, text: "Play Royal Match for free right now!" }
      ],
      ocr_texts: [
        { timestamp: 0.5, text: "SAVE THE KING!" },
        { timestamp: 3.0, text: "ONLY 1% CAN SOLVE THIS" },
        { timestamp: 7.0, text: "FAILED!" }
      ],
      strategic_summary: "King Robert trapped over rising lava. Player pulls wrong pin first, causing humorous fail and urgency CTA.",
      cta_text: "Download & Save King Robert FREE!",
      analyzed_at: "2026-05-10"
    }
  },
  {
    id: "ad_mock_002",
    brand: { id: "b2", name: "Gardenscapes", genre: "Casual Puzzle", created_at: "2026-05-01" },
    platform: "TikTok",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
    duration_seconds: 18.0,
    first_seen: "2026-05-12",
    last_seen: "2026-07-22",
    estimated_impressions: 9800000,
    status: "ANALYZED",
    created_at: "2026-05-12",
    analysis: {
      id: "an_002",
      ad_id: "ad_mock_002",
      hook_type: "Emotional Rescue / Dilemma",
      hook_score: 8.9,
      dominant_colors: [
        { hex: "#3B82F6", hsl: "hsl(217, 91%, 60%)", name: "Freezing Cyan Blue", weight: 0.40 },
        { hex: "#F59E0B", hsl: "hsl(38, 92%, 50%)", name: "Fire Gold", weight: 0.35 },
        { hex: "#10B981", hsl: "hsl(160, 84%, 39%)", name: "Garden Leaf Emerald", weight: 0.25 }
      ],
      storyboard_breakdown: [
        { timestamp: "00:00 - 00:04", phase: "Hook (0-4s)", description: "Snowstorm outside broken window, shivering butler character.", colors: ["#3B82F6"], pacing_note: "Emotional sympathy trigger." },
        { timestamp: "00:04 - 00:13", phase: "Gameplay (4-13s)", description: "Hammer tool breaks wall further, freezing wind blows inside.", colors: ["#F59E0B"], pacing_note: "Comedy of errors mechanic." },
        { timestamp: "00:13 - 00:18", phase: "CTA (13-18s)", description: "Mansion instantly transformed to golden palace with download button.", colors: ["#10B981"], pacing_note: "Satisfying contrast resolution." }
      ],
      transcript: [
        { start: 0.0, end: 3.5, text: "Brrr! Help Austin repair the estate before nightfall!" },
        { start: 4.0, end: 10.0, text: "Choose the right tools to restore the grand fireplace!" }
      ],
      ocr_texts: [
        { timestamp: 1.0, text: "FREEZING COLD!" },
        { timestamp: 5.0, text: "CHOOSE TOOL" }
      ],
      strategic_summary: "Austin the Butler arrives at a freezing ruined mansion. Player tries to fix fireplace with cheap wood.",
      cta_text: "Fix Austin's Garden Today!",
      analyzed_at: "2026-05-12"
    }
  },
  {
    id: "ad_mock_003",
    brand: { id: "b3", name: "Toon Blast", genre: "Casual Puzzle", created_at: "2026-05-01" },
    platform: "Meta",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
    duration_seconds: 12.0,
    first_seen: "2026-05-15",
    last_seen: "2026-07-24",
    estimated_impressions: 11500000,
    status: "ANALYZED",
    created_at: "2026-05-15",
    analysis: {
      id: "an_003",
      ad_id: "ad_mock_003",
      hook_type: "Fake AD vs Real Gameplay",
      hook_score: 9.1,
      dominant_colors: [
        { hex: "#EC4899", hsl: "hsl(330, 81%, 60%)", name: "Magenta Spark", weight: 0.40 },
        { hex: "#8B5CF6", hsl: "hsl(262, 83%, 58%)", name: "Neon Violet", weight: 0.35 },
        { hex: "#F59E0B", hsl: "hsl(38, 92%, 50%)", name: "Explosive Yellow", weight: 0.25 }
      ],
      storyboard_breakdown: [
        { timestamp: "00:00 - 00:03", phase: "Hook (0-3s)", description: "Giant 10x10 cube board matching 7 pink cubes at once.", colors: ["#EC4899"], pacing_note: "Instant dopamine blast sound." },
        { timestamp: "00:03 - 00:09", phase: "Gameplay (3-9s)", description: "Rocket combo clears 3 rows simultaneously.", colors: ["#8B5CF6"], pacing_note: "Cascading particle animation." },
        { timestamp: "00:09 - 00:12", phase: "CTA (9-12s)", description: "Toon Blast logo popping up with rating badge.", colors: ["#F59E0B"], pacing_note: "Social proof endorsement." }
      ],
      transcript: [
        { start: 0.0, end: 2.5, text: "Match pink blocks to trigger ultimate rocket combo!" }
      ],
      ocr_texts: [
        { timestamp: 0.5, text: "DISCO COMBO!" }
      ],
      strategic_summary: "Fast-paced cube blasting combos creating huge disco ball explosions with vibrant primary color palette.",
      cta_text: "Blast Cubes Now!",
      analyzed_at: "2026-05-15"
    }
  }
];
