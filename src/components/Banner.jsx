import { motion } from 'framer-motion'
import img from '../assets/imgbg.png'
import FloatingParticle from './FloatingParticle'
import { useSettings } from '../context/SettingsContext'

const Banner = () => {
  const { t } = useSettings();
  return (
    <div className=' min-h-screen bg-gradient-to-br from-gray-900/80 to-blue-900/20 relative overflow-hidden'>
        <div className=' container mx-auto px-4 h-screen flex items-center'>
            <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full'>
                {/* TEXT CONTENT*/}
                <div className=' lg:col-span-1 flex flex-col justify-center space-y-6'>

                    <motion.h1 initial={{opacity:0, y:20}}
                    animate ={{opacity:1, y:0}}
                    className=' text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                        {t('banner.title')}
                    </motion.h1>

                    <motion.p initial={{opacity:0}}
                    animate= {{opacity:1}}
                    transition={{ delay: 0.3}}
                    className=' text-lg text-cyan-100/80'>
                        {t('banner.subtitle')}

                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            const el = document.getElementById('hero')
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 w-fit px-9 py-4 rounded-full font-bold text-white shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_-5px_rgba(34,211,238,0.6)] transition-all duration-500 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent animate-pulse" />
                        <span className="relative flex items-center gap-3">
                            <span>{t('banner.cta')}</span>
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </span>
                    </motion.button>
                </div>
                {/*  Image Container */}

                <div className=' md:col-span-1 lg:col-span-2 h-64 sm:h-80 md:h-[600px] lg:h-[700px] relative flex items-center justify-center '>
                    <motion.div  className=' relative w-full h-full'
                        animate = {{
                            y: [0,-20,0],
                            rotateY: [0,5,0]
                        }}
                        transition={{
                            duration: 6,
                            repeat : Infinity, 
                            ease : "easeInOut"
                        }}
                    
                    >
                        <div className=' absolute inset-0 rounded-3xl backdrop-blur-xl overflow-hidden'>
                            <img src={img} alt="Book"  className=' w-full h-full object-contain p-8'/>

                        </div>

                    </motion.div>

                </div>

            </div>

        </div>
        <FloatingParticle/>
        
    </div>
  )
}

export default Banner