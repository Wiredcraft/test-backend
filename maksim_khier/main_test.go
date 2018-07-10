package main

import (
  "github.com/khier996/test-backend/maksim_khier/models"
  "github.com/khier996/test-backend/maksim_khier/db"
  "net/http"
  "net/http/httptest"
  "testing"
  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
  "bytes"
  "encoding/json"
  "net/url"
)

var accessToken string

func TestRoutes(t *testing.T) {
  wiredDB = db.OpenDb()
  wiredDB.AutoMigrate(&models.User{}, &models.UserToken{})
  router = gin.Default()
  initializeRoutes()

  testCreateUser(t)
  testLogin(t)
  testGetUser(t)
  testGetUsers(t)
  testUpdateUser(t)
  testDeleteUser(t)
  defer cleanDB()
}

func testCreateUser(t *testing.T) {
  var validJsonStr = `{"email": "boris@uk.com", "password": "test", "name":"Boris", "dob": "1960-01-01T12:00:00Z", "address": "London", "description": "UK foreign minister"}`
  var invalidJsonStr = `{"name": "Boris"}`

  validRes := sendRequest("POST", "/api/user", validJsonStr)
  invalidRes := sendRequest("POST", "/api/user", invalidJsonStr)
  var user models.User
  wiredDB.First(&user)

  assert.Equal(t, validRes.Code, 200)
  assert.Equal(t, invalidRes.Code, 400)
  assert.Equal(t, "Boris", user.Name)
}

func testLogin(t *testing.T) {
  data := url.Values{}
  data.Set("email", "boris@uk.com")
  data.Add("password", "test")

  res := sendFormRequest("POST", "/api/login", data.Encode())
  type Token struct {
    Token string `json:"token"`
  }
  var token Token

  json.Unmarshal(res.Body.Bytes(), &token)
  accessToken = token.Token

  assert.NotEqual(t, "", token.Token)
}

func testGetUser(t *testing.T) {
  res := sendRequest("GET", "/api/user/1", "")

  var user models.User
  json.Unmarshal(res.Body.Bytes(), &user)

  assert.Equal(t, 200, res.Code)
  assert.Equal(t, "Boris", user.Name)
  assert.Equal(t, "London", user.Address)
}

func testGetUsers(t *testing.T) {
  res := sendRequest("GET", "/api/users", "")
  var users []models.User
  json.Unmarshal(res.Body.Bytes(), &users)

  assert.Equal(t, 1, len(users))
  assert.Equal(t, "Boris", users[0].Name)
}

func testUpdateUser(t *testing.T) {
  var jsonStr = `{"description": "unemployed"}`
  res := sendRequest("PUT","/api/user/1", jsonStr)

  var user models.User
  wiredDB.First(&user)

  assert.Equal(t, res.Code, 200)
  assert.Equal(t, "Boris", user.Name)
  assert.Equal(t, "unemployed", user.Description)
}

func testDeleteUser(t *testing.T) {
  res := sendRequest("DELETE","/api/user/1", "")
  var users []models.User

  wiredDB.Find(&users)

  assert.Equal(t, res.Code, 200)
  assert.Equal(t, 0, len(users))
}

func cleanDB() {
  wiredDB.Exec("DROP TABLE users")
}

func sendRequest(method, endpoint, body string) *httptest.ResponseRecorder {
  w := httptest.NewRecorder()
  req, _ := http.NewRequest(method, endpoint, bytes.NewBuffer([]byte(body)))
  req.Header.Set("Content-Type", "application/json")
  req.Header.Add("Authorization", "bearer " + accessToken)
  router.ServeHTTP(w, req)
  return w
}

func sendFormRequest(method, endpoint, body string) *httptest.ResponseRecorder {
  w := httptest.NewRecorder()
  req, _ := http.NewRequest(method, endpoint, bytes.NewBuffer([]byte(body)))
  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
  router.ServeHTTP(w, req)
  return w
}
