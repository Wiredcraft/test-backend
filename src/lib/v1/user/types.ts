interface UserModel {
  id?: string,
  name: string,
  dob: string,
  address: string,
  description: string,
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
  patchRouteParams,
  updateRouteParams,
  createRouteParams,
}
