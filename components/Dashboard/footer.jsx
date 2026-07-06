import SawaflixLogo from '../SawaflixLogo';

const footer = () => {
  return (
    <div className="bg-[#0B0E14] text-gray-400 py-8 border-t border-white/5 flex flex-col items-center gap-4">
      <SawaflixLogo />
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} SawaFlix. All rights reserved.
      </p>
    </div>
  )
}

export default footer;
