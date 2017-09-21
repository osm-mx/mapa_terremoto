# mapeo_colaborativo

Herramienta para el reporte ciudadano.

Almacena los datos en CARTO, en las tablas:
- https://repubikla.carto.com/dataset/mapeo_comunitario
- https://repubikla.carto.com/dataset/mapeo_colaborativo_no_geo

Los datos almacenados en mapeo_colaborativo_no_geo son datos aportados telefonicamente o por whatsapp

TODO: crear script para georreferenciar la tabla mapeo_colaborativo_no_geo

Librerias de desarrollo:
- Leaflet
- Bootstrap
- Leaflet-draw (Libreria de dibujo en el mapa) (https://github.com/Leaflet/Leaflet.draw)

## Instalación

**Prerequisitos**
- [Node.js v4.8.4](https://nodejs.org/en/download/)
- npm (viene al instalar Node.js)

1. Clona el repo localmente
```
git clone https://github.com/miguelsalazar/mapeo_colaborativo
```
2. Instala los paquetes de `npm`:
```
npm install
```
3. Corre el proyecto:
```
npm start
```
4. La aplicación corre por default en el puerto `22345`
