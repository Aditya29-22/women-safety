const supabaseUrl = 'https://hdrrqijccdpgxfvitvop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcnJxaWpjY2RwZ3hmdml0dm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDM3MTEsImV4cCI6MjA5MjExOTcxMX0.tJJIRrQz49nRNfzOEpm6MaPSfKbutvdSmBzoim6Llv4';

// Initialize Supabase Client
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
