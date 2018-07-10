package models

import (
  "time"
  "strings"
  "crypto/rand"
  "encoding/base64"
  "fmt"
  "github.com/khier996/test-backend/maksim_khier/db"
)

var wiredDB = db.OpenDb()

type User struct {
  ID uint64 `json:"id" gorm:"primary_key"`
  Email string `json:"email" gorm:"not null;unique"`
  Password string `json:"password" gorm:"-"`
  PasswordHash string `json:"-" gorm:"not null"`
  Name string `json:"name" gorm:"not null"`
  Dob string `json:"dob" gorm:"not null"`
  Address string `json:"address" gorm:"not null"`
  UserToken UserToken `json:"-"`
  UserTokenID int64 `json:"-"`
  Description string `json:"description" gorm:"not null"`
  CreatedAt time.Time `json:"createdAt" gorm:"not null"`
}

func (u *User) Valid() (bool, string) {
  var requiredFields []string
  if u.Email == "" { requiredFields = append(requiredFields, "email") }
  if u.Password == "" { requiredFields = append(requiredFields, "password") }
  if u.Name == "" { requiredFields = append(requiredFields, "name") }
  if u.Dob == "" { requiredFields = append(requiredFields, "dob") }
  if u.Address == "" { requiredFields = append(requiredFields, "address") }
  if u.Description == "" { requiredFields = append(requiredFields, "description") }

  if len(requiredFields) == 0 {
    return true, ""
  } else {
    errMessage := "[" + strings.Join(requiredFields, ", ") + "]" + " fields are required"
    return false, errMessage
  }
}

type UserToken struct {
  ID int64 `json:"id" gorm:"primary_key"`
  Token string `json:"token" gorm:"not null; index"`
  ExpiresAt *time.Time `json:"expires_at"`
  Error string `json:"error" gorm:"-"`
}

func (token *UserToken) Create() {
  randomString, err := generateRandomString(16)

  if err != nil { fmt.Println("Error generating random string: ", err.Error())}

  token.Token = randomString
  monthLater := time.Now().AddDate(0,1,0)
  token.ExpiresAt = &monthLater

  if tokenErr := wiredDB.Save(&token).Error; tokenErr != nil {
    fmt.Println("create token error: ", tokenErr.Error())
    token.Error = tokenErr.Error()
  }
}

func generateRandomString(n int) (string, error) {
  b := make([]byte, n)
  _, err := rand.Read(b)
    // Note that err == nil only if we read len(b) bytes.
  if err != nil {
    return "", err
  }
  return base64.URLEncoding.EncodeToString(b), err
}
