import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Github, Mail, Phone, MapPin, Dribbble, Smartphone, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

/**
 * Premium Dark Portfolio - Full-Stack with File Storage
 * 
 * Design System:
 * - Mobile-first compact layout
 * - 3x2 icon grid on mobile with animated hover effects
 * - Organic services tag layout
 * - Real app icons with brand colors
 * - Animated icon treatments
 * - Desktop: 2-column asymmetric grid
 * - File upload functionality for portfolio projects
 */

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [cursorVisible, setCursorVisible] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "text-gray-400", animationType: "float" },
    { icon: Dribbble, href: "#", label: "Dribbble", color: "text-pink-400", animationType: "glow" },
    { icon: MapPin, href: "#", label: "Location", color: "text-gray-400", animationType: "scale" },
    { icon: Mail, href: "#", label: "Email", color: "text-gray-400", animationType: "float" },
    { icon: Smartphone, href: "#", label: "Phone", color: "text-gray-400", animationType: "scale" },
    { icon: Github, href: "#", label: "More", color: "text-gray-400", animationType: "glow" },
  ];

  const services = [
    "SVG Icons",
    "3D Design",
    "Frontend",
    "Branding",
    "SEO",
    "WordPress",
  ];

  const tools = [
    { name: "Figma", color: "from-purple-500 to-pink-500" },
    { name: "Figma", color: "from-orange-500 to-red-500" },
    { name: "Sketch", color: "from-blue-400 to-cyan-400" },
    { name: "XD", color: "from-pink-500 to-purple-500" },
    { name: "Ps", color: "from-blue-600 to-blue-400" },
  ];

  const getAnimationClass = (type: string) => {
    switch(type) {
      case "float": return "icon-hover-float";
      case "glow": return "icon-hover-glow";
      case "scale": return "icon-hover-scale";
      case "pulse": return "icon-hover-pulse";
      default: return "icon-hover-float";
    }
  };

  const uploadFileMutation = trpc.files.uploadFile.useMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setUploadingFile(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];
        
        try {
          const result = await uploadFileMutation.mutateAsync({
            fileName: file.name,
            fileData: base64Data,
            mimeType: file.type,
            fileSize: file.size,
          });
          
          console.log("File uploaded successfully:", result);
        } catch (error) {
          console.error("Upload mutation failed:", error);
        } finally {
          setUploadingFile(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadingFile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Subtle animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Minimal top spacing */}
        <div className="h-4 md:h-8" />

        {/* Auth status bar */}
        {isAuthenticated && (
          <div className="px-4 md:px-6 lg:px-8 mb-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center text-sm">
              <span className="text-slate-400">Welcome, {user?.name}</span>
              <button
                onClick={() => logout()}
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main content container */}
        <div className="px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: Full-width stacked layout | Desktop: 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              
              {/* LEFT COLUMN (Mobile: Full-width, Desktop: Left side) */}
              <div className="flex flex-col gap-4 md:gap-5">
                
                {/* Hero Card - Compact with animated cursor */}
                <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm p-5 md:p-6 shadow-xl hover:shadow-2xl hover:border-slate-600/50 transition-all duration-500 group">
                  <div className="flex items-start justify-between gap-4">
                    {/* Text content */}
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold mb-1 leading-tight">
                        Hey, I'm Jake Bogan
                      </h1>
                      <div className="flex items-center gap-1 flex-wrap">
                        <p className="text-sm md:text-base text-slate-400 font-medium">
                          Front End Web Designer @
                        </p>
                        <span
                          className={`inline-block w-0.5 h-4 bg-blue-400 transition-opacity duration-300 ${
                            cursorVisible ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* Avatar with hover animation */}
                    <div className="text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0 animate-bounce">
                      👋
                    </div>
                  </div>
                </div>

                {/* Icon Grid - 3x2 on mobile with staggered animations */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 icon-grid">
                  {socialLinks.map((link, idx) => (
                    <button
                      key={idx}
                      className={`aspect-square rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-slate-700/50 hover:border-blue-400/50 transition-all duration-300 group/icon ${getAnimationClass(link.animationType)}`}
                      title={link.label}
                      onMouseEnter={() => setHoveredIcon(idx)}
                      onMouseLeave={() => setHoveredIcon(null)}
                    >
                      <link.icon className={`w-6 h-6 md:w-7 md:h-7 ${link.color} group-hover/icon:text-blue-400 transition-colors duration-300`} />
                    </button>
                  ))}
                </div>

                {/* Tools Card with animated tool icons */}
                <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm p-5 md:p-6 shadow-xl hover:shadow-2xl hover:border-slate-600/50 transition-all duration-500">
                  <h2 className="text-base md:text-lg font-bold mb-4">Tools I use</h2>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {tools.map((tool, idx) => (
                      <div
                        key={idx}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${tool.color} shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center text-xl font-bold text-white icon-hover-scale`}
                        title={tool.name}
                      >
                        {tool.name === "Figma" && "🎨"}
                        {tool.name === "Sketch" && "✏️"}
                        {tool.name === "XD" && "🎨"}
                        {tool.name === "Ps" && "📘"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Mobile: Full-width, Desktop: Right side) */}
              <div className="flex flex-col gap-4 md:gap-5">
                
                {/* Projects Card with layered 3D effect and file upload */}
                <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm p-5 md:p-6 shadow-xl hover:shadow-2xl hover:border-slate-600/50 transition-all duration-500 group">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base md:text-lg font-bold">Projects</h2>
                    <label className="cursor-pointer text-slate-400 hover:text-blue-400 transition-colors duration-300 text-lg group-hover:scale-125">
                      <Upload className="w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploadingFile || !isAuthenticated}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                  <div className="relative h-40 md:h-48 flex items-center justify-center perspective">
                    {/* Layered project mockups with 3D perspective */}
                    <div className="flex gap-3">
                      <div className="absolute w-20 h-28 rounded-lg bg-gradient-to-br from-slate-300 to-slate-200 border border-slate-400/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ transform: "translateX(-20px) rotateY(-8deg) rotateZ(-3deg)", zIndex: 0 }} />
                      <div className="absolute w-20 h-28 rounded-lg bg-gradient-to-br from-slate-200 to-slate-100 border border-slate-300/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ transform: "translateX(0px) rotateY(0deg)", zIndex: 1 }} />
                      <div className="absolute w-20 h-28 rounded-lg bg-gradient-to-br from-slate-400 to-slate-300 border border-slate-500/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ transform: "translateX(20px) rotateY(8deg) rotateZ(3deg)", zIndex: 2 }} />
                    </div>
                  </div>
                </div>

                {/* Services Card - Organic tag layout */}
                <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm p-5 md:p-6 shadow-xl hover:shadow-2xl hover:border-slate-600/50 transition-all duration-500">
                  <h2 className="text-base md:text-lg font-bold mb-4">Services</h2>
                  <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-start">
                    {/* SVG Icons - vertical text on left */}
                    <div className="text-xs font-semibold text-slate-500 transform -rotate-90 origin-center whitespace-nowrap mb-1">
                      SVG Icons
                    </div>
                    
                    {services.slice(1).map((service, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-full bg-slate-700/30 border border-slate-600/50 text-xs md:text-sm text-slate-300 hover:bg-slate-700/50 hover:border-blue-400/50 hover:text-blue-300 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Card with gradient background */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-700/50 backdrop-blur-sm p-5 md:p-6 shadow-xl hover:shadow-2xl hover:border-blue-400/50 transition-all duration-500 group">
                  <h2 className="text-base md:text-lg font-bold mb-2">Let's collab!</h2>
                  <p className="text-xs md:text-sm text-slate-400 mb-4 leading-relaxed">
                    Let's turn your idea into reality with my design experience!
                  </p>
                  {!isAuthenticated ? (
                    <Button
                      onClick={() => window.location.href = getLoginUrl()}
                      className="w-full bg-transparent border border-slate-500 hover:border-blue-400 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-xs md:text-sm hover:bg-blue-500/10 group-hover:scale-105"
                    >
                      Sign in to Contact
                    </Button>
                  ) : (
                    <Button className="w-full bg-transparent border border-slate-500 hover:border-blue-400 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-xs md:text-sm hover:bg-blue-500/10 group-hover:scale-105">
                      Contact me
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-slate-600">
          <p>© 2024 Jake Bogan. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
