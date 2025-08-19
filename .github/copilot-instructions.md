# Advocate Linkers Repository Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup and Dependencies
- Install Node.js v20.x if not available: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`
- Install .NET 8 SDK if working with mobile components: `wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && sudo dpkg -i packages-microsoft-prod.deb && sudo apt-get update && sudo apt-get install -y dotnet-sdk-8.0`

### Web Application (/web directory)
- **Prerequisites**: Node.js v20+ and npm v10+
- **Dependencies**: `cd web && npm install` -- takes 2 minutes. Set timeout to 5+ minutes.
- **Build**: `npm run build` -- takes 20 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
- **Development server**: `npm run serve` -- starts on http://localhost:8080
- **Linting**: `npm run lint` -- takes 2 seconds. Always run before committing.
- **Production build validation**: After building, check `dist/` directory contains generated assets

### Scripts Component (/scripts/cda-tracker directory)
- **Dependencies**: `cd scripts/cda-tracker && npm install` -- takes 25 seconds. Set timeout to 2+ minutes.
- **Tests**: `npx jest --env=node` -- takes 1 second. IMPORTANT: Must use `--env=node` flag to avoid localStorage issues.
- **Tests without flag will FAIL**: Regular `npm test` fails due to JSDOM localStorage configuration issue.

### Mobile Application (/mobile directory)
- **Prerequisites**: .NET 8 SDK (Android/iOS projects will be skipped on Linux)
- **Restore packages**: `dotnet restore mobile-social-linker.sln` -- takes 16 seconds. Set timeout to 2+ minutes.
- **Build core library**: `dotnet build mobile-social-linker.Common/mobile-social-linker.Common.csproj` -- takes 6 seconds.
- **Tests**: .NET Core 3.1 required for tests (currently incompatible with .NET 8 environment)
- **Working components**: Common library builds and works, iOS/Android projects require platform-specific environments

### Browser Extension (/extension directory)
- **No build process required**: Extension consists of static files
- **Development**: Load unpacked extension in Chrome/Edge developer mode
- **Key files**: manifest.json, popup.html, app.js, angular.min.js
- **Testing**: Point browser extension developer tools to the /extension directory

### CLI Tool
- **Global installation**: `npm install -g cxa-track` -- takes 10 seconds
- **Usage**: `cxa --help` shows all available options
- **Functionality**: Creates tracking links with WT.mc_id parameters

## Validation Scenarios

### Web Application Testing
- ALWAYS start the development server with `npm run serve` after making changes
- ALWAYS test that http://localhost:8080 responds with HTTP 200
- ALWAYS verify the page contains `<title>Social Linker</title>` and `<div id="app">`
- ALWAYS run `npm run lint` before committing - it fixes formatting automatically
- ALWAYS build with `npm run build` and verify the `dist/` directory is populated

### Scripts Testing
- ALWAYS run tests with `npx jest --env=node` not just `npm test`
- ALWAYS verify all 6 tests pass: tracking attachment, whitelist matching, query string handling, existing tracking preservation, regex domain matching, and hash handling

### Extension Testing
- ALWAYS verify these key files exist: manifest.json, popup.html, app.js, angular.min.js
- ALWAYS check the manifest.json is valid JSON with proper permissions
- Extension can be loaded directly in browser developer mode for testing

## Common Issues and Workarounds

### Build Timing Expectations
- **NEVER CANCEL**: Web app npm install takes 2 minutes - this is normal
- **NEVER CANCEL**: Web app build takes 20 seconds - wait for completion
- **NEVER CANCEL**: .NET restore takes 16 seconds - wait for completion
- Set timeouts generously: 5+ minutes for npm install, 2+ minutes for builds

### Known Issues
- **npm install warnings**: Many deprecation warnings in web app - this is expected, app still builds and runs correctly
- **npm audit vulnerabilities**: 99+ vulnerabilities reported - existing issue, does not prevent functionality
- **cda-tracker tests**: Must use `npx jest --env=node` flag or tests fail with localStorage error
- **Mobile tests**: Require .NET Core 3.1, incompatible with .NET 8 environment
- **iOS/Android projects**: Skip on Linux environments - this is expected behavior

### Azure Pipeline Integration
- Web app has Azure DevOps pipeline configuration in `azure-pipelines.yml`
- Pipeline builds Docker image and deploys to Azure Container Registry
- Uses Ubuntu 16.04 VM image for builds

## Repository Structure Quick Reference

### Key Directories
```
/web                    - Vue.js web application (main component)
/extension             - Chrome/Edge browser extension (AngularJS)
/mobile                - Xamarin mobile app (C#/.NET)
/scripts/cda-tracker   - JavaScript utility library with tests  
/cli                   - Contains reference to npm package cxa-track
```

### Important Files
```
/web/package.json           - Web app dependencies and scripts
/web/azure-pipelines.yml    - Azure DevOps CI/CD configuration
/extension/manifest.json    - Browser extension configuration
/mobile/mobile-social-linker.sln - .NET solution file
/scripts/cda-tracker/package.json - Script component configuration
```

### Build Outputs
```
/web/dist/             - Production build output (after npm run build)
/mobile/*/bin/         - .NET build outputs
```

## Working with Components

### When modifying web application
1. `cd web && npm install` (if dependencies changed)
2. `npm run serve` (start development server)
3. Make your changes
4. Test functionality at http://localhost:8080
5. `npm run lint` (fix formatting issues)
6. `npm run build` (create production build)
7. Verify build completed successfully

### When modifying browser extension
1. Make changes to files in /extension directory
2. Reload extension in browser developer mode
3. Test extension functionality
4. No build process required

### When modifying scripts/utilities
1. `cd scripts/cda-tracker && npm install` (if needed)
2. Make your changes
3. `npx jest --env=node` (run tests)
4. Verify all tests pass

### When modifying mobile app
1. `cd mobile && dotnet restore mobile-social-linker.sln`
2. Make changes to Common library
3. `dotnet build mobile-social-linker.Common/mobile-social-linker.Common.csproj`
4. Verify build succeeds

## Quick Commands Reference

```bash
# Web app - full workflow
cd web && npm install && npm run build && npm run lint && npm run serve

# Scripts - test workflow  
cd scripts/cda-tracker && npm install && npx jest --env=node

# Mobile - build workflow
cd mobile && dotnet restore mobile-social-linker.sln && dotnet build mobile-social-linker.Common/mobile-social-linker.Common.csproj

# CLI tool
npm install -g cxa-track && cxa --help
```