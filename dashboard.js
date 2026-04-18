document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth Check ---
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    });

    const alertsList = document.getElementById('alerts-list');

    const fetchAlerts = async () => {
        const { data, error } = await supabaseClient
            .from('sos_alerts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            alertsList.innerHTML = `<p style="color: var(--danger)">Error loading alerts: ${error.message}</p>`;
            return;
        }

        if (data.length === 0) {
            alertsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.875rem;">No alerts right now. Systems normal.</p>`;
            return;
        }

        alertsList.innerHTML = data.map(alert => {
            const date = new Date(alert.created_at).toLocaleString();
            const mapsUrl = alert.latitude && alert.longitude 
                ? `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`
                : '#';
            const locationText = alert.latitude ? `${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}` : 'Unknown Location';

            return `
            <div class="alert-item">
                <div class="alert-info">
                    <strong>SOS TRIGGERED</strong><br>
                    <small style="color: var(--text-muted)">${date}</small><br>
                    <small style="color: var(--text-muted)">Location: ${locationText}</small>
                </div>
                ${alert.latitude 
                    ? `<a href="${mapsUrl}" target="_blank" class="btn-view">View Map</a>` 
                    : `<span style="color:var(--text-muted);font-size:0.75rem;">No GPS Data</span>`
                }
            </div>
            `;
        }).join('');
    };

    fetchAlerts();
    
    // Refresh periodically
    setInterval(fetchAlerts, 10000);
});
