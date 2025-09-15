import { NextRequest, NextResponse } from 'next/server';

// Mock data - categories as array
const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "React" },
  { id: 3, name: "Next.js" },
  { id: 4, name: "Backend" },
  { id: 5, name: "TypeScript" },
  { id: 6, name: "CSS" },
];

const blogPosts = [
  {
    id: 1,
    title: "Introducción a React Hooks",
    slug: "introduccion-a-react-hooks",
    description: "Aprende los fundamentos de los hooks en React y cómo mejorar tu código.",
    date: "2023-10-01",
    author: "Dev Talles",
    image: "/devi1.png",
    categories: ["React"],
    content: `
    <p>Los React Hooks son una característica introducida en React 16.8 que permiten usar estado y otras características de React en componentes funcionales sin necesidad de convertirlos a componentes de clase.</p>

    <h2>¿Qué son los Hooks?</h2>
    <p>Los Hooks son funciones que permiten "engancharse" a las características de React desde componentes funcionales. Esto significa que puedes usar estado, ciclo de vida y otras características de React sin escribir una clase.</p>

    <h2>Hooks más comunes</h2>
    <ul>
      <li><strong>useState:</strong> Para manejar estado local en componentes funcionales</li>
      <li><strong>useEffect:</strong> Para efectos secundarios en componentes funcionales</li>
      <li><strong>useContext:</strong> Para consumir contexto en componentes funcionales</li>
      <li><strong>useReducer:</strong> Para manejar estado complejo con reducers</li>
    </ul>

    <h2>Ejemplo básico de useState</h2>
    <pre><code>const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
}</code></pre>

    <p>Este es solo el comienzo. Los Hooks abren un mundo de posibilidades para escribir componentes más limpios y reutilizables en React.</p>
  `,
  },
  {
    id: 2,
    title: "Optimización de Performance en Next.js",
    slug: "optimizacion-de-performance-en-nextjs",
    description: "Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones Next.js.",
    date: "2023-09-15",
    author: "Dev Talles",
    image: "/devi2.png",
    categories: ["Next.js"],
    content: `
    <p>Next.js ofrece varias técnicas de optimización que pueden mejorar significativamente el rendimiento de tus aplicaciones web.</p>

    <h2>Image Optimization</h2>
    <p>Next.js incluye un componente Image optimizado que automáticamente optimiza las imágenes para diferentes dispositivos y formatos.</p>

    <h2>Code Splitting</h2>
    <p>Next.js divide automáticamente tu código en chunks más pequeños, cargando solo lo necesario para cada página.</p>

    <h2>Static Generation vs Server-Side Rendering</h2>
    <p>Elige la estrategia de renderizado correcta según las necesidades de tu aplicación: Static Generation para contenido estático o Server-Side Rendering para contenido dinámico.</p>
  `,
  },
  {
    id: 3,
    title: "Diseño de APIs RESTful",
    slug: "diseno-de-apis-restful",
    description: "Mejores prácticas para diseñar APIs que sean escalables y mantenibles.",
    date: "2023-08-30",
    author: "Dev Talles",
    image: "/devi3.png",
    categories: ["Backend"],
    content: `
    <p>Diseñar una API RESTful requiere seguir ciertos principios y mejores prácticas para asegurar que sea escalable y mantenible.</p>

    <h2>Principios REST</h2>
    <ul>
      <li><strong>Stateless:</strong> Cada petición debe contener toda la información necesaria</li>
      <li><strong>Cacheable:</strong> Las respuestas deben indicar si pueden ser cacheadas</li>
      <li><strong>Uniform Interface:</strong> Interfaz uniforme a través de recursos identificables</li>
    </ul>

    <h2>Mejores Prácticas</h2>
    <p>Usa sustantivos en lugar de verbos en las URLs, implementa versioning adecuado, y proporciona documentación clara con ejemplos.</p>
  `,
  },
  {
    id: 4,
    title: "Introducción a TypeScript",
    slug: "introduccion-a-typescript",
    description: "Aprende los fundamentos de TypeScript para mejorar tu desarrollo en JavaScript.",
    date: "2023-08-15",
    author: "Dev Talles",
    image: "/devi1.png",
    categories: ["TypeScript"],
    content: `
    <p>TypeScript es un superset de JavaScript que añade tipado estático opcional y otras características avanzadas.</p>

    <h2>¿Por qué TypeScript?</h2>
    <p>TypeScript ayuda a detectar errores en tiempo de desarrollo, mejora la mantenibilidad del código y proporciona una mejor experiencia de desarrollo.</p>

    <h2>Tipos básicos</h2>
    <ul>
      <li><strong>string:</strong> Para cadenas de texto</li>
      <li><strong>number:</strong> Para números</li>
      <li><strong>boolean:</strong> Para valores verdadero/falso</li>
      <li><strong>array:</strong> Para listas de elementos</li>
    </ul>

    <h2>Interfaces</h2>
    <p>Las interfaces permiten definir la estructura de objetos, asegurando consistencia en tu código.</p>
  `,
  },
  {
    id: 5,
    title: "Tailwind CSS Avanzado",
    slug: "tailwind-css-avanzado",
    description: "Técnicas avanzadas para crear diseños responsivos con Tailwind CSS.",
    date: "2023-07-30",
    author: "Dev Talles",
    image: "/devi2.png",
    categories: ["CSS"],
    content: `
    <p>Tailwind CSS es un framework de CSS utility-first que permite construir diseños rápidamente sin salir del HTML.</p>

    <h2>Responsive Design</h2>
    <p>Utiliza las clases de breakpoint de Tailwind para crear diseños que se adapten a diferentes tamaños de pantalla.</p>

    <h2>Componentes personalizados</h2>
    <p>Crea tus propios componentes reutilizables combinando las utilidades de Tailwind.</p>

    <h2>Configuración avanzada</h2>
    <p>Personaliza los colores, fuentes y espaciados de Tailwind para que se ajuste a tu marca.</p>
  `,
  },
  {
    id: 6,
    title: "Node.js y Express",
    slug: "nodejs-y-express",
    description: "Construye APIs robustas con Node.js y Express.",
    date: "2023-07-15",
    author: "Dev Talles",
    image: "/devi3.png",
    categories: ["Backend"],
    content: `
    <p>Node.js y Express forman una combinación poderosa para construir APIs backend escalables.</p>

    <h2>¿Qué es Express?</h2>
    <p>Express es un framework web minimalista para Node.js que facilita la creación de APIs RESTful.</p>

    <h2>Rutas y Middleware</h2>
    <p>Aprende a definir rutas para diferentes endpoints y usar middleware para procesar solicitudes.</p>

    <h2>Manejo de errores</h2>
    <p>Implementa estrategias efectivas para manejar errores en tu API.</p>
  `,
  },
  {
    id: 7,
    title: "Testing en React con Jest",
    slug: "testing-en-react-con-jest",
    description: "Aprende a escribir tests efectivos para tus componentes de React usando Jest.",
    date: "2023-07-01",
    author: "Dev Talles",
    image: "/devi1.png",
    categories: ["React"],
    content: `
    <p>Jest es un framework de testing desarrollado por Facebook que funciona perfectamente con React.</p>

    <h2>¿Por qué testear?</h2>
    <p>Los tests aseguran que tu código funcione correctamente y facilitan los cambios futuros.</p>

    <h2>Testing de componentes</h2>
    <p>Aprende a escribir tests para componentes React usando Jest y React Testing Library.</p>

    <h2>Cobertura de código</h2>
    <p>Mide qué porcentaje de tu código está cubierto por tests para asegurar calidad.</p>
  `,
  },
  {
    id: 8,
    title: "Animaciones con Framer Motion",
    slug: "animaciones-con-framer-motion",
    description: "Crea animaciones fluidas y atractivas en tus proyectos React.",
    date: "2023-06-15",
    author: "Dev Talles",
    image: "/devi2.png",
    categories: ["React"],
    content: `
    <p>Framer Motion es una librería de animaciones para React que hace fácil crear interfaces dinámicas.</p>

    <h2>Animaciones básicas</h2>
    <p>Aprende a animar propiedades CSS básicas como posición, tamaño y opacidad.</p>

    <h2>Gestos y eventos</h2>
    <p>Responde a interacciones del usuario con gestos de arrastrar, presionar y más.</p>

    <h2>Animaciones complejas</h2>
    <p>Crea secuencias de animaciones y transiciones entre estados.</p>
  `,
  },
  {
    id: 9,
    title: "Autenticación en NextAuth.js",
    slug: "autenticacion-en-nextauthjs",
    description: "Implementa autenticación segura y moderna en tus apps Next.js.",
    date: "2023-06-01",
    author: "Dev Talles",
    image: "/devi3.png",
    categories: ["Next.js"],
    content: `
    <p>NextAuth.js simplifica la implementación de autenticación en aplicaciones Next.js.</p>

    <h2>Proveedores de autenticación</h2>
    <p>Soporta múltiples proveedores como Google, GitHub, Facebook y más.</p>

    <h2>Sesiones y tokens</h2>
    <p>Maneja sesiones de usuario de forma segura con JWT y cookies.</p>

    <h2>Protección de rutas</h2>
    <p>Protege páginas y APIs con middleware de autenticación.</p>
  `,
  },
  {
    id: 10,
    title: "Consumo de APIs con SWR",
    slug: "consumo-de-apis-con-swr",
    description: "Optimiza el consumo de datos en React y Next.js usando SWR.",
    date: "2023-05-15",
    author: "Dev Talles",
    image: "/devi1.png",
    categories: ["React"],
    content: `
    <p>SWR es una librería de React para fetching de datos que optimiza el rendimiento y la experiencia de usuario.</p>

    <h2>¿Qué es SWR?</h2>
    <p>SWR significa stale-while-revalidate, una estrategia de caching inteligente.</p>

    <h2>Uso básico</h2>
    <p>Aprende a usar el hook useSWR para consumir APIs de forma eficiente.</p>

    <h2>Manejo de errores y loading</h2>
    <p>Maneja estados de carga y errores de manera elegante.</p>
  `,
  },
  {
    id: 11,
    title: "Deploy en Vercel",
    slug: "deploy-en-vercel",
    description: "Guía paso a paso para desplegar tus proyectos Next.js en Vercel.",
    date: "2023-05-01",
    author: "Dev Talles",
    image: "/devi2.png",
    categories: ["Next.js"],
    content: `
    <p>Vercel es una plataforma de deployment optimizada para aplicaciones Next.js.</p>

    <h2>Deploy automático</h2>
    <p>Conecta tu repositorio de Git y despliega automáticamente con cada push.</p>

    <h2>Variables de entorno</h2>
    <p>Configura variables de entorno de forma segura para diferentes entornos.</p>

    <h2>Domains personalizados</h2>
    <p>Asigna dominios personalizados a tus aplicaciones desplegadas.</p>
  `,
  },
  {
    id: 12,
    title: "Gestión de estado con Redux Toolkit",
    slug: "gestion-de-estado-con-redux-toolkit",
    description: "Simplifica la gestión de estado en aplicaciones React modernas.",
    date: "2023-04-15",
    author: "Dev Talles",
    image: "/devi3.png",
    categories: ["React"],
    content: `
    <p>Redux Toolkit es la forma recomendada de usar Redux en aplicaciones modernas.</p>

    <h2>¿Por qué Redux Toolkit?</h2>
    <p>Simplifica la configuración de Redux y reduce el código boilerplate.</p>

    <h2>Slices y reducers</h2>
    <p>Crea slices para manejar diferentes partes del estado de tu aplicación.</p>

    <h2>Async thunks</h2>
    <p>Maneja operaciones asíncronas con createAsyncThunk.</p>
  `,
  },
  {
    id: 13,
    title: "SEO en Next.js",
    slug: "seo-en-nextjs",
    description: "Mejora el posicionamiento de tus páginas con buenas prácticas de SEO.",
    date: "2023-04-01",
    author: "Dev Talles",
    image: "/devi1.png",
    categories: ["Next.js"],
    content: `
    <p>Next.js proporciona herramientas poderosas para optimizar el SEO de tus aplicaciones.</p>

    <h2>Meta tags</h2>
    <p>Configura títulos, descripciones y otras meta tags para cada página.</p>

    <h2>Open Graph</h2>
    <p>Mejora cómo se ven tus enlaces cuando se comparten en redes sociales.</p>

    <h2>Structured Data</h2>
    <p>Añade datos estructurados para que los motores de búsqueda entiendan mejor tu contenido.</p>
  `,
  },
  {
    id: 14,
    title: "Formularios con React Hook Form",
    slug: "formularios-con-react-hook-form",
    description: "Crea formularios robustos y fáciles de mantener en React.",
    date: "2023-03-15",
    author: "Dev Talles",
    image: "/devi2.png",
    categories: ["React"],
    content: `
    <p>React Hook Form es una librería performante para manejar formularios en React.</p>

    <h2>¿Por qué React Hook Form?</h2>
    <p>Mejora el rendimiento y reduce el código necesario para manejar formularios.</p>

    <h2>Validación</h2>
    <p>Integra validación con librerías como Yup o Zod.</p>

    <h2>Campos controlados</h2>
    <p>Maneja inputs de diferentes tipos de manera eficiente.</p>
  `,
  },
  {
    id: 15,
    title: "Estilos con Styled Components",
    slug: "estilos-con-styled-components",
    description: "Utiliza Styled Components para estilos dinámicos en React.",
    date: "2023-03-01",
    author: "Dev Talles",
    image: "/devi3.png",
    categories: ["CSS"],
    content: `
    <p>Styled Components permite escribir CSS en JavaScript para crear componentes estilizados.</p>

    <h2>¿Qué son Styled Components?</h2>
    <p>Una librería que permite escribir CSS dentro de tus componentes React.</p>

    <h2>Props y temas</h2>
    <p>Pasa props a tus componentes estilizados para cambiar su apariencia dinámicamente.</p>

    <h2>Temas globales</h2>
    <p>Crea temas consistentes para toda tu aplicación.</p>
  `,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Find the post by slug
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ post });
}