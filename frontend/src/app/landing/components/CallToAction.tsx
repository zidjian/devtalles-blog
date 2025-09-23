import ShinyText from '@/components/ShinyText';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const CallToAction = () => {
    return (
        <section className="py-16  ">
            <div className="mx-auto max-w-5xl rounded-3xl px-6 py-12 md:py-20 lg:py-32 backdrop-blur-lg bg-white/7 border border-white/10">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                        <ShinyText
                            text="Descubre posts relacionados"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </h2>
                    <div className="mt-4">
                        <ShinyText
                            text="Explora posts relacionados con tus intereses y mantente al día."
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/blog">
                                <span>Ver Posts Relacionados</span>
                            </Link>
                        </Button>

                        <Button asChild size="lg" variant="outline">
                            <Link href="/blog">
                                <span>Ir al Blog</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
