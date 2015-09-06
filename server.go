//The main function and server are setup and ran here.

package main

import (
	"github.com/go-martini/martini"
	"github.com/jinzhu/gorm"
	"github.com/martini-contrib/render"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

//As long as the key "secret" is given in the `Authorization` header, it will allow access to
//restricted apis. This is a naive approach, but for now it demonstrates an authentication handler.
const APIKey = "secret"

//Creates a sqlite database. It can either be a file or an in memory database for testing.
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
func setupMartini() *martini.ClassicMartini {
	m := martini.Classic()
	m.Use(render.Renderer())

	//All of the routes require the auth handler
	m.Group("/user", func(router martini.Router) {
		router.Get("/", getAllUsersHandler)
		router.Get("/(?P<id>[0-9]+)", getUserHandler)
		router.Post("/", addUserHandler)
		router.Put("/(?P<id>[0-9]+)", updateUserHandler)
		router.Delete("/(?P<id>[0-9]+)", deleteUserHandler)
	}, authHandler)

	return m
}

func main() {
	m := setupMartini()
	//Use a local sqlite db
	handler, err := CreateDb("./test.db")
	if err != nil {
		log.Fatalln(err.Error())
	}
	m.Use(handler)
	m.Run()
}
