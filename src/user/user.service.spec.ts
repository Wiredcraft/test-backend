import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {getModelToken} from "@nestjs/mongoose";

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {

    class mockUserModel {
      constructor(public dto: any) {}
      save() { return this.dto; }
      static findById(id:string) { return {id, name: 'yarco002'}; }
      static findByIdAndUpdate(id:string, dto: any) { return dto; }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {provide: getModelToken('User'), useValue: mockUserModel}],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should have the name "yarco001" when user create', async () => {
    let user = await service.create({name: 'yarco001', dob: '2019-12-19', address: '', description: '', createdAt: Date.now()});
    expect(user.name).toEqual('yarco001');
  });

  it('should have the name "yarco002" when fetch a user', async () => {
    let user = await service.findById('0002');
    expect(user.id).toEqual('0002');
    expect(user.name).toEqual('yarco002');
  });

  it('should return the name "yarco003" when after updating', async () => {
    let user = await service.update('0003', {name: 'yarco003', dob: '2018-01-01', address:'', description: ''});
    expect(user.name).toEqual('yarco003');
    expect(user.dob).toEqual('2018-01-01');
  });

});
