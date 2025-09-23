import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const ContentSection = () => {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                    <div className="relative w-full h-full aspect-square">
                            <Image
                                src="/fernando-herrera.jpg"
                                alt="Fernando Herrera"
                                fill
                                className="rounded-full object-covers"
                            />
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white/80 mb-4">
                            <span className="mr-2">👨‍💻</span>
                            Conoce al Experto
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Sobre el
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                                Autor
                            </span>
                        </h2>
                        <p className="text-white/80 leading-relaxed text-lg">
                            Fernando Herrera es un reconocido formador y desarrollador con
                            años de experiencia en la industria. Ha capacitado a miles de
                            estudiantes en tecnologías modernas y ha trabajado en proyectos
                            innovadores. Domina frameworks como React, Node.js, Angular y
                            Vue.js, siendo un referente en el mundo del desarrollo web.
                        </p>

                        <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <Link href="https://fernando-herrera.com/" target="_blank" className="flex items-center">
                                <span>Ver Más</span>
                                <ChevronRight className="size-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
