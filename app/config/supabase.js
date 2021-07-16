import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

//const supabase_url = "https://tuwnrsobrvimvstdukxk.supabase.co";
//const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDM1NjgxMSwiZXhwIjoxOTM1OTMyODExfQ.HueFnaAhHtTjJP3ynDA_dIIzV-NtTG_kzOJmPox5bh0";
const supabase_url = "https://dugkgxxzdiwoiugewcis.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDg0NjM2NywiZXhwIjoxOTQwNDIyMzY3fQ.F6Bj7Uf286rcZfBkGPp7QAcqoQeCkN2aeDQ_QVx5-rg";
const supabase = createClient(supabase_url, supabase_key, {
  localStorage: AsyncStorage,
});

export default supabase;
