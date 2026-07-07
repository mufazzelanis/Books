import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getPageContent } from '../data/pageContent';

const ContentViewer = ({ pageId, onClose }) => {
  const page = getPageContent(pageId);

  useEffect(() => {
    if (page) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = '' };
  }, [page]);

  if (!page) return null;

  const PageIcon = page.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]"
        >
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center">
                <PageIcon className={`w-5 h-5 ${page.iconColor}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{page.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-8" style={{ maxHeight: "calc(85vh - 80px)" }}>
            {page.sections.map((section, i) => (
              <motion.div
                key={section.heading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {section.heading}
                </h3>

                {section.type === "links" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.links.map((link) => {
                      const LinkIcon = link.icon;
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(e) => {
                            const path = link.href.replace("/", "");
                            const contentIds = ["privacy", "terms", "sitemap", "help", "contact"];
                            const exploreIds = ["best-sellers", "new-releases", "trending", "categories"];
                            if (contentIds.includes(path) || exploreIds.includes(path)) {
                              e.preventDefault();
                              onClose();
                              setTimeout(() => window.dispatchEvent(
                                new CustomEvent("openContent", { detail: path })
                              ), 100);
                            }
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-cyan-400/30 hover:bg-gray-800/50 transition-all duration-300 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center flex-shrink-0">
                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 transition-colors" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-200 group-hover:text-cyan-300 transition-colors">
                              {link.label}
                            </span>
                            <p className="text-xs text-gray-500">{link.description}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : section.type === "faq" ? (
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <details key={idx} className="group bg-gray-800/20 border border-gray-700/30 rounded-xl overflow-hidden">
                        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium text-gray-200 hover:text-cyan-300 transition-colors list-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          {item.q}
                          <span className="ml-auto text-gray-600 group-open:rotate-180 transition-transform">▾</span>
                        </summary>
                        <div className="px-4 pb-3 pt-1 text-sm text-gray-400 leading-relaxed border-t border-gray-800/50">
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : section.type === "contact" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-rose-400/30 hover:bg-gray-800/50 transition-all duration-300 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center flex-shrink-0">
                            <ItemIcon className="w-4 h-4 text-gray-400 group-hover:text-rose-300 transition-colors" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-200 group-hover:text-rose-300 transition-colors">{item.label}</span>
                            <p className="text-xs text-gray-500">{item.value}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {section.content}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ContentViewer