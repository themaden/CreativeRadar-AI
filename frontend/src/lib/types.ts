export interface DominantColor {
  hex: string;
  hsl: string;
  name: string;
  weight: number;
}

export interface StoryboardScene {
  timestamp: string;
  phase: string;
  description: string;
  colors: string[];
  pacing_note: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface OCRText {
  timestamp: number;
  text: string;
}

export interface AdAnalysis {
  id: string;
  ad_id: string;
  hook_type: string;
  hook_score: number;
  dominant_colors: DominantColor[];
  storyboard_breakdown: StoryboardScene[];
  transcript: TranscriptSegment[];
  ocr_texts: OCRText[];
  strategic_summary: string;
  cta_text: string;
  analyzed_at: string;
}

export interface Brand {
  id: string;
  name: string;
  genre: string;
  logo_url?: string;
  created_at: string;
}

export interface Ad {
  id: string;
  brand: Brand;
  platform: string;
  external_ad_id?: string;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  first_seen: string;
  last_seen: string;
  estimated_impressions: number;
  status: string;
  created_at: string;
  analysis?: AdAnalysis;
}

export interface HookTypeTrend {
  hook_type: string;
  count: number;
  share_percentage: number;
}

export interface ColorPaletteTrend {
  hex: string;
  name: string;
  frequency: number;
}

export interface BrandSpendShare {
  brand_name: string;
  estimated_total_impressions: number;
  market_share: number;
}

export interface AnalyticsTrends {
  total_ads_analyzed: number;
  top_hook_types: HookTypeTrend[];
  dominant_color_palettes: ColorPaletteTrend[];
  brand_market_share: BrandSpendShare[];
}

export interface CreativeConcept {
  title: string;
  target_hook: string;
  color_palette: string[];
  scene_script: string;
  why_it_works: string;
}

export interface StrategyCopilotResponse {
  query: string;
  strategic_report: string;
  recommended_concepts: CreativeConcept[];
  retrieved_ad_ids: string[];
}
