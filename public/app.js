const socket = io();

socket.on('gps-update', (data) => {
    document.getElementById('gps').textContent =
        JSON.stringify(data, null, 2);
});

socket.on('incident', (data) => {
    document.getElementById('incidents').textContent =
        JSON.stringify(data, null, 2);
});
