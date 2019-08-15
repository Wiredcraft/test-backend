#[macro_use]
extern crate derive_more;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate failure;
#[macro_use]
extern crate serde;

mod api;
mod db;
mod error;
mod model;
mod schema;
mod session;

use std::env;

use actix_session::CookieSession;
use actix_web::{
    http,
    middleware::{errhandlers::ErrorHandlers, Logger},
    web, App, HttpServer,
};
use dotenv::dotenv;
use tera::Tera;

fn main() {
    dotenv().ok();
    env_logger::init();

    HttpServer::new(move || {
        let templates = Tera::new("templates/**/*").expect("Failed to load templates");

        let session = CookieSession::signed(&[0; 32]).secure(false);

        let error_handlers = ErrorHandlers::new()
            .handler(
                http::StatusCode::INTERNAL_SERVER_ERROR,
                api::internal_server_error,
            )
            .handler(http::StatusCode::BAD_REQUEST, api::bad_request)
            .handler(http::StatusCode::NOT_FOUND, api::not_found);

        let pool =
            db::PgPool::new(&env::var("DATABASE_URL").expect("env DATABASE_URL must be set"))
                .expect("Failed to create pg pool");

        App::new()
            .data(templates)
            .data(pool)
            .wrap(Logger::default())
            .wrap(session)
            .wrap(error_handlers)
            .service(web::resource("/").route(web::get().to_async(api::user::index)))
            .service(
                web::scope("/user")
                    .service(
                        web::resource("")
                            .route(web::post().to_async(api::user::create)),
                    )
                    .service(
                        web::resource("/{id}")
                            .route(web::get().to_async(api::user::get))
                            .route(web::put().to_async(api::user::update))
                            .route(web::delete().to_async(api::user::delete)),
                    ),
            )
            .service(actix_files::Files::new("/static", "static/"))
    })
    .bind("0.0.0.0:3000")
    .unwrap()
    .run()
    .unwrap();
}
