package main

import (
	"fmt"
	"time"
)

type User struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Dob         string    `json:"dob"`
	Address     string    `json:"address"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

func (u *User) String() string {
	return fmt.Sprintf("<ID: %d, Name: %s, Dob: %s, Address: %s, Description: %s, CreatedAt: %s>",
		u.ID, u.Name, u.Dob, u.Address, u.Description, u.CreatedAt.String())
}

//A predicate to filter collections of users on. Used in conjuction with the User filter function to
//filter out individual users that match certain attributes.
type UserPredicate func(User) bool

func FilterUsers(users []User, predicate UserPredicate) []User {
	filtered := make([]User, 0, 0)
	for _, u := range users {
		if predicate(u) {
			filtered = append(filtered, u)
		}
	}
	return filtered
}
