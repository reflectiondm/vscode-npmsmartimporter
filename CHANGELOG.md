# Change Log
All notable changes to the "npmsmartimporter" extension will be documented in this file.
## [2.2.1]
- Settings are now correctly applied on a per-workspace basis
## [2.2.0]
- Smart importer now supports working in the multiple workspace environment
## [2.1.0]
- Fix local module import paths for Windows OS
- Support jsx files both for activating an extension and local modules import suggestions
## [2.0.0]
- It is possible now to find and import local modules as well as npm packages
- New settings were added to customize local modules importing behavior
- npmSmartImporter.ignore setting were added to ignore some folders of your project when searching for possible import options. It is an array of glob patterns and can be used like that:
```
"npmSmartImporter.ignore": ["**/public", "**/*.specs.js"]
```
- npmSmartImporter.excludeExtension setting were added to control weather a file extension should be included into import
- npmSmartImporter.skipInitialDotForRelativePath setting were added to omit the leading dot in import path
## [1.1.0]
- npmSmartImporter.customNamingConventions setting was added to allow using your own naming conventions for some packages. Simply add them to your vscode settings file:
```
"npmSmartImporter.customNamingConventions": {
  "osm": "awesome-package",
  "dash": "lodash"
}
```
## [1.0.0]
- Search through dependencies list is now word-based so for undeclared variable `bodyParser` a quick-fix for importing `body-parser` module will be available
- Smart importer now understands conventional names for knockout and lodash
## [0.1.1]
- Fix eslint integration on linux machines
## [0.1.0]
- Initial release
