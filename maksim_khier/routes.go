package main

import (
  "github.com/gin-contrib/cors"
  "github.com/khier996/test-backend/maksim_khier/handlers"
  "github.com/khier996/test-backend/maksim_khier/middleware"
)

func initializeRoutes() {
  setUpCors()

  api := router.Group("/api")
  api.GET("/users", handlers.GetUsers)
  api.POST("/user", handlers.CreateUser)

  userApi := api.Group("/user")
  userApi.Use(middleware.AuthMiddleware())
  userApi.GET("/:id", handlers.GetUser)
  userApi.PUT("/:id", handlers.UpdateUser)
  userApi.DELETE("/:id", handlers.DeleteUser)

  api.POST("/login", handlers.Login)
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
