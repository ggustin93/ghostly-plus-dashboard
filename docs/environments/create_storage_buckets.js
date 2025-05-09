/**
 * This script creates the necessary storage buckets in Supabase for the GHOSTLY+ Dashboard.
 * It uses the Supabase JavaScript client to interact with the Storage API.
 * 
 * Run this script with:
 * node docs/environments/create_storage_buckets.js
 */

// Import required modules
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Define constants
const SUPABASE_URL = 'http://localhost:8000';
const REQUIRED_BUCKETS = [
  {
    name: 'c3d-files',
    public: false,
    description: 'Storage for C3D files from the OpenFeasyo game'
  },
  {
    name: 'reports',
    public: false,
    description: 'Storage for generated reports (PDFs, CSVs, etc.)'
  },
  {
    name: 'avatars',
    public: true,
    description: 'Public storage for user avatars and profile images'
  },
  {
    name: 'temp-uploads',
    public: false,
    description: 'Temporary storage for uploads in progress'
  }
];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function
async function main() {
  // Prompt for the service role key
  rl.question('Enter the Supabase service role key: ', async (serviceRoleKey) => {
    try {
      // Create Supabase client with service role key
      const supabase = createClient(SUPABASE_URL, serviceRoleKey);
      
      console.log('Connection established. Creating storage buckets...');
      
      // Create each required bucket
      for (const bucket of REQUIRED_BUCKETS) {
        try {
          // Check if bucket already exists
          const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
          
          if (listError) {
            throw new Error(`Error listing buckets: ${listError.message}`);
          }
          
          const bucketExists = existingBuckets.some(b => b.name === bucket.name);
          
          if (bucketExists) {
            console.log(`Bucket '${bucket.name}' already exists. Skipping.`);
            continue;
          }
          
          // Create the bucket
          const { data, error } = await supabase.storage.createBucket(
            bucket.name, 
            { 
              public: bucket.public,
              fileSizeLimit: 104857600, // 100MB limit
              allowedMimeTypes: bucket.name === 'c3d-files' 
                ? ['application/octet-stream'] 
                : undefined
            }
          );
          
          if (error) {
            throw new Error(`Error creating bucket '${bucket.name}': ${error.message}`);
          }
          
          console.log(`Successfully created bucket '${bucket.name}' (${bucket.public ? 'public' : 'private'})`);
          
          // Add bucket description using a meta-data file
          const { error: uploadError } = await supabase.storage
            .from(bucket.name)
            .upload('meta/description.txt', new Blob([bucket.description]));
          
          if (uploadError) {
            console.warn(`Warning: Could not add description to bucket '${bucket.name}': ${uploadError.message}`);
          }
        } catch (err) {
          console.error(`Error processing bucket '${bucket.name}': ${err.message}`);
        }
      }
      
      console.log('\nStorage buckets setup complete!');
      console.log('\nBucket details:');
      console.log('===================');
      
      for (const bucket of REQUIRED_BUCKETS) {
        console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'}): ${bucket.description}`);
      }
      
      console.log('\nYou can access these buckets via the Supabase API at:');
      console.log(`${SUPABASE_URL}/storage/v1/object/[bucket_name]/[file_path]`);
      console.log('\nOr through the Supabase Studio interface at:');
      console.log('http://localhost:54323/project/default/storage');
      
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      rl.close();
    }
  });
}

// Run the main function
main(); 