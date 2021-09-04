import userRepo, {
    User,
    CreateUserReply,
    UpdateUserReply,
    DeleteUserReply,
    ListUserRequest,
} from "../data/user";

// maybe this should be singleton
function newUserRepo() {
    return new userRepo();
}

class userUsecase {
    async CreateUser(u: User): Promise<CreateUserReply> {
        return await newUserRepo().CreateUser(u);
    }

    UpdateUser(u: User): UpdateUserReply {
        return newUserRepo().UpdateUser(u);
    }

    DeleteUser(id: string): DeleteUserReply {
        return newUserRepo().DeleteUser(id);
    }

    GetUser(id: string): User {
        return newUserRepo().GetUser(id);
    }

    ListUser(q: ListUserRequest): [User] {
        return newUserRepo().ListUser(q);
    }
}

export default function NewUserusecase() {
    return new userUsecase();
}
