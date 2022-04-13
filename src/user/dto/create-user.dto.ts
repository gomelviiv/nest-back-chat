export class CreateUserDto {
  login;
  email;
  id;
  isActivated;
  picture;

  constructor(model) {
    this.login = model.login;
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.picture = model.picture;
  }
}
