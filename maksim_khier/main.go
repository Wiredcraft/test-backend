package main

import (
  "github.com/khier996/test-backend/maksim_khier/models"
  "github.com/khier996/test-backend/maksim_khier/db"
  "github.com/gin-gonic/gin"
  "github.com/jinzhu/gorm"
  "os"
  "io"
  "log"
)

var router *gin.Engine
var wiredDB *gorm.DB
var logFile *os.File
var logErr error

func main() {
  wiredDB = db.OpenDb()
  wiredDB.AutoMigrate(&models.User{}, &models.UserToken{})
  defer wiredDB.Close()
  defer db.CloseLogFile()

  setLogFile()
  gin.DefaultWriter = io.MultiWriter(logFile, os.Stdout)
  defer logFile.Close()

  router = gin.Default()
  initializeRoutes()
  router.Run(":8080")
}

func setLogFile() {
  if _, fileErr := os.Stat("log/log"); os.IsNotExist(fileErr) {
    os.Mkdir("log", os.ModePerm)
    logFile, logErr = os.Create("log/log")
  } else {
    logFile, logErr = os.OpenFile("log/log", os.O_RDWR|os.O_APPEND, 0666)
  }
  if logErr != nil {
    log.Fatal(logErr)
  }
  return
}
