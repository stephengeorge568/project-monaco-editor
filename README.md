# OT-Editor
This is the client for a web based collaborative code editor. Users can create documents and edit those documents with anyone that can access a browser. The editor supports features like cloud save, downloading the file, syntax highlighting, some simple intellisense, and more! 
## How to use

1. Download code. 
2. Download Docker. 
3. Perform command ‘docker build –t ot-editor .’ on root folder 
4. Perform command ‘docker run -p 80:80 ot-editor' 

Or, to local host, simply download Node, Angular CLI, and run ‘ng serve’ 

## Release Notes
September 2022: Only one document at a time can be supported. Some minor bugs with operational transformation process. UI experience is bad with no styling and no features besides editting.

October 2022: Generalization nearly complete. Multiple documents can be created, and mulitiple documents can be editted at once. Documents can be opened and editted. No way to save document model. Styling on pages is making progress.

November 2022: Generalization complete. Filesystem cloud saves enabled. Minor bug fixes. Styling on pages complete. Error handling displayed to user on wrong password requests for example.
