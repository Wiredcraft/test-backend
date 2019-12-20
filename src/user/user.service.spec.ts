import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {getModelToken} from "@nestjs/mongoose";

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {

    class mockUserModel {
      constructor(public dto: any) {}
      save() { return this.dto; }
      static findById(id:string) { return {_id:id, name: 'yarco002', lean: function() {return this;}}; }
      static findByIdAndUpdate(id:string, dto: any) { dto.lean = function() { return this;}; return dto; }
      static findOne(cond:any) { return {_id:'12345', name: 'yarco004', password: '$2b$10$AgIFDQ08D39DNQiXA0kak.MZg5.tFgo1gdGbK02gfGHl/3rrXrn3W'}; }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {provide: getModelToken('User'), useValue: mockUserModel}],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should have the name "yarco001" when user create', async () => {
    let user = await service.create({name: 'yarco001', password: '1111', dob: '2019-12-19', address: '', description: ''});
    expect(user.name).toEqual('yarco001');
  });

  it('should have the name "yarco002" when fetch a user', async () => {
    let user = await service.findById('0002');
    expect(user._id).toEqual('0002');
    expect(user.name).toEqual('yarco002');
  });

  it('should return the name "yarco003" when after updating', async () => {
    let user = await service.update('0003', {dob: '2018-01-01', address:'', description: ''});
    expect(user.dob).toEqual('2018-01-01');
  });

  it('should return "yarco004" when executing find by username', async() => {
    let user = await service.findByUsername('yarco004');
    expect(user.name).toEqual('yarco004');
  });

});
