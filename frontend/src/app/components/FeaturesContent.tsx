"use client";
import SplitText from "@/components/SplitText";
import SpotlightCard from "@/components/SpotlightCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

export default function FeaturesContent() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center ">
          <h2 className="text-balance font-semibold">
            <SplitText
              text="Tu voz, tu código, tu comunidad"
              className="text-6xl font-semibold pb-4"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={() => {}}
            />
          </h2>
          <p className="mt-4">
            Un espacio donde cada idea cuenta y la comunidad crece contigo.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <CardHeader className="pb-3">
              <CardDecorator>
                <Image src="/devi1.png" alt="Logo" width={50} height={50} />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Escribe tu historia</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Publica artículos y experiencias para compartir tu voz con otros
                devs.
              </p>
            </CardContent>
          </SpotlightCard>
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <CardHeader className="pb-3">
              <CardDecorator>
                <Image src="/devi2.png" alt="Logo" width={50} height={50} />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Comparte tu trabajo</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Comparte tus proyectos y experiencias para compartir tu voz con
                otros devs.
              </p>
            </CardContent>
          </SpotlightCard>
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
                <Image src="/devi3.png" alt="Logo" width={50} height={50} />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Sigue a otros devs</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Sigue a otros devs para ver sus proyectos y experiencias.
              </p>
            </CardContent>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
