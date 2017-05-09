package myapp

import (
	"html/template"
	"net/http"
)

var tpl* template.Template

func init(){
	tpl = template.Must(template.ParseFiles("index.html"))
	http.Handle("/assets/", http.StripPrefix("/assets", http.FileServer(http.Dir("assets/"))))
	http.Handle("/test/", http.StripPrefix("/test", http.FileServer(http.Dir("test/"))))
	http.Handle("/node_modules/", http.StripPrefix("/node_modules", http.FileServer(http.Dir("node_modules/"))))
	http.HandleFunc("/", index)

}

func index(res http.ResponseWriter, req* http.Request){
	if req.URL.Path != "/" {
		http.NotFound(res, req)
		return
	}
	tpl.ExecuteTemplate(res, "index.html", nil)
}
