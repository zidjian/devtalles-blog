import { Metadata } from "next";
import BlogFooter from "@/components/BlogFooter";
import BlogNavbar from "@/components/BlogNavbar";
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
            {/* Fondo LiquidEther - Fijo y cubriendo toda la página */}
            <div className="fixed inset-0 z-0 w-full h-full bg-black">
                <Particles
                    particleColors={["#ffffff", "#ffffff"]}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation={false}
                />
            </div>

            <BlogNavbar />
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow">{children}</div>
                <BlogFooter />
            </div>
        </>
    );
}
