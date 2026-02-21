document.addEventListener('DOMContentLoaded', () => {
    const coordsDisplay = document.getElementById('coords');
    const locationStatus = document.getElementById('location-status');
    const video = document.getElementById('camera-view');
    const cameraStatus = document.getElementById('camera-status');
    const sosBtn = document.getElementById('sos-btn');

    // --- GPS Tracking Implementation ---
    function updateLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    coordsDisplay.textContent = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    locationStatus.textContent = 'Updating in real-time...';
                    locationStatus.style.color = '#4ade80';
                },
                (error) => {
                    locationStatus.textContent = `Error: ${error.message}`;
                    locationStatus.style.color = '#ef4444';
                },
                { enableHighAccuracy: true }
            );
        } else {
            locationStatus.textContent = "Geolocation not supported";
        }
    }

    // --- Camera Feed (Face Detection Placeholder) ---
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            video.srcObject = stream;
            cameraStatus.textContent = 'Face Detection Active';
            cameraStatus.classList.remove('loading');
        } catch (err) {
            cameraStatus.textContent = 'Camera Access Denied';
            cameraStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            cameraStatus.style.color = '#ef4444';
            console.error(err);
        }
    }

    // --- SOS Interaction ---
    sosBtn.addEventListener('click', () => {
        // Basic feedback for SOS
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
        alert('EMERGENCY SOS TRIGGERED! (Prototype)\nIn a real app, this would alert your contacts and authorities.');
    });

    // Initialize features
    updateLocation();
    startCamera();
});
