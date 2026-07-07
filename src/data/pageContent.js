import {
  ShieldCheckIcon, DocumentTextIcon, MapIcon,
  QuestionMarkCircleIcon, EnvelopeIcon, FireIcon,
  SparklesIcon, ClockIcon, QueueListIcon,
  ChatBubbleLeftRightIcon, GlobeAltIcon, CodeBracketIcon
} from "@heroicons/react/24/outline";

export const pages = {
  "privacy": {
    id: "privacy",
    title: "Privacy Policy",
    icon: ShieldCheckIcon,
    iconColor: "text-cyan-400",
    sections: [
      {
        heading: "Information We Collect",
        content: "We collect information you provide directly, such as your name and email address when you contact us. We also collect data on how you interact with our service, including search queries and book preferences, to improve your experience."
      },
      {
        heading: "How We Use Your Information",
        content: "Your information is used to personalize your experience, improve our website, process your requests, and send periodic emails regarding updates or promotional offers. We do not sell your personal information to third parties."
      },
      {
        heading: "Data Security",
        content: "We implement a variety of security measures to maintain the safety of your personal information. All sensitive data is encrypted using industry-standard SSL technology and stored on secure servers."
      },
      {
        heading: "Cookies",
        content: "We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction. You can choose to disable cookies in your browser settings."
      },
      {
        heading: "Third-Party Services",
        content: "We use the Google Books API to provide book data. Google's use of your information is governed by their privacy policy. We recommend reviewing Google's privacy policy for more information."
      },
      {
        heading: "Contact Us",
        content: "If you have any questions about this privacy policy, please contact us at privacy@bookshow.com or through our Contact page."
      }
    ]
  },
  "terms": {
    id: "terms",
    title: "Terms of Service",
    icon: DocumentTextIcon,
    iconColor: "text-purple-400",
    sections: [
      {
        heading: "Acceptance of Terms",
        content: "By accessing and using BOOKSHOW, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service."
      },
      {
        heading: "Use of Service",
        content: "You agree to use BOOKSHOW for lawful purposes only. You must not use the service to violate any laws, infringe on intellectual property rights, or distribute malicious content. We reserve the right to terminate access for violations."
      },
      {
        heading: "Intellectual Property",
        content: "The content, layout, design, data, and graphics on this website are protected by intellectual property laws. Book data is provided by Google Books API and is subject to their terms. You may not reproduce, distribute, or create derivative works without permission."
      },
      {
        heading: "User Responsibilities",
        content: "Users are responsible for maintaining the confidentiality of their account information. You agree to provide accurate information and to update it as necessary. Any misuse of the service may result in immediate termination."
      },
      {
        heading: "Limitation of Liability",
        content: "BOOKSHOW shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. We provide the service 'as is' without any warranty."
      },
      {
        heading: "Changes to Terms",
        content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the new terms."
      }
    ]
  },
  "sitemap": {
    id: "sitemap",
    title: "Sitemap",
    icon: MapIcon,
    iconColor: "text-emerald-400",
    sections: [
      {
        heading: "Browse Books",
        type: "links",
        links: [
          { label: "Best Sellers", icon: FireIcon, href: "/best-sellers", description: "Top-rated books this week" },
          { label: "New Releases", icon: SparklesIcon, href: "/new-releases", description: "Latest books added" },
          { label: "Trending Now", icon: ClockIcon, href: "/trending", description: "What everyone is reading" },
          { label: "All Categories", icon: QueueListIcon, href: "/categories", description: "Browse by genre" },
        ]
      },
      {
        heading: "Support & Information",
        type: "links",
        links: [
          { label: "Help Center", icon: QuestionMarkCircleIcon, href: "/help", description: "FAQs and guides" },
          { label: "Contact Us", icon: EnvelopeIcon, href: "/contact", description: "Get in touch" },
          { label: "Privacy Policy", icon: ShieldCheckIcon, href: "/privacy", description: "How we handle data" },
          { label: "Terms of Service", icon: DocumentTextIcon, href: "/terms", description: "Terms & conditions" },
        ]
      }
    ]
  },
  "help": {
    id: "help",
    title: "Help Center",
    icon: QuestionMarkCircleIcon,
    iconColor: "text-amber-400",
    sections: [
      {
        heading: "How to Search for Books",
        content: "Use the search bar at the top of the page to find books by title, author, or keyword. You can also browse categories like Best Sellers, New Releases, and Trending to discover popular reads."
      },
      {
        heading: "Understanding Search Results",
        content: "Each book card shows the cover image, title, author, rating, category, and page count. Click on any card to view more details on Google Books. Use the pagination at the bottom to browse through results."
      },
      {
        heading: "Frequently Asked Questions",
        type: "faq",
        items: [
          { q: "Is BOOKSHOW free to use?", a: "Yes, BOOKSHOW is completely free. We use the Google Books API to provide book information." },
          { q: "Can I read books on BOOKSHOW?", a: "BOOKSHOW helps you discover books. Clicking a book takes you to Google Books where you can preview or purchase." },
          { q: "Why am I seeing different results?", a: "Search results depend on the Google Books API. Try using more specific keywords for better results." },
          { q: "How do I report an issue?", a: "Use the Contact page to report any bugs or issues you encounter." }
        ]
      },
      {
        heading: "Tips for Better Search",
        content: "Use specific book titles or author names for precise results. Try filters like 'fiction', 'science', or 'history' to narrow down categories. Use the search bar regularly to find new recommendations."
      }
    ]
  },
  "contact": {
    id: "contact",
    title: "Contact Us",
    icon: EnvelopeIcon,
    iconColor: "text-rose-400",
    sections: [
      {
        heading: "Get in Touch",
        content: "We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out through any of the channels below."
      },
      {
        heading: "Contact Information",
        type: "contact",
        items: [
          { icon: EnvelopeIcon, label: "Email", value: "hello@bookshow.com", href: "mufazzelanis@gmail.com" },
          { icon: ChatBubbleLeftRightIcon, label: "Facebook", value: "Join our Facebook", href: "https://www.facebook.com/hittechpro" },
          { icon: GlobeAltIcon, label: "YouTube", value: "Subscribe to our channel", href: "https://www.youtube.com/watch?v=g6JIdwtMvUA&t=58s" },
          { icon: CodeBracketIcon, label: "GitHub", value: "github.com/bookshow", href: "https://github.com/mufazzelanis" },
        ]
      },
      {
        heading: "Response Time",
        content: "We typically respond within 24-48 hours during business days. For urgent matters, reaching out on Discord or Twitter may get you a faster response."
      }
    ]
  }
};

export const getPageContent = (pageId) => pages[pageId] || null;
