export const routes = [
    { title: 'Blog Home', url: '/blog' }, // public
    { title: 'Login', url: '/blog/login' }, // public
    { title: 'Signup', url: '/blog/signup' }, // public
    { title: 'Discord Callback', url: '/blog/discord-callback' }, // public - página de procesamiento
    { title: 'Discord Success', url: '/blog/discord-success' }, // public - página de éxito
    { title: 'Dashboard', url: '/blog/dashboard', rol: ['ADMIN'] },
    {
        title: 'List Categories',
        url: '/blog/listcategories',
        rol: ['ADMIN'],
    },
    { title: 'List Posts', url: '/blog/listposts', rol: ['ADMIN'] },
    {
        title: 'Create Category',
        url: '/blog/createcategory/:path*',
        rol: ['ADMIN'],
    },
    { title: 'Create Post', url: '/blog/createpost/:path*', rol: ['ADMIN'] },
    { title: 'Post', url: '/blog/post/:path*' }, // public
];
