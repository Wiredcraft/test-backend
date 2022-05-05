export namespace NPUsers {
  interface IUser {
    _id?: string, // new ObjectId("62678a85f0ee69eab5f672fc"),
    id: string,// '62678a85f0ee69eab5f672fd',
    name: string,// 'test03',
    password?: string,// '123456',
    dob: string,// 1998-05-10T00:00:00.000Z,
    address?: string,// 'shanghai',
    description?: string,// 'good man2',
    isDeleted?: string,// 'Y' | 'N
    createdAt?: string,// 2022-04-26T06:00:37.649Z,
    updatedAt?: string,// 2022-04-26T06:00:37.650Z,
    __v?: number,// 0
  }
}

export namespace NPLoginLog {
  interface ILoginLog {
    _id?: string,
    userId: string,// user is
    ip: string, // user login ip
    userAgent: string, // user login devices or application info
    __v?: number,// 0
  }
}

export namespace NPFollower {
  interface IFollower {
     starUserId: string,                      // start user ID
     fansUserId: string, // 'test',            // funs user ID
     isFollowing: string,
  }
}

export namespace NPLocation {
  interface ILocation {
    userId: string;
    loc: any
  }
}