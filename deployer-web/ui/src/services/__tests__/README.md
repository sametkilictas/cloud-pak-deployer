# Config Services Tests

Comprehensive test suite for config.yaml generation and validation services.

## Test Files

### configGenerator.test.ts
Tests for the config generator service that creates valid config.yaml structures.

**Test Coverage:**
- `VALID_CARTRIDGE_NAMES` constant validation
- `generateCartridges()` function
  - Foundation cartridges inclusion
  - originalName usage for cartridge names
  - Disabled component handling
  - Config merging
  - Default values
- `generateConfigYAML()` function
  - Complete config structure generation
  - Default values
  - Custom config merging
  - OpenShift config
  - CP4D config with cartridges
- `validateCartridgeNames()` function
  - Valid name validation
  - Invalid name detection
- Integration tests for full config generation flow

**Total Tests:** 30+

### configValidator.test.ts
Tests for the config validator service that validates config.yaml against reference-config.yaml.

**Test Coverage:**
- `validateCartridgeNames()` - Validates cartridge names against reference
- `validateCartridgeStates()` - Validates state values (installed/removed)
- `validateFoundationCartridges()` - Ensures cp-foundation and lite are present
- `validateGlobalConfig()` - Validates global_config section
- `validateOpenShiftConfig()` - Validates openshift section
- `validateCP4DConfig()` - Validates cp4d section
- `validateNoDuplicateCartridges()` - Detects duplicate cartridges
- `validateConfig()` - Complete config validation
- `validateComponentOriginalNames()` - Validates component originalName fields
- `formatValidationErrors()` - Formats validation results for display

**Total Tests:** 35+

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run specific test file
```bash
npm test configGenerator
npm test configValidator
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Test Structure

Each test file follows this structure:

1. **Imports** - Import functions and types to test
2. **Describe blocks** - Group related tests
3. **Setup** - Use `beforeEach` for test data setup
4. **Test cases** - Individual `it` blocks for specific scenarios
5. **Assertions** - Use `expect` for validation

## Key Test Scenarios

### Critical Path Tests
- ✅ Foundation cartridges always included
- ✅ originalName used for cartridge names (not UI id)
- ✅ Invalid cartridge names detected
- ✅ Duplicate cartridges detected
- ✅ Required config sections validated
- ✅ Complete config generation flow

### Edge Cases
- Empty component lists
- Disabled components
- Missing config sections
- Invalid state values
- Duplicate cartridges
- Missing foundation cartridges

### Integration Tests
- Full config generation with multiple components
- End-to-end validation flow
- Config structure compliance

## Test Data

Tests use mock Component objects with required fields:
- `id` - UI identifier
- `name` - Display name
- `originalName` - Backend cartridge name (CRITICAL)
- `description` - Component description
- `category` - Component category
- `state` - Component state
- `restrictions` - Restrictions array
- `externalDependencies` - External dependencies array
- `serviceDependencies` - Service dependencies array
- `componentDependencies` - Component dependencies array
- `configSchema` - Configuration schema

## Validation Rules

### Cartridge Names
Must match one of the 51 valid names from reference-config.yaml:
- cp-foundation, lite, scheduler, analyticsengine, bigsql, ca, dashboard, datagate, datalineage, dataproduct, datastage-ent, datastage-ent-plus, db2, db2wh, dmc, dods, dp, dpra, dv, edb_cp4d, factsheet, hee, mantaflow, match360, mongodb, openpages, planning-analytics, replication, rstudio, spss, streamsets, syntheticdata, udp, voice-gateway, watson-assistant, watson-discovery, watson-openscale, watson-speech, watsonx_ai, watsonx_data, watsonx_dataintegration, watsonx_dataintelligence, watsonx_data_premium, watsonx_governance, watsonx_orchestrate, wca, wca-ansible, wca-z, wca-z-ce, wkc, ikc_premium, ikc_standard, wml, wml-accelerator, ws, ws-pipelines, ws-runtimes, productmaster

### Cartridge States
Must be one of:
- `installed`
- `removed`

### Foundation Cartridges
Must always include:
- `cp-foundation`
- `lite`

### Config Structure
Must include all three sections:
- `global_config` with required fields
- `openshift` array with at least one entry
- `cp4d` array with at least one entry containing cartridges

## Continuous Integration

These tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- CI/CD pipeline

## Maintenance

When adding new features:
1. Add corresponding tests
2. Update this README
3. Ensure all tests pass
4. Maintain >80% code coverage

## Made with Bob