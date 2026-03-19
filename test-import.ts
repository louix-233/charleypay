const run = async () => {
  console.log('Starting import of auth.ts');
  try {
    const authModule = await import('./src/api/routes/auth.ts');
    console.log('Successfully imported auth.ts');
  } catch (error) {
    console.error('Error importing auth.ts:', error);
  }
};
run();
