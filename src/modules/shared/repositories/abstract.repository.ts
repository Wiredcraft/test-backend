import { NotFoundException } from "@nestjs/common";
import { Model, Document } from "mongoose";


export abstract class AbstractRepository<A extends Document> {

	private model: Model<A>;

	protected constructor( model: Model<A> ) {
		this.model = model;
	}

	public async find( conditions = {} ) {
		return this.model.find( conditions );
	}

	public async findOrFail( conditions = {} ) {
		const resources = await this.find( conditions );
		if ( !resources || resources.length < 1 ) throw new NotFoundException( "Resources Not Found!" );
		return resources;
	}

	public async findById( id: string ) {
		return this.model.findById( id );
	}

	public async findByIdOrFail( id: string ) {
		const resource = await this.findById( id );
		if ( !resource ) throw new NotFoundException( "Resource Not Found!" );
		return resource;
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
