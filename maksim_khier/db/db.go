package db

import (
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"
  "os"
  "log"
  "io"
  "fmt"
  "flag"
)

var db *gorm.DB
var dbErr error
var logFile *os.File
var logErr error

func OpenDb() *gorm.DB {
  setLogFile()
  if os.Getenv("GIN_MODE") == "release" {
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASS")
    dbURL := os.Getenv("DB_URL")
    connAddr := fmt.Sprintf("%s:%s@tcp(%s:3306)/wiredcraft?charset=utf8&parseTime=True&loc=UTC", dbUser, dbPass, dbURL)
    db, dbErr = gorm.Open("mysql", connAddr)
  } else if flag.Lookup("test.v") != nil {
    connAddr := "root:@tcp(localhost:3306)/wiredcraft_test?charset=utf8&parseTime=True&loc=UTC"
    db, dbErr = gorm.Open("mysql", connAddr)
  } else {
    connAddr := "root:@tcp(localhost:3306)/wiredcraft?charset=utf8&parseTime=True&loc=UTC"
    db, dbErr = gorm.Open("mysql", connAddr)
  } 

  db.LogMode(true)

  if dbErr != nil {
    fmt.Println("Error connecting to wiredcraft db: ", dbErr)
  }
  db.SetLogger(gorm.Logger{log.New(io.MultiWriter(logFile, os.Stdout), "\r\n", 0)})
  return db
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
