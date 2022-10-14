const STATIC_CACHE_NAME = 'static-cache-v1.1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';

// const cleanCache = (cacheName, maxSize)=>{
//     caches.open(cacheName)
//     .then((cache)=>{
//         return cache.keys()
//         .then((items)=>{
//             console.log(items);
//             if(items.length >= maxSize){
//                 cache.delete(items[0])
//                 .then(()=>{
//                     return cleanCache(cacheName, maxSize);
//                 })
//             }
//         })
//     })
// }

self.addEventListener('install', (event) => {
        console.log('SW: Instalado');
        const respCache = caches.open('Static').then((cache) => {
                return cache.addAll([
                        './',
                        './index.html',
                        './manifest.json',
                        './js/app.js',
                ])

        })

        const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
                return cache.addAll([
                        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css',
                        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js',
                        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
                        'https://static.guiainfantil.com/pictures/articulos/295-un-regalo-de-navidad-cuento-navideno.jpg',
                        'http://localhost:8080/images/icons/android-launchericon-48-48.png',
                        'http://localhost:8080/images/icons/android-launchericon-72-72.png',
                        'http://localhost:8080/images/icons/android-launchericon-96-96.png',
                        'http://localhost:8080/images/icons/android-launchericon-144-144.png',
                        'http://localhost:8080/images/icons/android-launchericon-192-192.png',
                        'http://localhost:8080/images/icons/android-launchericon-512-512.png',

                ])
        })
        event.waitUntil(Promise.all([respCacheInmutable, respCache]))
})

//primero intento siempre ir a la web y si no cache
self.addEventListener('fetch', (event)=>{
        console.log(event.request.url);
    
        const resp = fetch(event.request).then((respWeb)=>{
            if(!respWeb.ok){
                
                return caches.match(event.request)
                  
            }
    
            caches.open(DYNAMIC_CACHE_NAME).then((cacheDynamic)=>{
                cacheDynamic.put(event.request, respWeb)
            })
    
            return respWeb.clone();
        }).catch(()=>{
            return caches.match(event.request)
        })
    
    
        event.respondWith(resp);
    })
    