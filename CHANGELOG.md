# Change Log
All notable changes to the "npmsmartimporter" extension will be documented in this file.

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
