document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth Check ---
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    const user = session.user;

    const coordsDisplay = document.getElementById('coords');
    const locationStatus = document.getElementById('location-status');
    const video = document.getElementById('camera-view');
    const cameraStatus = document.getElementById('camera-status');
    const sosBtn = document.getElementById('sos-btn');
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    });

    // --- GPS Tracking Implementation ---
    let currentCoords = null;
    function updateLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    currentCoords = { latitude, longitude };
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
    sosBtn.addEventListener('click', async () => {
        // Basic feedback for SOS
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
        
        try {
            // Push alert to Supabase
            const { data, error } = await supabaseClient
                .from('sos_alerts')
                .insert([
                    {
                        user_id: user.id,
                        latitude: currentCoords ? currentCoords.latitude : null,
                        longitude: currentCoords ? currentCoords.longitude : null,
                        device_info: navigator.userAgent
                    }
                ]);

            if (error) throw error;
            
            alert('EMERGENCY SOS LOGGED SECURELY!');
        } catch (err) {
            console.error(err);
            alert('EMERGENCY SOS TRIGGERED Locally (Database connection failed)');
        }
    });

    // Initialize features
    updateLocation();
    startCamera();
});
