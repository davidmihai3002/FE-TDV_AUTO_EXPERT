export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'whatsapp';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface SiteSettingsDto {
  brandName: string;
  tagline: string;
  footerDescription: string;
  copyrightText: string;
  contact: {
    phone: string | null;
    email: string | null;
    address: string | null;
    schedule: string | null;
  };
  currency: 'RON';
  privacyUrl: string | null;
  termsUrl: string | null;
  socials: SocialLink[];
  updatedAt: string | null;
}
