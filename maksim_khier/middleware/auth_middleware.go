package middleware

import (
  "github.com/khier996/test-backend/maksim_khier/models"
  "github.com/khier996/test-backend/maksim_khier/db"
  "github.com/gin-gonic/gin"
  "strings"
  "net/http"
  "time"
  "strconv"
)

var wiredDB = db.OpenDb()

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    urlUserId, err := strconv.ParseUint(c.Param("id"), 10, 64)
    if err != nil {
      c.JSON(400, gin.H{"error": "user id in url is incorrect"})
      return
    }

    auth := c.Request.Header.Get("Authorization")
    authParts := strings.Split(auth, " ")
    var token string
    if len(authParts) < 2 {
      c.AbortWithStatus(http.StatusUnauthorized)
    } else {
      token = authParts[1]
    }

    var userToken models.UserToken
    wiredDB.Where("token = ?", token).First(&userToken)

    if userToken.ID == 0 {
      c.AbortWithStatus(http.StatusUnauthorized)
    } else if userToken.ExpiresAt.Before(time.Now()) {
      wiredDB.Delete(&userToken)
      c.JSON(400, gin.H{"error": "Registration expired. Login again"})
      c.AbortWithStatus(400)
    }

    var user models.User
    wiredDB.Model(&userToken).Related(&user)

    if uint64(user.ID) == urlUserId {
      c.Next()
    } else if user.ID == 0 {
      c.JSON(404, gin.H{"error": "user not found"})
    } else {
      c.AbortWithStatus(http.StatusUnauthorized)
    }
  }
}
