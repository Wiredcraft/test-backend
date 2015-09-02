//The main function and server are setup and ran here.

package main

import (
	"github.com/go-martini/martini"
	"github.com/jinzhu/gorm"
	"github.com/martini-contrib/render"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

//Creates a sqlite database. It can either be a file or an in memory database for testing
//Returns the martini handler used to inject it to martini
func CreateDb(dbfile string) (martini.Handler, error) {
	db, err := gorm.Open("sqlite3", dbfile)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	//Enable logging for queries
	db.LogMode(true)
	//This usually throws an error if the table already exists, but that's ok
	db.CreateTable(&User{})

	//Dependency inject the db for each handler
	handler := func(c martini.Context) {
		c.Map(&db)
	}
	return handler, nil
}

//Sets up martini and adds the route handlers for the api. Also injects the renderer used in most
//handlers. Note: You need to attach the database handler urself
func SetupMartini() *martini.ClassicMartini {
	m := martini.Classic()
	m.Use(render.Renderer())

	m.Group("/user", func(router martini.Router) {
		router.Get("/", GetAllUsersHandler)
		router.Get("/(?P<id>[0-9]+)", GetUserHandler)
		router.Post("/", AddUserHandler)
		router.Put("/(?P<id>[0-9]+)", UpdateUserHandler)
		router.Delete("/(?P<id>[0-9]+)", DeleteUserHandler)
	}, authHandler)

	return m
}

func main() {
	m := SetupMartini()
	//Use a local sqlite db
	handler, err := CreateDb("./test.db")
	if err != nil {
		log.Fatalln(err.Error())
	}
	m.Use(handler)
	m.Run()
}
