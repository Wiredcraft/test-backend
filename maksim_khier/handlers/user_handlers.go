package handlers

import (
  "github.com/khier996/test-backend/maksim_khier/models"
  "github.com/khier996/test-backend/maksim_khier/utils"
  "github.com/gin-gonic/gin"
  "time"
  "strconv"
)

func GetUser(c *gin.Context) {
  userId, err := strconv.ParseUint(c.Param("id"), 10, 64)
  if err != nil {
    c.JSON(400, gin.H{"error": "user id is incorrect"})
    return
  }

  var user models.User
  wiredDB.First(&user, userId)
  if user.ID != 0 {
    c.JSON(200, user)
  } else {
    c.Status(404)
  }
}

func GetUsers(c *gin.Context) {
  offset := 0
  limit := 10

  if c.Query("per_page") != "" {
    if per_page, err := strconv.ParseInt(c.Query("per_page"), 10 ,32); err == nil {
      limit = int(per_page)
    }
  }

  if page, err := strconv.ParseInt(c.Query("page"), 10, 32); err == nil {
    offset = limit * (int(page) - 1)
  }

  var users []models.User
  if getError := wiredDB.Offset(offset).Limit(limit).Find(&users).Error; getError != nil {
    c.JSON(500, gin.H{"error": getError})
  } else {
    c.JSON(200, users)
  }
}

func CreateUser(c *gin.Context) {
  var user models.User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
  } else {
    if valid, errMes := user.Valid(); !valid {
      c.JSON(400, gin.H{"error": errMes})
      return
    }
    user.CreatedAt = time.Now()
    user.PasswordHash = utils.HashPassword(user.Password)

    if createErr := wiredDB.Create(&user).Error; createErr != nil {
      c.JSON(400, gin.H{"error": createErr})
    } else {
      c.JSON(200, user)
    }
  }
}

func UpdateUser(c *gin.Context) {
  userId, err := strconv.ParseUint(c.Param("id"), 10, 64)
  if err != nil {
    c.JSON(400, gin.H{"error": "user id is incorrect"})
    return
  }

  var user models.User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }

  user.ID = userId // make sure user_id is taken from url param, and not from payload
  findUser := models.User{ID: userId}
  if findData := wiredDB.First(&findUser); findData.Error != nil {
    c.JSON(400, gin.H{"error": "user not found"})
    return
  }

  if updateData := wiredDB.Model(&user).Updates(user); updateData.Error != nil {
    c.JSON(400, gin.H{"error": updateData.Error})
  } else {
    wiredDB.First(&user)
    c.JSON(200, user)
  }
}

func DeleteUser(c *gin.Context) {
  userId, err := strconv.ParseUint(c.Param("id"), 10, 64)
  if err != nil {
    c.JSON(400, gin.H{"error": "user id is incorrect"})
    return
  }
  user := models.User{ID: userId}
  if deleteErr := wiredDB.Delete(&user).Error; deleteErr != nil {
    c.JSON(400, gin.H{"error": deleteErr})
  } else {
    c.Status(200)
  }
}

func Login(c *gin.Context) {
  email := c.PostForm("email")
  password := c.PostForm("password")

  passwordHash := utils.HashPassword(password)
  user := models.User{}
  userToken := models.UserToken{}

  wiredDB.Where("email = ? AND password_hash = ?", email, passwordHash).First(&user)
  wiredDB.Model(&user).Related(&userToken)

  if userToken.ID != 0 {
    c.JSON(200, gin.H{"token": userToken.Token})
  } else if user.ID != 0 {
    var userToken models.UserToken
    userToken.Create()

    if userToken.Error == "" {
      wiredDB.Model(&user).Update("user_token_id", userToken.ID)
      c.JSON(200, gin.H{"token": userToken.Token})
    } else {
      c.JSON(400, gin.H{"error": userToken.Error})
    }
  } else {
    c.JSON(400, gin.H{"error": "Email-Password combination is not correct"})
  }
}
