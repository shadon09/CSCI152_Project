package myapp

import (
	"html/template"
	"net/http"
)

var tpl* template.Template

func init(){
	tpl = template.Must(template.ParseFiles("index.html"))
	http.Handle("/assets/", http.StripPrefix("/assets", http.FileServer(http.Dir("assets/"))))
	http.HandleFunc("/", index)

}

func index(res http.ResponseWriter, req* http.Request){
	if req.URL.Path != "/" {
		http.NotFound(res, req)
		return
	}
	tpl.ExecuteTemplate(res, "index.html", nil)
}