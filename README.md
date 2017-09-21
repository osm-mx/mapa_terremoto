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

Para instalar las dependencias:

```
npm install
```

Para levantar el proxy a la base de datos:

```
npm start
```

Para probar la heramienta es necesario un servidor local de archivos, por ejemplo http-server.


```
npm install -g http-server
http-server client/
```

La herramienta estará disponible en [http://localhost:8080/](http://localhost:8080/):
