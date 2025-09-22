import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="text-center px-4">
                <div className="mb-8">
                    <ShinyText
                        text="404"
                        className="text-8xl font-bold text-white mb-4"
                    />
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Página no encontrada
                    </h1>
                    <p className="text-xl text-white/60 mb-8">
                        Lo sentimos, la página que buscas no existe.
                    </p>
                </div>

                <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <Link href="/blog" className="flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Volver al Blog
                    </Link>
                </Button>
            </div>
        </div>
    );
}
