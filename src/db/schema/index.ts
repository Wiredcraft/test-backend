// this file is managed by migration process, you don't need to touch this.
export interface PhysicalTable {
    'migration': {
        id: number;
        name?: string;
    }
    'user': {
        id: number;
        latitude?: number;
        longitude?: number;
        ip?: number;
        dob?: Date;
        created_at?: Date;
        name: string;
        description?: string;
        address?: string;
    }
}
