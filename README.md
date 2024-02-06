# Bot de vuelos
Esto esta WIP

El bot esta codeado en node y utiliza puppeteer para buscar vuelos en principio dentro de Almundo (la idea es ampliarlo a mas sitios)

### Requisitos Mínimos
- Node 16.15.0

### Features
- Busca los vuelos que esten por debajo del precio definido
- Dispara un toast cuando encuentra algun vuelo que cumpla con el precio
- Puede notificar por whats app si se le provee una api en el config.json (esta pensado para usarse con [esta api de whatsapp](https://github.com/pranavms13/whatsapp-node-api "esta api de whatsapp"))


### Como ejecutarlo
                
1. Definir en el config.json los destinos a buscar y el precio maximo por cada uno
2. npm install
3. node index.js
