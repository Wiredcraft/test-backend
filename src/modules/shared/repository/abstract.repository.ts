import { Model, Document } from "mongoose";


export abstract class AbstractRepository<A extends Document> {

	private model: Model<A>;
	protected constructor( model: Model<A> ) {
		this.model = model;
	}

	public async findAll() {
		return this.model.find();
	}

	public async findById( id: string ) {
		return this.model.findById( id );
	}

	public async findByIdAndUpdate( id: string, update: any ) {
		return this.model.findByIdAndUpdate( id, update );
	}

	public async findByIdAndDelete( id: string ) {
		return this.model.findByIdAndDelete( id );
	}

	public async create( data: any ) {
		return this.model.create( data );
	}

}
