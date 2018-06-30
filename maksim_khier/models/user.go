package models

import (
  "time"
  "strings"
)

type User struct {
  ID uint64 `json:"id" gorm:"primary_key"`
  Name string `json:"name" gorm:"not null"`
  Dob string `json:"dob" gorm:"not null"`
  Address string `json:"address" gorm:"not null"`
  Description string `json:"description" gorm:"not null"`
  CreatedAt time.Time `json:"createdAt" gorm:"not null"`
}

func (u *User) Valid() (bool, string) {
  var requiredFields []string
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
