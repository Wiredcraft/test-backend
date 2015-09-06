//The routes for the user API

package main

import (
	"fmt"
	"github.com/go-martini/martini"
	"github.com/jinzhu/gorm"
	"github.com/martini-contrib/render"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"time"
)

//An error struct to be passed back and forth with a code that notifies the client of what went wrong
//and a message. Easier than passing multiple params back and forth.
type httpError struct {
	code int
	msg  string
}

func (e *httpError) Error() string {
	return e.msg
}

func (e *httpError) toMartiniRender() (int, string) {
	return e.code, e.msg
}

//Ease of use method to find a specific user based on a predicate. Usually the predicate is an ID,
//but the method can maintain flexible for future changes.
func findUser(db *gorm.DB, predicate User) (User, *httpError) {
	//Be extremely careful here since gorm is awkward. Pass in an empty struct to where and
	//it doesn't apply a where clause. Pass in 0 for the id and it selects without clauses again
	if reflect.DeepEqual(User{}, predicate) {
		httpErr := &httpError{code: http.StatusBadRequest, msg: "User not found, empty struct given as predicate"}
		log.Println(httpErr)
		return User{}, httpErr
	}
	u := User{}
	err := db.Where(&predicate).First(&u).Error
	if err != nil {
		httpErr := &httpError{code: http.StatusNotFound, msg: "Resource not found"}
		log.Println(httpErr)
		return User{}, httpErr
	}
	return u, nil
}

//Method for ease of use when converting string to id and fetching a user for that id
func findUserFromIDParam(db *gorm.DB, idStr string) (User, *httpError) {
	id, err := strconv.Atoi(idStr)
	if err != nil {
		httpErr := &httpError{code: http.StatusBadRequest, msg: "Provide a proper id"}
		return User{}, httpErr
	}
	return findUser(db, User{ID: id})
}

//Simple auth handler based on a global key. This may have to be rewritten...
func authHandler(r *http.Request, ctx martini.Context, ren render.Render) {
	log.Println(r.Header)
	if r.Header.Get("Authorization") != APIKey {
		ren.Text(http.StatusUnauthorized, "Invalid authorization")
		return
	}
	//Call the next handler
	ctx.Next()
}

// Returns a json list of all the users
func getAllUsersHandler(db *gorm.DB, ren render.Render) {
	users := make([]User, 0, 0)
	if err := db.Find(&users).Error; err != nil {
		ren.Text(http.StatusInternalServerError, err.Error())
		return
	}
	ren.JSON(http.StatusOK, users)
}

//Gets a single user as specified in the `id` path param
func getUserHandler(db *gorm.DB, params martini.Params, ren render.Render) {
	u, err := findUserFromIDParam(db, params["id"])
	if err != nil {
		ren.Text(err.toMartiniRender())
		return
	}
	ren.JSON(http.StatusOK, u)
}

//Adds a user using POST data. Expects `Content-Type` to be `application/x-www-form-urlencoded`
func addUserHandler(db *gorm.DB, r *http.Request, ren render.Render) {
	name := r.FormValue("name")
	dob := r.FormValue("dob")
	address := r.FormValue("address")
	description := r.FormValue("description")

	toCheck := []string{name, dob, address, description}
	for _, key := range toCheck {
		if key == "" {
			ren.Text(http.StatusBadRequest, "Provide 'name', 'dob', 'address' and 'description' when creating a new user")
			return
		}
	}

	u := User{Name: name, Dob: dob, Address: address, Description: description, CreatedAt: time.Now()}
	db.Create(&u)
}

//Updates a user based on a given path parameter `id`. Beware: if there are no supplied parameters to
//updated it returns a 400 notifying that no update was made. We might need to change the status
//code, but I'd rather prefer the failure to be visible.
//Expects `Content-Type` to be `application/x-www-form-urlencoded`
func updateUserHandler(db *gorm.DB, params martini.Params, r *http.Request, ren render.Render) {
	u, err := findUserFromIDParam(db, params["id"])
	if err != nil {
		ren.Text(err.toMartiniRender())
		return
	}

	anyUpdates := false
	name := r.FormValue("name")
	if name != "" {
		anyUpdates = true
		u.Name = name
	}
	dob := r.FormValue("dob")
	if dob != "" {
		anyUpdates = true
		u.Dob = dob
	}
	address := r.FormValue("address")
	if address != "" {
		anyUpdates = true
		u.Address = address
	}
	description := r.FormValue("description")
	if description != "" {
		anyUpdates = true
		u.Description = description
	}

	if !anyUpdates {
		ren.Text(http.StatusBadRequest, "At least provide one valid parameter to update")
		return
	}

	if err := db.Save(u).Error; err != nil {
		ren.Text(http.StatusInternalServerError, err.Error())
		return
	}

	ren.JSON(http.StatusOK, u)
}

//Deletes a user based on a given path `id` param
func deleteUserHandler(db *gorm.DB, params martini.Params, ren render.Render) {
	u, err := findUserFromIDParam(db, params["id"])
	if err != nil {
		ren.Text(err.toMartiniRender())
		return
	}
	if db.Delete(&u).Error != nil {
		ren.Text(http.StatusInternalServerError, err.Error())
		return
	}
	ren.Text(http.StatusOK, fmt.Sprintf("User with id: %d was deleted", u.ID))
}
