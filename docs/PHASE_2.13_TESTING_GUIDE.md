# Phase 2.13 Schema Testing Guide

## How to Test New Schema Implementations

This guide explains how to test the new component schemas before proceeding with full implementation.

---

## Quick Test: watson-speech Schema

### Step 1: Start the Development Server

```bash
cd deployer-web/ui
npm run dev
```

The UI will be available at: `http://localhost:5173`

### Step 2: Navigate to Configuration Page

1. **Login** (if authentication is enabled, use mock credentials)
2. **Go to Component Selection Page**
3. **Select watson-speech component** (Watson Speech (STT and TTS))
4. **Click "Continue to Configuration"** button

### Step 3: Verify watson-speech Configuration Form

You should see the following sections and fields:

#### ✅ Basic Configuration Section
- **Speech-to-Text Size** - Dropdown (xsmall, small, medium, large)
- **Text-to-Speech Size** - Dropdown (xsmall, small, medium, large)
- **State** - Dropdown (installed, removed)

#### ✅ Installation Options Section (Collapsible)
- **STT Runtime** - Checkbox (default: checked)
- **STT Async** - Checkbox (default: unchecked)
- **STT Customization** - Checkbox (default: unchecked)
- **TTS Runtime** - Checkbox (default: checked)
- **TTS Customization** - Checkbox (default: unchecked)
- **STT Scale Config Size** - Dropdown (xsmall, small, medium, large)
- **TTS Scale Config Size** - Dropdown (xsmall, small, medium, large)
- **STT Models** - Array field with select options
- **TTS Voices** - Array field with select options

### Step 4: Test Field Interactions

1. **Change STT Size** → Verify dropdown works
2. **Toggle checkboxes** → Verify state changes
3. **Add/Remove STT Models** → Test array field functionality
4. **Add/Remove TTS Voices** → Test array field functionality

### Step 5: Verify YAML Preview

1. **Click "Preview YAML"** tab (if available)
2. **Verify generated YAML** includes:
   ```yaml
   - name: watson-speech
     stt_size: xsmall
     tts_size: xsmall
     state: installed
     installation_options:
       tags:
         sttRuntime: true
         sttAsync: false
         sttCustomization: false
         ttsRuntime: true
         ttsCustomization: false
       scaleConfig:
         stt:
           size: xsmall
         tts:
           size: xsmall
       sttModels:
       - enUsBroadbandModel
       - enUsNarrowbandModel
       ttsVoices:
       - enUSAllisonV3Voice
       - enUSLisaV3Voice
   ```

### Step 6: Test Configuration Save/Load

1. **Make changes** to watson-speech configuration
2. **Save configuration** (if save button available)
3. **Reload page**
4. **Verify changes persisted**

---

## Detailed Testing Checklist

### ✅ Visual Testing

- [ ] All fields render correctly
- [ ] Labels are clear and descriptive
- [ ] Help text appears on hover/click
- [ ] Sections are properly organized
- [ ] Collapsible sections work
- [ ] Form layout is responsive

### ✅ Functional Testing

- [ ] Dropdown fields show all options
- [ ] Checkboxes toggle correctly
- [ ] Number inputs accept valid ranges
- [ ] Text inputs accept valid characters
- [ ] Array fields allow add/remove items
- [ ] Required fields show validation errors
- [ ] Optional fields work without values

### ✅ Data Flow Testing

- [ ] Field changes update form state
- [ ] Form state updates YAML preview
- [ ] YAML preview shows correct structure
- [ ] Configuration can be exported
- [ ] Configuration can be imported
- [ ] State field changes (installed/removed)

### ✅ Integration Testing

- [ ] Schema loads from registry
- [ ] Default values populate correctly
- [ ] Validation rules work
- [ ] Error messages are clear
- [ ] Form submits successfully

---

## Testing Other Components

### Components with Default Schema (Before Enhancement)

To see the difference, test a component without a specific schema:

1. **Select a component** like `bigsql` or `mongodb`
2. **Navigate to Configuration**
3. **Observe:** Only basic state field available
4. **Compare:** Much simpler than watson-speech

### Components with Existing Schemas

Test existing schemas to ensure nothing broke:

1. **Select watson-assistant**
2. **Verify:** All existing fields still work
3. **Select watsonx_ai**
4. **Verify:** Model selection still works

---

## Browser Console Testing

### Check for Errors

Open browser console (F12) and look for:

```javascript
// Should NOT see these errors:
❌ TypeError: Cannot read property 'type' of undefined
❌ Warning: Failed prop type
❌ Uncaught Error in component

// Should see these (normal):
✅ Component mounted
✅ Schema loaded: watson-speech
✅ Form initialized with defaults
```

### Test Schema Loading

In browser console, run:

```javascript
// Check if schema exists
import { getComponentSchema } from './schemas/componentSchemas';
const schema = getComponentSchema('watson-speech');
console.log(schema);

// Should output the full schema object
```

---

## Manual YAML Validation

### Export Configuration

1. **Configure watson-speech** with custom values
2. **Export configuration** as YAML
3. **Save to file:** `test-config.yaml`

### Validate Structure

Check the exported YAML matches this structure:

```yaml
cp4d:
- project: cpd
  openshift_cluster_name: "{{ env_id }}"
  cp4d_version: latest
  cartridges:
  - name: watson-speech
    description: Watson Speech (STT and TTS)
    stt_size: small
    tts_size: medium
    state: installed
    installation_options:
      tags:
        sttRuntime: true
        sttAsync: true
        sttCustomization: false
        ttsRuntime: true
        ttsCustomization: true
      scaleConfig:
        stt:
          size: small
        tts:
          size: medium
      sttModels:
      - enUsBroadbandModel
      - enUsNarrowbandModel
      - enUsTelephony
      ttsVoices:
      - enUSAllisonV3Voice
      - enUSMichaelV3Voice
```

### Import Test

1. **Create a test YAML** with watson-speech configuration
2. **Import via Configuration Page**
3. **Verify:** All fields populate correctly
4. **Verify:** Nested values (tags, scaleConfig) load properly

---

## Performance Testing

### Load Time

1. **Open Configuration Page**
2. **Measure time** to render watson-speech form
3. **Expected:** < 500ms for form render

### Interaction Responsiveness

1. **Change field values rapidly**
2. **Verify:** No lag or freezing
3. **Expected:** Immediate visual feedback

---

## Regression Testing

### Ensure Existing Functionality Works

- [ ] Component Selection Page still works
- [ ] Dependency resolution still works
- [ ] Other component schemas still work
- [ ] YAML preview still works
- [ ] Import/Export still works
- [ ] Navigation still works

---

## Known Limitations to Test

### Array Fields (New Feature)

Array fields are NEW in this implementation. Test thoroughly:

1. **Add multiple items** to sttModels
2. **Remove items** from middle of array
3. **Reorder items** (if supported)
4. **Verify YAML** shows correct array format

### Nested Configuration (New Feature)

Nested fields use dot notation. Test:

1. **Change tags.sttRuntime**
2. **Verify YAML** shows nested structure:
   ```yaml
   tags:
     sttRuntime: true
   ```
3. **Not flat structure:**
   ```yaml
   tags.sttRuntime: true  # ❌ Wrong
   ```

---

## Automated Testing (Future)

### Unit Tests (To Be Added)

```typescript
describe('watson-speech schema', () => {
  it('should have correct component name', () => {
    expect(WATSON_SPEECH_SCHEMA.componentName).toBe('watson-speech');
  });
  
  it('should have basic and installation_options sections', () => {
    expect(WATSON_SPEECH_SCHEMA.sections).toHaveLength(2);
  });
  
  it('should have array fields for models and voices', () => {
    const installSection = WATSON_SPEECH_SCHEMA.sections[1];
    const sttModelsField = installSection.fields.find(f => f.name === 'sttModels');
    expect(sttModelsField?.type).toBe('array');
  });
});
```

---

## Troubleshooting

### Issue: Array fields don't render

**Solution:** Check if ConfigurationForm component supports 'array' type

### Issue: Nested fields show as flat

**Solution:** Verify YAML generation handles dot notation correctly

### Issue: Default values don't populate

**Solution:** Check defaultValue in schema matches expected type

### Issue: Validation errors on valid input

**Solution:** Review validation rules in schema definition

---

## Success Criteria

Before proceeding with more schemas, verify:

- ✅ watson-speech form renders completely
- ✅ All 15+ fields are visible and functional
- ✅ Array fields work (add/remove items)
- ✅ YAML preview shows correct nested structure
- ✅ Configuration can be saved and loaded
- ✅ No console errors
- ✅ Build passes without warnings
- ✅ Existing components still work

---

## Quick Command Reference

```bash
# Start dev server
cd deployer-web/ui && npm run dev

# Build for production
cd deployer-web/ui && npm run build

# Run tests (when available)
cd deployer-web/ui && npm test

# Check TypeScript errors
cd deployer-web/ui && npx tsc --noEmit

# Format code
cd deployer-web/ui && npm run format
```

---

## Next Steps After Testing

Once watson-speech schema is verified:

1. ✅ **Document any issues found**
2. ✅ **Fix issues before proceeding**
3. ✅ **Use watson-speech as template** for remaining schemas
4. ✅ **Continue with Day 1 remaining schemas** (7 more)

---

**Testing Status:** Ready to test  
**Estimated Testing Time:** 15-20 minutes  
**Priority:** HIGH - Must verify before continuing