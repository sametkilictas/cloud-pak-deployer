# Watson Speech Configuration Debugging Guide

## Step 1: Check if Dev Server Restarted

1. Stop the dev server (Ctrl+C)
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart: `npm run dev`
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

## Step 2: Run Comprehensive Diagnostic in Browser Console

Open browser console and paste this entire script:

```javascript
(async function debugWatsonSpeech() {
  console.log('=== WATSON SPEECH COMPREHENSIVE DIAGNOSTIC ===\n');
  
  // 1. Check Schema Loading
  console.log('1️⃣ CHECKING SCHEMA MODULE...');
  try {
    const schemas = await import('/src/schemas/componentSchemas.ts');
    console.log('✅ Schema module loaded');
    
    const watsonSpeechSchema = schemas.WATSON_SPEECH_SCHEMA;
    if (!watsonSpeechSchema) {
      console.error('❌ WATSON_SPEECH_SCHEMA is undefined!');
      return;
    }
    
    console.log('Schema object:', watsonSpeechSchema);
    console.log(`Sections: ${watsonSpeechSchema.sections?.length || 0}`);
    
    if (watsonSpeechSchema.sections) {
      watsonSpeechSchema.sections.forEach((section, idx) => {
        console.log(`\n  Section ${idx + 1}: "${section.title}"`);
        console.log(`  Fields (${section.fields.length}):`);
        section.fields.forEach(field => {
          console.log(`    - ${field.name} (type: ${field.type}, label: "${field.label}")`);
        });
      });
    }
    
    // Check registry
    const inRegistry = 'watson-speech' in schemas.COMPONENT_SCHEMAS;
    console.log(`\n✅ Schema in registry: ${inRegistry}`);
    
    // Test retrieval
    const retrieved = schemas.getComponentSchema('watson-speech');
    console.log(`✅ Retrieved via getComponentSchema: ${retrieved ? 'YES' : 'NO'}`);
    if (retrieved) {
      console.log(`   Sections in retrieved: ${retrieved.sections?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error loading schema:', error);
    return;
  }
  
  // 2. Check Component Store
  console.log('\n2️⃣ CHECKING COMPONENT STORE...');
  try {
    const { useComponentStore } = await import('/src/stores/componentStore.ts');
    const store = useComponentStore.getState();
    
    const watsonSpeech = store.components.find(c => c.id === 'watson-speech');
    if (!watsonSpeech) {
      console.error('❌ watson-speech not found in component store!');
    } else {
      console.log('✅ watson-speech found in store');
      console.log('   Selected:', watsonSpeech.selected);
      console.log('   Name:', watsonSpeech.name);
      console.log('   Description:', watsonSpeech.description?.substring(0, 50) + '...');
    }
    
    const selectedList = store.getSelectedComponentsList();
    const isInSelected = selectedList.some(c => c.id === 'watson-speech');
    console.log(`✅ In selected list: ${isInSelected}`);
    
  } catch (error) {
    console.error('❌ Error checking component store:', error);
  }
  
  // 3. Check Config Store
  console.log('\n3️⃣ CHECKING CONFIG STORE...');
  try {
    const { useConfigStore } = await import('/src/stores/configStore.ts');
    const configStore = useConfigStore.getState();
    
    const config = configStore.configuration;
    console.log('Configuration object exists:', !!config);
    
    if (config?.cp4d?.[0]?.cartridges) {
      const watsonSpeechCartridge = config.cp4d[0].cartridges.find(c => c.name === 'watson-speech');
      if (watsonSpeechCartridge) {
        console.log('✅ watson-speech cartridge found in config');
        console.log('   Config keys:', Object.keys(watsonSpeechCartridge));
        console.log('   Config:', watsonSpeechCartridge);
      } else {
        console.log('⚠️  watson-speech cartridge NOT in config yet');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking config store:', error);
  }
  
  // 4. Check DOM Rendering
  console.log('\n4️⃣ CHECKING DOM RENDERING...');
  
  // Find watson-speech accordion item
  const accordions = document.querySelectorAll('.cds--accordion__item');
  console.log(`Total accordion items found: ${accordions.length}`);
  
  let watsonSpeechAccordion = null;
  accordions.forEach((accordion, idx) => {
    const title = accordion.querySelector('.cds--accordion__title');
    if (title && title.textContent.includes('watson-speech')) {
      watsonSpeechAccordion = accordion;
      console.log(`✅ Found watson-speech accordion at index ${idx}`);
    }
  });
  
  if (!watsonSpeechAccordion) {
    console.error('❌ watson-speech accordion NOT found in DOM!');
    console.log('Available accordion titles:');
    accordions.forEach((acc, idx) => {
      const title = acc.querySelector('.cds--accordion__title');
      console.log(`  ${idx}: ${title?.textContent || 'NO TITLE'}`);
    });
  } else {
    // Check if expanded
    const isExpanded = watsonSpeechAccordion.classList.contains('cds--accordion__item--active');
    console.log(`Accordion expanded: ${isExpanded}`);
    
    if (!isExpanded) {
      console.log('⚠️  Accordion is collapsed. Expanding it...');
      const heading = watsonSpeechAccordion.querySelector('.cds--accordion__heading');
      if (heading) {
        heading.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Check content
    const content = watsonSpeechAccordion.querySelector('.cds--accordion__content');
    if (content) {
      console.log('✅ Accordion content found');
      
      // Check for form sections
      const sections = content.querySelectorAll('.config-form__section');
      console.log(`Form sections found: ${sections.length}`);
      
      // Check for form fields
      const fields = content.querySelectorAll('.config-form__field');
      console.log(`Form fields found: ${fields.length}`);
      
      if (fields.length === 0) {
        console.error('❌ NO FORM FIELDS RENDERED!');
        console.log('Content HTML:', content.innerHTML.substring(0, 500));
      } else {
        console.log('✅ Form fields are rendering');
        fields.forEach((field, idx) => {
          const label = field.querySelector('label, .cds--label');
          const input = field.querySelector('input, select, textarea, .cds--multi-select');
          console.log(`  Field ${idx + 1}: ${label?.textContent || 'NO LABEL'} (${input?.tagName || 'NO INPUT'})`);
        });
      }
    } else {
      console.error('❌ Accordion content NOT found!');
    }
  }
  
  console.log('\n=== END DIAGNOSTIC ===');
  console.log('\n📋 SUMMARY:');
  console.log('If schema loads but fields don\'t render, the issue is in ConfigurationForm rendering logic.');
  console.log('If accordion is not found, the issue is in ComponentConfigSection filtering.');
  console.log('If config is missing, the issue is in config store initialization.');
  
})();
```

## Step 3: Analyze Results

Based on the diagnostic output, we'll know:

1. **Schema Loading**: Is the schema properly loaded with all 12 fields?
2. **Component Store**: Is watson-speech in the selected components list?
3. **Config Store**: Does watson-speech have a config entry?
4. **DOM Rendering**: Are the form fields actually in the DOM?

## Step 4: Manual Verification

If diagnostic shows schema is correct but fields don't render:

1. Open React DevTools
2. Find `<ConfigurationForm>` component for watson-speech
3. Check props:
   - `sections` prop should have 2 sections
   - `values` prop should have the config object
4. Check if `renderField` is being called for each field

## Step 5: Check Build

Run: `npm run build`

If build fails, there's a TypeScript or import error we need to fix.

## Expected Output

You should see:
- ✅ Schema has 2 sections with 12 total fields
- ✅ watson-speech in component store and selected
- ✅ watson-speech accordion in DOM
- ✅ Form sections found: 2
- ✅ Form fields found: 12

If any of these fail, we've found the issue!