#[derive(Debug, Fail, From)]
pub enum Error {
    #[fail(display = "diesel error: {}", _0)]
    Diesel(#[cause] diesel::result::Error),
    #[fail(display = "diesel r2d2 error: {}", _0)]
    DieselPool(#[cause] diesel::r2d2::PoolError),
}
