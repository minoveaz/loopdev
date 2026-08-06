const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sukjcsylkljiyvfklxvj.supabase.co';
const supabaseKey = 'sb_publishable_y7LKtWICauXvyWo6Aa9pSA_ylMUg845';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*');

  if (error) {
    console.error('Error fetching brands:', error);
    return;
  }

  console.log('Brands in Supabase:', JSON.stringify(data, null, 2));
}

checkBrands();
