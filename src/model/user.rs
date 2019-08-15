use super::require::*;
use crate::schema::users;
use diesel::insert_into;

#[derive(Queryable, Deserialize, Serialize)]
pub struct User {
    id: String,
    name: String,
    dob: NaiveDate,
    address: String,
    description: String,
    created_at: DateTime<Utc>,
}

#[derive(Deserialize, Insertable)]
#[table_name = "users"]
pub struct NewUser {
    id: String,
    name: String,
    dob: NaiveDate,
    address: String,
    description: Option<String>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "users"]
pub struct UpdateUser {
    dob: Option<NaiveDate>,
    address: Option<String>,
    description: Option<String>,
}

impl User {
    pub fn all(conn: &PgConnection) -> Result<Vec<User>, Error> {
        users::table
            .order(users::created_at.asc())
            .load::<User>(conn)
            .map_err(Into::into)
    }

    pub fn insert(user: &NewUser, conn: &PgConnection) -> Result<usize, Error> {
        insert_into(users::table)
            .values(user)
            .execute(conn)
            .map_err(Into::into)
    }

    pub fn get(id: &str, conn: &PgConnection) -> Result<User, Error> {
        users::table
            .filter(users::id.eq(id))
            .get_result(conn)
            .map_err(Into::into)
    }

    pub fn update(id: &str, user: &UpdateUser, conn: &PgConnection) -> Result<usize, Error> {
        update(users::table.filter(users::id.eq(id)))
            .set(user)
            .execute(conn)
            .map_err(Into::into)
    }

    pub fn delete(id: &str, conn: &PgConnection) -> Result<usize, Error> {
        delete(users::table.filter(users::id.eq(id)))
            .execute(conn)
            .map_err(Into::into)
    }
}
