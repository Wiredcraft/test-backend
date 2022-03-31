interface UserModel {
  _id?: string,
  name: string,
  dob: string,
  address: string,
  description: string,
  createdAt: string
}

interface listRouteParams {
  perPage: number,
  page: number,
  orderBy: string,
  orderDir: "asc" | "desc"
}

interface patchRouteParams {
  userId?: string
  name?: string,
  dob?: string,
  address?: string,
  description?: string,
}

interface updateRouteParams {
  userId?: string
  name: string,
  dob: string,
  address: string,
  description: string,
}

interface createRouteParams {
  name: string,
  dob: string,
  address: string,
  description: string,
}

export {
  UserModel,
  listRouteParams,
  patchRouteParams,
  updateRouteParams,
  createRouteParams,
}
