# Component Store State Debugging

## Run this in browser console to check component store state:

```javascript
(async function debugComponentStore() {
  console.log('=== COMPONENT STORE DEBUG ===\n');
  
  const { useComponentStore } = await import('/src/stores/componentStore.ts');
  const store = useComponentStore.getState();
  
  console.log('Total components:', store.components.length);
  console.log('Selected components:', store.components.filter(c => c.selected).length);
  
  console.log('\n📋 ALL COMPONENTS:');
  store.components.forEach((comp, idx) => {
    console.log(`${idx + 1}. ${comp.name} (id: ${comp.id})`);
    console.log(`   Selected: ${comp.selected}`);
    console.log(`   Category: ${comp.category}`);
  });
  
  console.log('\n✅ SELECTED COMPONENTS:');
  const selected = store.components.filter(c => c.selected);
  if (selected.length === 0) {
    console.log('❌ NO COMPONENTS SELECTED!');
  } else {
    selected.forEach((comp, idx) => {
      console.log(`${idx + 1}. ${comp.name} (id: ${comp.id})`);
    });
  }
  
  // Check if watson-speech exists
  const watsonSpeech = store.components.find(c => 
    c.id === 'watson-speech' || 
    c.name.toLowerCase().includes('watson') && c.name.toLowerCase().includes('speech')
  );
  
  if (watsonSpeech) {
    console.log('\n🔍 WATSON SPEECH COMPONENT:');
    console.log('ID:', watsonSpeech.id);
    console.log('Name:', watsonSpeech.name);
    console.log('Selected:', watsonSpeech.selected);
    console.log('Full object:', watsonSpeech);
  } else {
    console.log('\n❌ Watson Speech component NOT FOUND in store!');
  }
  
  console.log('\n=== END DEBUG ===');
})();
```

## What to look for:

1. **Total components** - Should be 63
2. **Selected components** - Should show watson-speech if you selected it
3. **Watson Speech component** - Check if `selected: true`

If watson-speech shows `selected: false`, the selection isn't being saved properly.