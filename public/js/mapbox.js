/* eslint-disable */

export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidnR1cm51cyIsImEiOiJja2IybjNibGUwMG12Mnlqeno3MWV4MnUyIn0.WK-Z2K-8GFbG20fvXzLnKQ';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/vturnus/ckb2n9fdm02311infr6dpmnl7',
        scrollZoom: false,
        zoom: 5
        // center: [-73.970348, 40.785725],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        //Create Marker
        const el = document.createElement('div');
        el.className = 'marker';
        //Add The marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        //Add Pop-up
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        //Extends map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}

