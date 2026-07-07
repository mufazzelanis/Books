import {
  BookOpenIcon, SparklesIcon, FireIcon, ClockIcon, QueueListIcon,
  QuestionMarkCircleIcon, EnvelopeIcon, ShieldCheckIcon, DocumentTextIcon,
  CodeBracketIcon, GlobeAltIcon, ChatBubbleLeftRightIcon, AtSymbolIcon
} from "@heroicons/react/24/outline";

export const footerSections = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { label: "Best Sellers", href: "/best-sellers", icon: FireIcon, description: "Top-rated books this week", contentId: "best-sellers" },
      { label: "New Releases", href: "/new-releases", icon: SparklesIcon, description: "Latest books added", contentId: "new-releases" },
      { label: "Trending Now", href: "/trending", icon: ClockIcon, description: "What everyone is reading", contentId: "trending" },
      { label: "All Categories", href: "/categories", icon: QueueListIcon, description: "Browse by genre", contentId: "categories" },
    ]
  },
  {
    id: "support",
    title: "Support",
    links: [
      { label: "Help Center", href: "/help", icon: QuestionMarkCircleIcon, description: "FAQs and guides", contentId: "help" },
      { label: "Contact Us", href: "/contact", icon: EnvelopeIcon, description: "Get in touch with us", contentId: "contact" },
      { label: "Privacy Policy", href: "/privacy", icon: ShieldCheckIcon, description: "How we handle data", contentId: "privacy" },
      { label: "Terms of Service", href: "/terms", icon: DocumentTextIcon, description: "Terms & conditions", contentId: "terms" },
    ]
  },
  {
    id: "connect",
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/mufazzelanis", icon: CodeBracketIcon, description: "View source code" },
      { label: "Facebook", href: "https://www.facebook.com/hittechpro", icon: GlobeAltIcon, description: "Follow for updates" },
      { label: "YouTube", href: "https://www.youtube.com/watch?v=g6JIdwtMvUA&t=58s", icon: ChatBubbleLeftRightIcon, description: "Join the community" },
      { label: "Email", href: "mufazzelanis@gmail.com", icon: AtSymbolIcon, description: "Drop us a line" },
    ]
  }
];

export const brandData = {
  name: "BOOKSHOW",
  tagline: "Discover your next favorite read. Explore thousands of books with dynamic previews and immersive interactions.",
  icon: BookOpenIcon,
  gradient: "from-cyan-400 via-blue-400 to-purple-400",
  iconColor: "text-cyan-400"
};

export const bottomBar = {
  copyright: `© BOOKSHOW. All rights reserved.`,
  poweredBy: "Powered by HiT Tech Pro",
  links: [
    { label: "Privacy", href: "/privacy", contentId: "privacy" },
    { label: "Terms", href: "/terms", contentId: "terms" },
    { label: "Sitemap", href: "/sitemap", contentId: "sitemap" },
  ]
};
