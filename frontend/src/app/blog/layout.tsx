import { Metadata } from "next";
import BlogFooter from "@/components/BlogFooter";
import BlogNavbar from "@/components/BlogNavbar";
import LiquidEther from "@/components/LiquidEther";
import Particles from "@/components/Particles";

export const metadata: Metadata = {
  title: "Blog - Dev Talles",
  description: "Blog de desarrollo y tecnología",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Fondo de partículas - Posición fija y detrás del contenido */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Contenido principal con z-index superior */}
      <div className="relative z-10">
        <BlogNavbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">{children}</div>
          <BlogFooter />
        </div>
      </div>
    </>
  );
}
