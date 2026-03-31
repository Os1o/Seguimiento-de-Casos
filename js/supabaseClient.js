// =====================================================
// SUPABASE CLIENT - Configuración de conexión
// =====================================================
// INSTRUCCIONES: Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY
// con los valores de tu proyecto en Supabase Dashboard > Settings > API

const SUPABASE_URL = 'https://aftirjgdksurquppbwqg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdGlyamdka3N1cnF1cHBid3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzYxNDcsImV4cCI6MjA5MDIxMjE0N30.nQYCX_-pn0OwEhNzejFN4h2uYL19azntAcOig-ZBCIw';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar conexión
async function verificarConexion() {
    try {
        const { data, error } = await supabase.from('delegaciones').select('id').limit(1);
        if (error) throw error;
        console.log('✅ Conexión a Supabase exitosa');
        return true;
    } catch (err) {
        console.error('❌ Error de conexión a Supabase:', err.message);
        return false;
    }
}
