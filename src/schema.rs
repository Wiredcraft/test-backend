table! {
    users (id) {
        id -> Text,
        name -> Varchar,
        dob -> Date,
        address -> Text,
        description -> Text,
        created_at -> Timestamptz,
    }
}
