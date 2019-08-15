pub(crate) mod require {
    pub use std::ops::Deref;

    pub use super::*;
    pub use crate::{db::PgPool, session::*};
    pub use actix_session::Session;
    pub use actix_web::{
        error, http,
        web::{self, Data, Form, HttpResponse, Json, Path},
        Error, ResponseError,
    };
    pub use futures::Future;
    pub use tera::{Context, Tera};
}

pub mod user;

use actix_files::NamedFile;
use actix_web::{
    dev, http, middleware::errhandlers::ErrorHandlerResponse, Error, HttpResponse, Responder,
    ResponseError,
};

macro_rules! file_responder {
    ($path:expr, $res:expr) => {{
        NamedFile::open($path)
            .map_err(Into::into)
            .and_then(|file| {
                file.set_status_code($res.status())
                    .respond_to($res.request())
                    .map_err(Into::into)
            })
            .map(|new_resp| {
                ErrorHandlerResponse::Response($res.into_response(new_resp.into_body()))
            })
    }};
}

pub fn redirect_to(location: &str) -> HttpResponse {
    HttpResponse::Found()
        .header(http::header::LOCATION, location)
        .finish()
}

pub fn bad_request<B>(res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>, Error> {
    file_responder!("static/errors/400.html", res)
}

pub fn not_found<B>(res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>, Error> {
    file_responder!("static/errors/404.html", res)
}

pub fn internal_server_error<B>(
    res: dev::ServiceResponse<B>,
) -> Result<ErrorHandlerResponse<B>, Error> {
    file_responder!("static/errors/500.html", res)
}

impl ResponseError for crate::error::Error {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::InternalServerError().body(self.to_string())
    }
}
