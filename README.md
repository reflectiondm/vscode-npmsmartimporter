# NPM Smart Importer
> Provides a quick fix command that inserts import statement for undeclared variables based on common naming conventions

## What is it for? 
 Forgetting to import an npm package in file can be frustrating and breaks the flow. But lo! Frustrate no more as Npm Smart Importer will fix this little problem for you!

## Picture worth a thousand words!
## Importing NPM packages
![](https://github.com/reflectiondm/vscode-npmsmartimporter/raw/master/assets/preview.gif)
## Importing local modules
![](https://github.com/reflectiondm/vscode-npmsmartimporter/raw/master/assets/preview-modules.gif)

## Features
When you have an undeclared variable in your code and use eslint or jshint linter, you will get a linter error. In this case you can click on the variable (with jshint you have to either put a cursor at the beginning of the variable or just highlight it) and a quick fix actions will appear providing a convenient way to add a missing import statement.
This smart helper can detect whether es6 imports or just plain old require is used in the file based on the existing imports.
Preferable imports type can be set via settings.
If you do not have a linter in your project, you can still make use of this extension by enabling the quickfixes for selection.

## Extension Settings

This extension contributes the following settings:

* `npmSmartImporter.autoDetectImportStatement`: Indicates if smart importer should figure out which import statement to use based on what imports are already present in the file. If none found it will adhere to useES6Import value. Default: true
* `npmSmartImporter.useES6Import`: If true, es6 import statement will be used for new imports. Default: true
* `npmSmartImporter.provideImportSuggestionsOnSelection`: If true, import suggestions will be provided not only for linting errors, but also when a variable is highlighted. It is useful when you do not use linter for some reason, or linting is disabled for undeclared variables. Default: false
* `npmSmartImporter.customNamingConventions`: An object with keys setting naming conventions for variables and values for package names used in the project. For example: { 'osm': 'awesome-package', 'tea: 'chai' } Default: {}

## Enjoy!

---------------
# Changelog
## [3.0.0]
- Smart importer now supports typescript (.ts and .tsx) files
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
  "tea": "chai"
}
```
## [1.0.0]
- Search through dependencies list is now word-based so for undeclared variable `bodyParser` a quick-fix for importing `body-parser` module will be available
- Smart importer now understands conventional names for knockout and lodash
## [0.1.1]
- Fix eslint integration on linux machines
## [0.1.0]
- Initial release

---------------
## License
MIT © [Andrei Zubov](https://github.com/reflectiondm)
