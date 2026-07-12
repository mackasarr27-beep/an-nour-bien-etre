declare module "*.png";
declare module "*.svg";

interface SiteConfig {
  title: string;
}

declare global {
  var siteConfig: SiteConfig | undefined;
}

export {};
