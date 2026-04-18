document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth Check ---
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    const user = session.user;

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    });

    const addBtn = document.getElementById('add-btn');
    const nameInput = document.getElementById('contact-name');
    const phoneInput = document.getElementById('contact-phone');
    const statusMsg = document.getElementById('status-msg');
    const contactList = document.getElementById('contact-list');

    const fetchContacts = async () => {
        const { data, error } = await supabaseClient
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            contactList.innerHTML = `<p style="color: var(--danger)">Error loading contacts</p>`;
            return;
        }

        if (data.length === 0) {
            contactList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.875rem;">No contacts added yet.</p>`;
            return;
        }

        contactList.innerHTML = data.map(contact => `
            <div class="contact-item">
                <div>
                    <strong>${contact.name}</strong><br>
                    <small style="color: var(--text-muted)">${contact.phone}</small>
                </div>
                <button class="delete-btn" onclick="deleteContact('${contact.id}')">Remove</button>
            </div>
        `).join('');
    };

    window.deleteContact = async (id) => {
        if (!confirm('Are you sure you want to remove this contact?')) return;
        await supabaseClient.from('emergency_contacts').delete().eq('id', id);
        fetchContacts();
    };

    addBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name || !phone) {
            statusMsg.style.color = 'var(--danger)';
            statusMsg.textContent = 'Please enter name and phone.';
            return;
        }

        statusMsg.style.color = 'var(--text-muted)';
        statusMsg.textContent = 'Saving...';
        addBtn.disabled = true;

        const { error } = await supabaseClient.from('emergency_contacts').insert([
            { user_id: user.id, name, phone }
        ]);

        addBtn.disabled = false;

        if (error) {
            statusMsg.style.color = 'var(--danger)';
            statusMsg.textContent = 'Failed to save contact.';
            console.error(error);
        } else {
            statusMsg.style.color = '#4ade80';
            statusMsg.textContent = 'Contact saved!';
            nameInput.value = '';
            phoneInput.value = '';
            fetchContacts();
            
            setTimeout(() => {
                statusMsg.textContent = '';
            }, 3000);
        }
    });

    fetchContacts();
});
