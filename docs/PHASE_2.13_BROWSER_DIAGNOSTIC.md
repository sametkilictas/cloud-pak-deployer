# Browser Diagnostic Script for watson-speech Schema

## Run This in Browser Console

Open the Configuration Page with watson-speech selected, then open browser console (F12) and run:

```javascript
// Diagnostic Script for watson-speech Schema Issue
console.log('=== Watson Speech Schema Diagnostic ===');

// 1. Check if schema module is loaded
try {
  const schemas = await import('/src/schemas/componentSchemas.ts');
  console.log('✅ Schema module loaded');
  
  // 2. Get watson-speech schema
  const watsonSpeechSchema = schemas.WATSON_SPEECH_SCHEMA;
  console.log('Watson Speech Schema:', watsonSpeechSchema);
  
  // 3. Check sections
  if (watsonSpeechSchema && watsonSpeechSchema.sections) {
    console.log(`✅ Schema has ${watsonSpeechSchema.sections.length} sections`);
    watsonSpeechSchema.sections.forEach((section, idx) => {
      console.log(`  Section ${idx + 1}: ${section.title}`);
      console.log(`    Fields: ${section.fields.length}`);
      section.fields.forEach(field => {
        console.log(`      - ${field.name} (${field.type})`);
      });
    });
  } else {
    console.log('❌ Schema has no sections');
  }
  
  // 4. Check if schema is in registry
  const registry = schemas.COMPONENT_SCHEMAS;
  const inRegistry = 'watson-speech' in registry;
  console.log(`Schema in registry: ${inRegistry ? '✅' : '❌'}`);
  
  // 5. Test getComponentSchema function
  const retrievedSchema = schemas.getComponentSchema('watson-speech');
  console.log('Retrieved schema:', retrievedSchema);
  console.log(`Retrieved schema sections: ${retrievedSchema?.sections?.length || 0}`);
  
} catch (error) {
  console.error('❌ Error loading schema:', error);
}

console.log('=== End Diagnostic ===');
```

## Expected Output

If everything is working, you should see:

```
=== Watson Speech Schema Diagnostic ===
✅ Schema module loaded
Watson Speech Schema: {componentName: "watson-speech", displayName: "Watson Speech (STT and TTS)", sections: Array(2), ...}
✅ Schema has 2 sections
  Section 1: Basic Configuration
    Fields: 3
      - stt_size (select)
      - tts_size (select)
      - state (select)
  Section 2: Installation Options
    Fields: 9
      - tags.sttRuntime (boolean)
      - tags.sttAsync (boolean)
      - tags.sttCustomization (boolean)
      - tags.ttsRuntime (boolean)
      - tags.ttsCustomization (boolean)
      - scaleConfig.stt.size (select)
      - scaleConfig.tts.size (select)
      - sttModels (array)
      - ttsVoices (array)
Schema in registry: ✅
Retrieved schema: {componentName: "watson-speech", ...}
Retrieved schema sections: 2
=== End Diagnostic ===
```

## If Schema Not Found

If you see "Schema has no sections" or errors, the issue is with module loading. Try:

1. **Full restart:**
   ```bash
   # Kill the dev server completely
   # Then restart
   cd deployer-web/ui
   npm run dev
   ```

2. **Check for TypeScript errors:**
   ```bash
   cd deployer-web/ui
   npx tsc --noEmit
   ```

3. **Verify build:**
   ```bash
   cd deployer-web/ui
   npm run build
   ```

## Alternative: Check React DevTools

1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Find `ComponentConfigSection` component
4. Check props → look for `schema` prop
5. Expand schema → verify sections array

## Quick Fix: Force Module Reload

If schema is correct but not showing:

```javascript
// In browser console
window.location.reload(true); // Hard reload
```

Or:

```bash
# In terminal
cd deployer-web/ui
rm -rf node_modules/.vite
npm run dev