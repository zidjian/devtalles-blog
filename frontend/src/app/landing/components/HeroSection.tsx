import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge similar a la imagen */}
        <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white/80">
          <span className="mr-2">✨</span>
          Lo último en tecnología
        </div>

        <h1 className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl mb-6">
          Bitácora Dev, tu voz vive en la
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            comunidad.
          </span>
        </h1>

        <p className="mt-6 text-lg text-white/80 sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Descubre ideas, artículos y experiencias compartidas por la comunidad
          de Dev Talles. Un lugar donde la voz de cada miembro importa.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 pointer-events-auto">
          <Button size="lg" className="rounded-full cursor-pointer">
            Publicar
          </Button>
          <Button
            size="lg"
            className="rounded-full cursor-pointer"
            variant="outline"
          >
            Ver más
          </Button>
        </div>

        {/* Toggle similar a la imagen */}
      </div>
    </section>
  );
};
