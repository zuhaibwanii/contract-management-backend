const supabase = require('../services/supabase');

// async function createTableIfNotExists() {
//   const { error } = await supabase
//     .from('_placeholder') // This is ignored when using raw SQL
//     .sql(`
//       CREATE TABLE IF NOT EXISTS contracts (
//         contract_id INT8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//         content JSONB,
//         client_name TEXT,
//         status TEXT,
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//         active BOOLEAN DEFAULT TRUE
//       );
//     `);

//   if (error) console.error('Error creating table:', error)
//   else console.log('Table created or already exists')
// }

async function testSupabaseConnection() {
  try {
    console.log('🤞Trying to connect Supabase...');
    const { error } = await supabase.from('contracts').select().limit(1);
    if (error) throw error;
    console.log('✅Supabase connection established successfully');
  } catch (err) {
    console.error('💥Failed to connect to Supabase:', err);
  }
}

module.exports = { testSupabaseConnection }