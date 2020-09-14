var locality = "New York NY",

    store = {
        name: "Garage",
        address: '525 E 11th St ' + locality,
        latLong: [40.727974, -73.980532]
    },

    initialInputRows = 5,

    transportation = 'DRIVING', // or 'DRIVING' or 'WALKING'

    dropoffSeconds = 300, // rough time stopped at a customer's location

    defaultColors = [
        "#e6194B",
        "#3cb44b",
        "#4363d8",
        "#9A6324",
        "#f032e6"
    ];