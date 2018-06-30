package main

import (
  "github.com/khier996/test-backend/maksim_khier/models"
  "github.com/khier996/test-backend/maksim_khier/db"
  "github.com/gin-gonic/gin"
  "github.com/jinzhu/gorm"
)

var router *gin.Engine
var wiredDB *gorm.DB

func main() {
  wiredDB = db.OpenDb()
  wiredDB.AutoMigrate(&models.User{})
  router = gin.Default()
  initializeRoutes()
  router.Run(":8080")
}

