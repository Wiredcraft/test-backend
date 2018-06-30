package main

import (
  "github.com/gin-contrib/cors"
  "github.com/khier996/test-backend/maksim_khier/handlers"
)

func initializeRoutes() {
  setUpCors()

  api := router.Group("/api")
  api.GET("/users", handlers.GetUsers)
  api.GET("/user/:id", handlers.GetUser)
  api.POST("/user", handlers.CreateUser)
  api.PUT("/user/:id", handlers.UpdateUser)
  api.DELETE("/user/:id", handlers.DeleteUser)
}

func setUpCors() {
  router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"*"},
    AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    AllowOriginFunc: func(origin string) bool {
      return true
    },
  }))
}
