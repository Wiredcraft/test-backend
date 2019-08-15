use super::require::*;
use crate::model::user::*;

pub fn index(
    pool: Data<PgPool>,
    template: Data<Tera>,
    session: Session,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || User::all(pool.get_conn()?.deref()))
        .from_err()
        .then(move |res| {
            res.and_then(|users| {
                let mut context = Context::new();
                context.insert("users", &users);

                if let Some(flash) = get_flash(&session)? {
                    context.insert("msg", &(flash.kind, flash.message));
                    clear_flash(&session);
                }

                template
                    .render("index.html.tera", context)
                    .map_err(|e| {
                        println!("{:?}", e);
                        error::ErrorInternalServerError(e)
                    })
                    .map(|rendered| HttpResponse::Ok().body(rendered))
            })
        })
}

pub fn create(
    user: Form<NewUser>,
    pool: Data<PgPool>,
    session: Session,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || User::insert(&user, pool.get_conn()?.deref()))
        .from_err()
        .then(move |res| {
            res.and_then(|_| {
                set_flash(&session, FlashMessage::success("User successfully created"))
                    .map(|_| redirect_to("/"))
            })
        })
}

pub fn get(
    id: Path<String>,
    pool: Data<PgPool>,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || User::get(&id, &pool.get_conn()?.deref()))
        .from_err()
        .then(move |res| res.map(|user| HttpResponse::Ok().json(user)))
}

pub fn update(
    id: Path<String>,
    user: Json<UpdateUser>,
    pool: Data<PgPool>,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || User::update(&id, &user, pool.get_conn()?.deref()))
        .from_err()
        .then(move |res| res.map(|_| redirect_to("/")))
}

pub fn delete(
    id: Path<String>,
    pool: Data<PgPool>,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || User::delete(&id, pool.get_conn()?.deref()))
        .from_err()
        .then(move |res| res.map(|_| redirect_to("/")))
}
