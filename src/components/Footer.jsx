import { useState } from 'react'
import FloatingParticle from './FloatingParticle';
import { footerSections, brandData, bottomBar } from '../data/footerData';
import { useSettings } from '../context/SettingsContext';

const Footer = ({ onContentClick }) => {
  const { t } = useSettings();
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState(null);
  const BrandIcon = brandData.icon;

  const handleClick = (e, link) => {
    if (link.contentId && onContentClick) {
      e.preventDefault();
      onContentClick(link.contentId);
    }
  };

  return (
    <footer className="relative bg-gray-950 border-t border-gray-800/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-blue-900/10" />
      <FloatingParticle />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className={`text-xl font-bold bg-gradient-to-r ${brandData.gradient} bg-clip-text text-transparent mb-4 flex items-center gap-2`}>
              <BrandIcon className={`w-6 h-6 ${brandData.iconColor}`} />
              {brandData.name}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              {footerSections.find(s => s.id === "connect")?.links.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-gray-800 transition-all duration-300"
                  title={link.description}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.id}>
              <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">
                {t(`footer.${section.id}`)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const LinkIcon = link.icon;
                  const isHovered = hoveredLink === `${section.id}-${link.label}`;
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") && !link.contentId ? "_blank" : undefined}
                        rel={link.href.startsWith("http") && !link.contentId ? "noopener noreferrer" : undefined}
                        onMouseEnter={() => setHoveredLink(`${section.id}-${link.label}`)}
                        onMouseLeave={() => setHoveredLink(null)}
                        onClick={(e) => handleClick(e, link)}
                        className="group flex items-start gap-2 text-gray-400 hover:text-cyan-300 text-sm transition-all duration-300"
                      >
                        <LinkIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-all duration-300 ${isHovered ? 'text-cyan-300 rotate-12' : ''}`} />
                        <div>
                          <span className="block transition-colors duration-300 group-hover:text-cyan-300">
                            {link.label}
                          </span>
                          <span className={`block text-xs transition-all duration-300 ${isHovered ? 'text-cyan-400/60 max-h-10' : 'text-gray-600 max-h-0'} overflow-hidden`}>
                            {link.description}
                          </span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {currentYear} {bottomBar.copyright}
            </p>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-gray-700">|</span>
              {bottomBar.links.map((link, i) => (
                <>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link)}
                    className="text-gray-500 hover:text-cyan-300 text-xs transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                  {i < bottomBar.links.length - 1 && <span className="text-gray-700">·</span>}
                </>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-xs">
            {t('footer.poweredBy')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer